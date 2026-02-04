"""
SANDBOX API - AI-Powered Formulation Recommendations
Uses Claude to understand formulation requirements and match with database ingredients
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import sqlite3
import json
import os

# Try to load dotenv
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("WARNING: python-dotenv not installed. Using environment variables directly.")

# Try to import anthropic
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("WARNING: anthropic package not installed. AI features will be disabled.")
    print("Install with: pip3 install anthropic")

sandbox_bp = Blueprint('sandbox', __name__)

# Initialize Anthropic client
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
client = None

if ANTHROPIC_AVAILABLE and ANTHROPIC_API_KEY:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
elif not ANTHROPIC_API_KEY:
    print("WARNING: ANTHROPIC_API_KEY not set. AI features will be disabled.")


def get_db():
    """Get database connection"""
    db_path = os.environ.get('DATABASE_PATH', 'swati_soaps.db')
    conn = sqlite3.connect(db_path, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def get_all_ingredients():
    """Get all ingredients with their benefits for context"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            i.id, i.name, i.inci_name, i.category_id,
            c.name as category_name,
            m.benefits, m.applications
        FROM ingredients i
        LEFT JOIN categories c ON i.category_id = c.id
        LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
    """)

    ingredients = []
    for row in cursor.fetchall():
        ingredients.append({
            'id': row['id'],
            'name': row['name'],
            'inci_name': row['inci_name'],
            'category': row['category_name'],
            'benefits': row['benefits'],
            'applications': row['applications']
        })

    conn.close()
    return ingredients


def search_formulations_by_ingredients(ingredient_names):
    """Find formulations that contain the specified ingredients"""
    if not ingredient_names:
        return []

    conn = get_db()
    cursor = conn.cursor()

    # Build query to find formulations containing any of the recommended ingredients
    placeholders = ','.join(['?' for _ in ingredient_names])

    cursor.execute(f"""
        SELECT DISTINCT
            f.id, f.product_name, f.status, f.current_version,
            f.total_cost_per_piece, f.grammage,
            GROUP_CONCAT(i.name, ', ') as matching_ingredients
        FROM formulations f
        JOIN formulation_ingredients fi ON f.id = fi.formulation_id
        JOIN ingredients i ON fi.ingredient_id = i.id
        WHERE LOWER(i.name) IN ({placeholders})
        GROUP BY f.id
        ORDER BY COUNT(DISTINCT i.id) DESC
        LIMIT 10
    """, [name.lower() for name in ingredient_names])

    formulations = []
    for row in cursor.fetchall():
        formulations.append({
            'id': row['id'],
            'product_name': row['product_name'],
            'status': row['status'],
            'current_version': row['current_version'],
            'total_cost_per_piece': row['total_cost_per_piece'],
            'grammage': row['grammage'],
            'matching_ingredients': row['matching_ingredients']
        })

    conn.close()
    return formulations


@sandbox_bp.route('/api/sandbox/ai-recommend', methods=['POST'])
@jwt_required()
def ai_recommend():
    """
    Two-step AI recommendation:
    1. Ask Claude to recommend ingredients based on purpose
    2. Search database for formulations with those ingredients
    """
    if not ANTHROPIC_AVAILABLE:
        return jsonify({'error': 'AI service not available. Please install: pip3 install anthropic'}), 503

    if not client:
        return jsonify({'error': 'AI service not configured. Please add ANTHROPIC_API_KEY.'}), 503

    try:
        data = request.get_json()
        purpose = data.get('purpose', '')
        product_type = data.get('product_type', '')
        constraints = data.get('constraints', [])
        mode = data.get('mode', 'general')  # 'general', 'ayurvedic', 'web'

        if not purpose:
            return jsonify({'error': 'Purpose is required'}), 400

        # Get all ingredients from database for context
        db_ingredients = get_all_ingredients()

        # Build ingredient list for Claude
        ingredient_list = "\n".join([
            f"- {ing['name']} ({ing['category']}): {ing['benefits'] or 'No benefits listed'}"
            for ing in db_ingredients
        ])

        # Build the prompt based on mode
        if mode == 'ayurvedic':
            system_prompt = """You are an expert in Ayurvedic formulations and traditional Indian cosmetics.
            You understand ancient texts like Charaka Samhita and their applications in modern soap and cosmetic making.
            Focus on traditional Ayurvedic ingredients and their therapeutic properties."""
        elif mode == 'web':
            system_prompt = """You are a cosmetic formulation expert who stays current with the latest trends
            and innovations in soap, skincare, and haircare formulations. Consider modern ingredients and
            trending formulation approaches."""
        else:
            system_prompt = """You are an expert cosmetic chemist specializing in soap, cream, and shampoo formulations.
            You understand ingredient interactions, regulatory requirements, and functional properties."""

        constraints_text = f"\nConstraints: {', '.join(constraints)}" if constraints else ""

        user_prompt = f"""I need to formulate a {product_type} product with this purpose: {purpose}{constraints_text}

Here are the ingredients available in our database:
{ingredient_list}

Based on the purpose and constraints, recommend:
1. CORE INGREDIENTS (3-5): Main functional ingredients that directly address the purpose
2. ADDITIVES (2-3): For improving lather, hardness, or texture as needed for {product_type}
3. ACTIVES (1-2): Special active ingredients for enhanced benefits
4. PERFUME/FRAGRANCE (1-2): Suitable fragrance that complements the product purpose

For each ingredient, provide:
- Name (must match exactly from the database list if available)
- Suggested percentage in formula
- Brief reason for inclusion

Respond in JSON format:
{{
    "coreIngredients": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}, ...],
    "additives": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}, ...],
    "actives": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}, ...],
    "perfumes": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}, ...],
    "formulationNotes": "Any special instructions or considerations",
    "ayurvedicNotes": "Traditional context if applicable"
}}"""

        # Call Claude API
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": user_prompt}
            ],
            system=system_prompt
        )

        # Parse Claude's response
        response_text = message.content[0].text

        # Extract JSON from response
        try:
            # Find JSON in response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                ai_recommendations = json.loads(json_str)
            else:
                ai_recommendations = {
                    "coreIngredients": [],
                    "additives": [],
                    "actives": [],
                    "perfumes": [],
                    "formulationNotes": response_text
                }
        except json.JSONDecodeError:
            ai_recommendations = {
                "coreIngredients": [],
                "additives": [],
                "actives": [],
                "perfumes": [],
                "formulationNotes": response_text
            }

        # Match recommended ingredients with database
        all_recommended_names = []
        for category in ['coreIngredients', 'additives', 'actives', 'perfumes']:
            for ing in ai_recommendations.get(category, []):
                all_recommended_names.append(ing.get('name', ''))

                # Try to find matching ingredient in database
                for db_ing in db_ingredients:
                    if db_ing['name'].lower() == ing.get('name', '').lower():
                        ing['id'] = db_ing['id']
                        ing['inDatabase'] = True
                        break
                else:
                    ing['inDatabase'] = False

        # Step 2: Find similar formulations
        similar_formulations = search_formulations_by_ingredients(all_recommended_names)

        return jsonify({
            'recommendations': ai_recommendations,
            'similarFormulations': similar_formulations,
            'mode': mode
        }), 200

    except Exception as e:
        error_msg = str(e)
        if 'anthropic' in error_msg.lower() or 'api' in error_msg.lower():
            return jsonify({'error': f'AI service error: {error_msg}'}), 503
        return jsonify({'error': error_msg}), 500


@sandbox_bp.route('/api/sandbox/search-by-function', methods=['POST'])
@jwt_required()
def search_by_function():
    """Search ingredients by their functional benefits"""
    try:
        data = request.get_json()
        keywords = data.get('keywords', [])

        if not keywords:
            return jsonify({'error': 'Keywords required'}), 400

        conn = get_db()
        cursor = conn.cursor()

        # Search ingredients where benefits or applications contain keywords
        conditions = []
        params = []
        for keyword in keywords:
            conditions.append("(LOWER(m.benefits) LIKE ? OR LOWER(m.applications) LIKE ?)")
            params.extend([f'%{keyword.lower()}%', f'%{keyword.lower()}%'])

        query = f"""
            SELECT DISTINCT
                i.id, i.name, i.inci_name,
                c.name as category_name,
                m.benefits, m.applications
            FROM ingredients i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE {' OR '.join(conditions)}
            ORDER BY i.name
        """

        cursor.execute(query, params)

        ingredients = []
        for row in cursor.fetchall():
            ingredients.append({
                'id': row['id'],
                'name': row['name'],
                'inci_name': row['inci_name'],
                'category': row['category_name'],
                'benefits': row['benefits'],
                'applications': row['applications']
            })

        conn.close()
        return jsonify({'ingredients': ingredients}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
