"""
Ingredients API Module - Clean 4-table schema implementation
Handles all ingredient CRUD operations with normalized database structure

Uses named column access for maintainability and integrates with existing app.py patterns
"""

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
import sqlite3

# Create Blueprint
ingredients_bp = Blueprint('ingredients_api', __name__)

def get_db():
    """Get database connection using app config"""
    conn = sqlite3.connect(current_app.config['DATABASE'])
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

# ============================================================================
# GET ALL INGREDIENTS
# ============================================================================

@ingredients_bp.route('/api/ingredients', methods=['GET'])
@jwt_required()
def get_ingredients():
    """
    Get all ingredients with enrichment data from 4 tables
    Supports search and filter parameters
    """
    try:
        # Get search/filter parameters
        search = request.args.get('search', '').strip()
        category_id = request.args.get('category_id', '')
        tag = request.args.get('tag', '')
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Build dynamic query with filters
        query = """
            SELECT 
                -- Main table fields (prefix with i.)
                i.id, i.name, i.inci_name, i.cas_number,
                i.category_id, i.supplier_id, i.landed_cost_net_gst,
                i.hsn_code, i.storage_conditions, i.shelf_life_months,
                i.usage_rate_min, i.usage_rate_max, i.notes,
                i.stock_status, i.unit_of_measure, i.minimum_order_qty,
                i.created_at, i.updated_at,
                -- Regulatory fields (prefix with r.)
                r.einecs AS reg_einecs, 
                r.cosing_ref AS reg_cosing_ref, 
                r.chemical_formula AS reg_chemical_formula,
                r.us_approved AS reg_us_approved, 
                r.eu_approved AS reg_eu_approved, 
                r.safety_notes AS reg_safety_notes,
                -- Properties fields (prefix with p.)
                p.appearance AS prop_appearance, 
                p.solubility AS prop_solubility, 
                p.formulation_notes AS prop_formulation_notes,
                p.sap_value AS prop_sap_value, 
                p.iodine_value AS prop_iodine_value, 
                p.ins_value AS prop_ins_value,
                p.hardness_coefficient AS prop_hardness_coefficient, 
                p.lather_coefficient AS prop_lather_coefficient,
                -- Marketing fields (prefix with m.)
                m.applications AS mkt_applications, 
                m.benefits AS mkt_benefits
            FROM ingredients i
            LEFT JOIN ingredient_regulatory r ON i.id = r.ingredient_id
            LEFT JOIN ingredient_properties p ON i.id = p.ingredient_id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE 1=1
        """
        
        params = []
        
        # Add search filter
        if search:
            query += " AND (LOWER(i.name) LIKE LOWER(?) OR LOWER(i.inci_name) LIKE LOWER(?) OR LOWER(i.cas_number) LIKE LOWER(?))"
            search_term = f"%{search}%"
            params.extend([search_term, search_term, search_term])
        
        # Add category filter
        if category_id:
            query += " AND i.category_id = ?"
            params.append(category_id)
        
        query += " ORDER BY i.name"
        
        cursor.execute(query, params)
        
        rows = cursor.fetchall()
        ingredients = []
        
        for row in rows:
            # Build main ingredient object
            ingredient = {
                'id': row['id'],
                'name': row['name'],
                'inci_name': row['inci_name'],
                'cas_number': row['cas_number'],
                'category_id': row['category_id'],
                'supplier_id': row['supplier_id'],
                'landed_cost_net_gst': row['landed_cost_net_gst'],
                'hsn_code': row['hsn_code'],
                'storage_conditions': row['storage_conditions'],
                'shelf_life_months': row['shelf_life_months'],
                'usage_rate_min': row['usage_rate_min'],
                'usage_rate_max': row['usage_rate_max'],
                'notes': row['notes'],
                'stock_status': row['stock_status'],
                'unit_of_measure': row['unit_of_measure'],
                'minimum_order_qty': row['minimum_order_qty'],
                'created_at': row['created_at'],
                'updated_at': row['updated_at']
            }
            
            # Add regulatory data if exists (check for any non-null field)
            if row['reg_einecs'] or row['reg_cosing_ref'] or row['reg_chemical_formula']:
                ingredient['regulatory'] = {
                    'einecs': row['reg_einecs'],
                    'cosing_ref': row['reg_cosing_ref'],
                    'chemical_formula': row['reg_chemical_formula'],
                    'us_approved': bool(row['reg_us_approved']) if row['reg_us_approved'] is not None else True,
                    'eu_approved': bool(row['reg_eu_approved']) if row['reg_eu_approved'] is not None else True,
                    'safety_notes': row['reg_safety_notes']
                }
            
            # Add properties data if exists
            if row['prop_appearance'] or row['prop_solubility'] or row['prop_formulation_notes']:
                ingredient['properties'] = {
                    'appearance': row['prop_appearance'],
                    'solubility': row['prop_solubility'],
                    'formulation_notes': row['prop_formulation_notes'],
                    'sap_value': row['prop_sap_value'],
                    'iodine_value': row['prop_iodine_value'],
                    'ins_value': row['prop_ins_value'],
                    'hardness_coefficient': row['prop_hardness_coefficient'],
                    'lather_coefficient': row['prop_lather_coefficient']
                }
            
            # Add marketing data if exists
            if row['mkt_applications'] or row['mkt_benefits']:
                ingredient['marketing'] = {
                    'applications': row['mkt_applications'],
                    'benefits': row['mkt_benefits']
                }
            
            ingredients.append(ingredient)
        
        conn.close()
        return jsonify({'ingredients': ingredients}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# GET SINGLE INGREDIENT
# ============================================================================

@ingredients_bp.route('/api/ingredients/<int:id>', methods=['GET'])
@jwt_required()
def get_ingredient(id):
    """Get single ingredient with full enrichment data"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                -- Main table fields
                i.id, i.name, i.inci_name, i.cas_number,
                i.category_id, i.supplier_id, i.landed_cost_net_gst,
                i.hsn_code, i.storage_conditions, i.shelf_life_months,
                i.usage_rate_min, i.usage_rate_max, i.notes,
                i.stock_status, i.unit_of_measure, i.minimum_order_qty,
                i.created_at, i.updated_at,
                -- Regulatory fields
                r.einecs AS reg_einecs, 
                r.cosing_ref AS reg_cosing_ref, 
                r.chemical_formula AS reg_chemical_formula,
                r.us_approved AS reg_us_approved, 
                r.eu_approved AS reg_eu_approved, 
                r.safety_notes AS reg_safety_notes,
                -- Properties fields
                p.appearance AS prop_appearance, 
                p.solubility AS prop_solubility, 
                p.formulation_notes AS prop_formulation_notes,
                p.sap_value AS prop_sap_value, 
                p.iodine_value AS prop_iodine_value, 
                p.ins_value AS prop_ins_value,
                p.hardness_coefficient AS prop_hardness_coefficient, 
                p.lather_coefficient AS prop_lather_coefficient,
                -- Marketing fields
                m.applications AS mkt_applications, 
                m.benefits AS mkt_benefits
            FROM ingredients i
            LEFT JOIN ingredient_regulatory r ON i.id = r.ingredient_id
            LEFT JOIN ingredient_properties p ON i.id = p.ingredient_id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE i.id = ?
        """, (id,))
        
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return jsonify({'error': 'Ingredient not found'}), 404
        
        # Build ingredient object
        ingredient = {
            'id': row['id'],
            'name': row['name'],
            'inci_name': row['inci_name'],
            'cas_number': row['cas_number'],
            'category_id': row['category_id'],
            'supplier_id': row['supplier_id'],
            'landed_cost_net_gst': row['landed_cost_net_gst'],
            'hsn_code': row['hsn_code'],
            'storage_conditions': row['storage_conditions'],
            'shelf_life_months': row['shelf_life_months'],
            'usage_rate_min': row['usage_rate_min'],
            'usage_rate_max': row['usage_rate_max'],
            'notes': row['notes'],
            'stock_status': row['stock_status'],
            'unit_of_measure': row['unit_of_measure'],
            'minimum_order_qty': row['minimum_order_qty'],
            'created_at': row['created_at'],
            'updated_at': row['updated_at']
        }
        
        # Add regulatory data if exists
        if row['reg_einecs'] or row['reg_cosing_ref'] or row['reg_chemical_formula']:
            ingredient['regulatory'] = {
                'einecs': row['reg_einecs'],
                'cosing_ref': row['reg_cosing_ref'],
                'chemical_formula': row['reg_chemical_formula'],
                'us_approved': bool(row['reg_us_approved']) if row['reg_us_approved'] is not None else True,
                'eu_approved': bool(row['reg_eu_approved']) if row['reg_eu_approved'] is not None else True,
                'safety_notes': row['reg_safety_notes']
            }
        
        # Add properties data if exists
        if row['prop_appearance'] or row['prop_solubility'] or row['prop_formulation_notes']:
            ingredient['properties'] = {
                'appearance': row['prop_appearance'],
                'solubility': row['prop_solubility'],
                'formulation_notes': row['prop_formulation_notes'],
                'sap_value': row['prop_sap_value'],
                'iodine_value': row['prop_iodine_value'],
                'ins_value': row['prop_ins_value'],
                'hardness_coefficient': row['prop_hardness_coefficient'],
                'lather_coefficient': row['prop_lather_coefficient']
            }
        
        # Add marketing data if exists
        if row['mkt_applications'] or row['mkt_benefits']:
            ingredient['marketing'] = {
                'applications': row['mkt_applications'],
                'benefits': row['mkt_benefits']
            }
        
        conn.close()
        return jsonify(ingredient), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# CREATE INGREDIENT
# ============================================================================

@ingredients_bp.route('/api/ingredients', methods=['POST'])
@jwt_required()
def create_ingredient():
    """Create new ingredient with optional enrichment data"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        if not data.get('category_id'):
            return jsonify({'error': 'Category is required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Check for duplicate name
        cursor.execute("SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?)", (data.get('name'),))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Ingredient name already exists'}), 409
        
        # Insert main table (required fields)
        cursor.execute("""
            INSERT INTO ingredients (
                name, inci_name, cas_number, category_id, supplier_id,
                landed_cost_net_gst, hsn_code, storage_conditions,
                shelf_life_months, usage_rate_min, usage_rate_max, notes,
                stock_status, unit_of_measure, minimum_order_qty
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get('name'),
            data.get('inci_name'),
            data.get('cas_number'),
            data.get('category_id'),
            data.get('supplier_id'),
            data.get('landed_cost_net_gst', 0.0),  # NOT NULL, default 0
            data.get('hsn_code'),
            data.get('storage_conditions'),
            data.get('shelf_life_months'),
            data.get('usage_rate_min'),
            data.get('usage_rate_max'),
            data.get('notes'),
            data.get('stock_status', 'in_stock'),
            data.get('unit_of_measure', 'kg'),
            data.get('minimum_order_qty')
        ))
        
        ingredient_id = cursor.lastrowid
        
        # Insert regulatory data if provided
        regulatory = data.get('regulatory', {})
        if regulatory and (regulatory.get('einecs') or regulatory.get('cosing_ref')):
            cursor.execute("""
                INSERT INTO ingredient_regulatory (
                    ingredient_id, einecs, cosing_ref, chemical_formula,
                    us_approved, eu_approved, safety_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                ingredient_id,
                regulatory.get('einecs'),
                regulatory.get('cosing_ref'),
                regulatory.get('chemical_formula'),
                1 if regulatory.get('us_approved', True) else 0,
                1 if regulatory.get('eu_approved', True) else 0,
                regulatory.get('safety_notes')
            ))
        
        # Insert properties data if provided
        properties = data.get('properties', {})
        if properties and (properties.get('appearance') or properties.get('solubility')):
            cursor.execute("""
                INSERT INTO ingredient_properties (
                    ingredient_id, appearance, solubility, formulation_notes,
                    sap_value, iodine_value, ins_value,
                    hardness_coefficient, lather_coefficient
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ingredient_id,
                properties.get('appearance'),
                properties.get('solubility'),
                properties.get('formulation_notes'),
                properties.get('sap_value'),
                properties.get('iodine_value'),
                properties.get('ins_value'),
                properties.get('hardness_coefficient'),
                properties.get('lather_coefficient')
            ))
        
        # Insert marketing data if provided
        marketing = data.get('marketing', {})
        if marketing and (marketing.get('applications') or marketing.get('benefits')):
            cursor.execute("""
                INSERT INTO ingredient_marketing (
                    ingredient_id, applications, benefits
                ) VALUES (?, ?, ?)
            """, (
                ingredient_id,
                marketing.get('applications'),
                marketing.get('benefits')
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'id': ingredient_id, 'message': 'Ingredient created successfully'}), 201
        
    except sqlite3.IntegrityError as e:
        return jsonify({'error': f'Database constraint error: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# UPDATE INGREDIENT
# ============================================================================

@ingredients_bp.route('/api/ingredients/<int:id>', methods=['PUT'])
@jwt_required()
def update_ingredient(id):
    """Update ingredient with enrichment data (UPSERT related tables)"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if ingredient exists
        cursor.execute("SELECT id FROM ingredients WHERE id = ?", (id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Ingredient not found'}), 404
        
        # Check for duplicate name (excluding current ingredient)
        if data.get('name'):
            cursor.execute(
                "SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?) AND id != ?", 
                (data.get('name'), id)
            )
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'Ingredient name already exists'}), 409
        
        # Update main table
        cursor.execute("""
            UPDATE ingredients SET
                name = ?,
                inci_name = ?,
                cas_number = ?,
                category_id = ?,
                supplier_id = ?,
                landed_cost_net_gst = ?,
                hsn_code = ?,
                storage_conditions = ?,
                shelf_life_months = ?,
                usage_rate_min = ?,
                usage_rate_max = ?,
                notes = ?,
                stock_status = ?,
                unit_of_measure = ?,
                minimum_order_qty = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (
            data.get('name'),
            data.get('inci_name'),
            data.get('cas_number'),
            data.get('category_id'),
            data.get('supplier_id'),
            data.get('landed_cost_net_gst', 0.0),
            data.get('hsn_code'),
            data.get('storage_conditions'),
            data.get('shelf_life_months'),
            data.get('usage_rate_min'),
            data.get('usage_rate_max'),
            data.get('notes'),
            data.get('stock_status', 'in_stock'),
            data.get('unit_of_measure', 'kg'),
            data.get('minimum_order_qty'),
            id
        ))
        
        # UPSERT regulatory data (only if provided in request)
        regulatory = data.get('regulatory')
        if regulatory:
            cursor.execute("""
                INSERT INTO ingredient_regulatory (
                    ingredient_id, einecs, cosing_ref, chemical_formula,
                    us_approved, eu_approved, safety_notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(ingredient_id) DO UPDATE SET
                    einecs = excluded.einecs,
                    cosing_ref = excluded.cosing_ref,
                    chemical_formula = excluded.chemical_formula,
                    us_approved = excluded.us_approved,
                    eu_approved = excluded.eu_approved,
                    safety_notes = excluded.safety_notes
            """, (
                id,
                regulatory.get('einecs'),
                regulatory.get('cosing_ref'),
                regulatory.get('chemical_formula'),
                1 if regulatory.get('us_approved', True) else 0,
                1 if regulatory.get('eu_approved', True) else 0,
                regulatory.get('safety_notes')
            ))
        
        # UPSERT properties data (only if provided in request)
        properties = data.get('properties')
        if properties:
            cursor.execute("""
                INSERT INTO ingredient_properties (
                    ingredient_id, appearance, solubility, formulation_notes,
                    sap_value, iodine_value, ins_value,
                    hardness_coefficient, lather_coefficient
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(ingredient_id) DO UPDATE SET
                    appearance = excluded.appearance,
                    solubility = excluded.solubility,
                    formulation_notes = excluded.formulation_notes,
                    sap_value = excluded.sap_value,
                    iodine_value = excluded.iodine_value,
                    ins_value = excluded.ins_value,
                    hardness_coefficient = excluded.hardness_coefficient,
                    lather_coefficient = excluded.lather_coefficient
            """, (
                id,
                properties.get('appearance'),
                properties.get('solubility'),
                properties.get('formulation_notes'),
                properties.get('sap_value'),
                properties.get('iodine_value'),
                properties.get('ins_value'),
                properties.get('hardness_coefficient'),
                properties.get('lather_coefficient')
            ))
        
        # UPSERT marketing data (only if provided in request)
        marketing = data.get('marketing')
        if marketing:
            cursor.execute("""
                INSERT INTO ingredient_marketing (
                    ingredient_id, applications, benefits
                ) VALUES (?, ?, ?)
                ON CONFLICT(ingredient_id) DO UPDATE SET
                    applications = excluded.applications,
                    benefits = excluded.benefits
            """, (
                id,
                marketing.get('applications'),
                marketing.get('benefits')
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Ingredient updated successfully'}), 200
        
    except sqlite3.IntegrityError as e:
        return jsonify({'error': f'Database constraint error: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# DELETE INGREDIENT
# ============================================================================

@ingredients_bp.route('/api/ingredients/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_ingredient(id):
    """Delete ingredient (CASCADE deletes related tables automatically)"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if ingredient is used in any formulations
        cursor.execute("""
            SELECT COUNT(*) as count FROM formulation_ingredients 
            WHERE ingredient_id = ?
        """, (id,))
        
        result = cursor.fetchone()
        if result and result['count'] > 0:
            conn.close()
            return jsonify({
                'error': f'Cannot delete: ingredient is used in {result["count"]} formulation(s)'
            }), 400
        
        cursor.execute("DELETE FROM ingredients WHERE id = ?", (id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Ingredient not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Ingredient deleted successfully'}), 200
        
    except sqlite3.IntegrityError as e:
        return jsonify({'error': f'Cannot delete: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
