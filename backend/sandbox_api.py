"""
SANDBOX API - AI-Powered Formulation Recommendations
Three modes: General, Ayurvedic (classical texts only), Web (trending)
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import sqlite3
import json
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

sandbox_bp = Blueprint("sandbox", __name__)

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
client = None

if ANTHROPIC_AVAILABLE and ANTHROPIC_API_KEY:
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


def get_db():
    db_path = os.environ.get("DATABASE_PATH", "swati_soaps.db")
    conn = sqlite3.connect(db_path, timeout=30)
    conn.row_factory = sqlite3.Row
    return conn


def get_all_ingredients():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT i.id, i.name, i.inci_name, i.category_id,
               c.name as category_name, m.benefits, m.applications
        FROM ingredients i
        LEFT JOIN categories c ON i.category_id = c.id
        LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
    """)
    ingredients = []
    for row in cursor.fetchall():
        ingredients.append({
            "id": row["id"],
            "name": row["name"],
            "inci_name": row["inci_name"],
            "category": row["category_name"],
            "benefits": row["benefits"],
            "applications": row["applications"]
        })
    conn.close()
    return ingredients


def search_formulations_by_ingredients(ingredient_names):
    if not ingredient_names:
        return []
    conn = get_db()
    cursor = conn.cursor()
    placeholders = ",".join(["?" for _ in ingredient_names])
    cursor.execute(f"""
        SELECT DISTINCT f.id, f.product_name, f.status, f.current_version,
               f.total_cost_per_piece, f.grammage,
               GROUP_CONCAT(i.name, ", ") as matching_ingredients
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
            "id": row["id"],
            "product_name": row["product_name"],
            "status": row["status"],
            "current_version": row["current_version"],
            "total_cost_per_piece": row["total_cost_per_piece"],
            "grammage": row["grammage"],
            "matching_ingredients": row["matching_ingredients"]
        })
    conn.close()
    return formulations


GENERAL_PROMPT = """You are an expert cosmetic chemist. Recommend ingredients based on modern cosmetic science."""

AYURVEDIC_PROMPT = """You are an Ayurvedic Vaidya. ONLY recommend ingredients from classical Ayurvedic texts.
DO NOT recommend: Glycerin, Vitamin E, Salicylic Acid, Zinc Oxide, or any synthetic ingredient.
ONLY use: Traditional herbs, oils, and botanicals from Bhavaprakash Nighantu, Indian Materia Medica, Charaka Samhita.
Examples: Haridra (Turmeric), Nimba (Neem), Kumari (Aloe), Ashwagandha, Brahmi, Chandana (Sandalwood), Tulsi, Tila Taila (Sesame Oil), Narikela Taila (Coconut Oil).
For each ingredient provide: Sanskrit name, Reference text (e.g. Bhavaprakash Nighantu, Haritakyadi Varga), and Ayurvedic properties."""

WEB_PROMPT = """You are a beauty trend analyst. Recommend ingredients trending in the last 3 months.
Focus on TikTok, Instagram, beauty blogs. Explain why each ingredient is trending now."""


@sandbox_bp.route("/api/sandbox/ai-recommend", methods=["POST"])
@jwt_required()
def ai_recommend():
    if not ANTHROPIC_AVAILABLE:
        return jsonify({"error": "AI service not available"}), 503
    if not client:
        return jsonify({"error": "AI service not configured"}), 503

    try:
        data = request.get_json()
        purpose = data.get("purpose", "")
        product_type = data.get("product_type", "")
        constraints = data.get("constraints", [])
        mode = data.get("mode", "general")

        if not purpose:
            return jsonify({"error": "Purpose is required"}), 400

        db_ingredients = get_all_ingredients()
        ing_list = []
        for ing in db_ingredients:
            benefits = ing["benefits"] if ing["benefits"] else "No benefits listed"
            ing_list.append(f"- {ing["name"]} ({ing["category"]}): {benefits}")
        ingredient_list = "\n".join(ing_list)

        constraints_text = ""
        if constraints:
            constraints_text = "\nConstraints: " + ", ".join(constraints)

        if mode == "ayurvedic":
            system_prompt = AYURVEDIC_PROMPT
            user_prompt = f"""Create an Ayurvedic {product_type} for: {purpose}{constraints_text}

ONLY recommend traditional Ayurvedic ingredients. NO modern/synthetic ingredients.

Database ingredients:
{ingredient_list}

JSON format:
{{
    "coreIngredients": [{{"name": "...", "sanskritName": "...", "reference": "Bhavaprakash Nighantu, [Varga]", "properties": "Rasa, Guna, Virya", "suggestedPercentage": X}}],
    "additives": [{{"name": "...", "sanskritName": "...", "reference": "...", "suggestedPercentage": X}}],
    "actives": [{{"name": "...", "sanskritName": "...", "reference": "...", "therapeuticAction": "...", "suggestedPercentage": X}}],
    "perfumes": [{{"name": "...", "sanskritName": "...", "reference": "...", "suggestedPercentage": X}}],
    "formulationNotes": "...",
    "references": ["Bhavaprakash Nighantu", "Indian Materia Medica", ...]
}}"""

        elif mode == "web":
            system_prompt = WEB_PROMPT
            user_prompt = f"""Create a TRENDING {product_type} for: {purpose}{constraints_text}

Focus on ingredients trending in the last 3 months.

Database ingredients:
{ingredient_list}

JSON format:
{{
    "coreIngredients": [{{"name": "...", "trendReason": "Why trending", "trendSource": "TikTok/Instagram/etc", "suggestedPercentage": X}}],
    "additives": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}],
    "actives": [{{"name": "...", "trendReason": "...", "suggestedPercentage": X}}],
    "perfumes": [{{"name": "...", "trendReason": "...", "suggestedPercentage": X}}],
    "formulationNotes": "...",
    "trendingSummary": "Current beauty trends addressed"
}}"""

        else:
            system_prompt = GENERAL_PROMPT
            user_prompt = f"""Create a {product_type} for: {purpose}{constraints_text}

Database ingredients:
{ingredient_list}

JSON format:
{{
    "coreIngredients": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}],
    "additives": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}],
    "actives": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}],
    "perfumes": [{{"name": "...", "suggestedPercentage": X, "reason": "..."}}],
    "formulationNotes": "..."
}}"""

        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2500,
            messages=[{"role": "user", "content": user_prompt}],
            system=system_prompt
        )

        response_text = message.content[0].text

        try:
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                ai_recommendations = json.loads(response_text[json_start:json_end])
            else:
                ai_recommendations = {"formulationNotes": response_text}
        except json.JSONDecodeError:
            ai_recommendations = {"formulationNotes": response_text}

        all_recommended_names = []
        for category in ["coreIngredients", "additives", "actives", "perfumes"]:
            for ing in ai_recommendations.get(category, []):
                all_recommended_names.append(ing.get("name", ""))
                for db_ing in db_ingredients:
                    if db_ing["name"].lower() == ing.get("name", "").lower():
                        ing["id"] = db_ing["id"]
                        ing["inDatabase"] = True
                        break
                else:
                    ing["inDatabase"] = False

        similar_formulations = search_formulations_by_ingredients(all_recommended_names)

        return jsonify({
            "recommendations": ai_recommendations,
            "similarFormulations": similar_formulations,
            "mode": mode
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@sandbox_bp.route("/api/sandbox/search-by-function", methods=["POST"])
@jwt_required()
def search_by_function():
    try:
        data = request.get_json()
        keywords = data.get("keywords", [])
        if not keywords:
            return jsonify({"error": "Keywords required"}), 400

        conn = get_db()
        cursor = conn.cursor()
        conditions = []
        params = []
        for keyword in keywords:
            conditions.append("(LOWER(m.benefits) LIKE ? OR LOWER(m.applications) LIKE ?)")
            params.extend(["%" + keyword.lower() + "%", "%" + keyword.lower() + "%"])

        cursor.execute(f"""
            SELECT DISTINCT i.id, i.name, i.inci_name, c.name as category_name,
                   m.benefits, m.applications
            FROM ingredients i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE {" OR ".join(conditions)}
            ORDER BY i.name
        """, params)

        ingredients = []
        for row in cursor.fetchall():
            ingredients.append({
                "id": row["id"],
                "name": row["name"],
                "inci_name": row["inci_name"],
                "category": row["category_name"],
                "benefits": row["benefits"],
                "applications": row["applications"]
            })
        conn.close()
        return jsonify({"ingredients": ingredients}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
