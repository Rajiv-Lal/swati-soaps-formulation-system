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
    """Get database connection with production-safe settings"""
    conn = sqlite3.connect(current_app.config['DATABASE'], timeout=30)
    conn.row_factory = sqlite3.Row  # Access columns by name
    conn.execute('PRAGMA busy_timeout = 30000')  # 30 second wait on locks
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
    """Update ingredient - FIXED to preserve existing values for partial updates"""
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        
        # STEP 1: Fetch existing ingredient with ALL related data
        cursor.execute("""
            SELECT i.*,
                   r.einecs AS reg_einecs, r.cosing_ref AS reg_cosing_ref, 
                   r.chemical_formula AS reg_chemical_formula,
                   r.us_approved AS reg_us_approved, r.eu_approved AS reg_eu_approved,
                   r.safety_notes AS reg_safety_notes,
                   p.appearance AS prop_appearance, p.solubility AS prop_solubility,
                   p.formulation_notes AS prop_formulation_notes,
                   p.sap_value AS prop_sap_value, p.iodine_value AS prop_iodine_value,
                   p.ins_value AS prop_ins_value, p.hardness_coefficient AS prop_hardness_coefficient,
                   p.lather_coefficient AS prop_lather_coefficient,
                   m.applications AS mkt_applications, m.benefits AS mkt_benefits
            FROM ingredients i
            LEFT JOIN ingredient_regulatory r ON i.id = r.ingredient_id
            LEFT JOIN ingredient_properties p ON i.id = p.ingredient_id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE i.id = ?
        """, (id,))
        
        existing = cursor.fetchone()
        
        if not existing:
            conn.close()
            return jsonify({'error': 'Ingredient not found'}), 404
        
        # Convert to dict
        existing_data = dict(existing)
        
        # STEP 2: Check for duplicate name (if name is being changed)
        new_name = data.get('name', existing_data['name'])
        if new_name != existing_data['name']:
            cursor.execute(
                "SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?) AND id != ?",
                (new_name, id)
            )
            if cursor.fetchone():
                conn.close()
                return jsonify({'error': 'Ingredient name already exists'}), 409
        
        # STEP 3: Update main table - USE EXISTING VALUES AS DEFAULTS
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
            data.get('name', existing_data['name']),
            data.get('inci_name', existing_data['inci_name']),
            data.get('cas_number', existing_data['cas_number']),
            data.get('category_id', existing_data['category_id']),
            data.get('supplier_id', existing_data['supplier_id']),
            data.get('landed_cost_net_gst', existing_data['landed_cost_net_gst']),
            data.get('hsn_code', existing_data['hsn_code']),
            data.get('storage_conditions', existing_data['storage_conditions']),
            data.get('shelf_life_months', existing_data['shelf_life_months']),
            data.get('usage_rate_min', existing_data['usage_rate_min']),
            data.get('usage_rate_max', existing_data['usage_rate_max']),
            data.get('notes', existing_data['notes']),
            data.get('stock_status', existing_data['stock_status']),
            data.get('unit_of_measure', existing_data['unit_of_measure']),
            data.get('minimum_order_qty', existing_data['minimum_order_qty']),
            id
        ))
        
        # STEP 4: Handle regulatory data (if provided)
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
                regulatory.get('einecs', existing_data.get('reg_einecs')),
                regulatory.get('cosing_ref', existing_data.get('reg_cosing_ref')),
                regulatory.get('chemical_formula', existing_data.get('reg_chemical_formula')),
                1 if regulatory.get('us_approved', existing_data.get('reg_us_approved', 1)) else 0,
                1 if regulatory.get('eu_approved', existing_data.get('reg_eu_approved', 1)) else 0,
                regulatory.get('safety_notes', existing_data.get('reg_safety_notes'))
            ))
        
        # STEP 5: Handle properties data (if provided)
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
                properties.get('appearance', existing_data.get('prop_appearance')),
                properties.get('solubility', existing_data.get('prop_solubility')),
                properties.get('formulation_notes', existing_data.get('prop_formulation_notes')),
                properties.get('sap_value', existing_data.get('prop_sap_value')),
                properties.get('iodine_value', existing_data.get('prop_iodine_value')),
                properties.get('ins_value', existing_data.get('prop_ins_value')),
                properties.get('hardness_coefficient', existing_data.get('prop_hardness_coefficient')),
                properties.get('lather_coefficient', existing_data.get('prop_lather_coefficient'))
            ))
        
        # STEP 6: Handle marketing data (if provided)
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
                marketing.get('applications', existing_data.get('mkt_applications')),
                marketing.get('benefits', existing_data.get('mkt_benefits'))
            ))
        
        conn.commit()
        
        # STEP 7: Fetch and return updated ingredient
        cursor.execute("""
            SELECT i.*, c.name as category_name, s.name as supplier_name,
                   r.einecs AS reg_einecs, r.cosing_ref AS reg_cosing_ref,
                   r.chemical_formula AS reg_chemical_formula,
                   r.us_approved AS reg_us_approved, r.eu_approved AS reg_eu_approved,
                   r.safety_notes AS reg_safety_notes,
                   p.appearance AS prop_appearance, p.solubility AS prop_solubility,
                   p.formulation_notes AS prop_formulation_notes,
                   p.sap_value AS prop_sap_value, p.iodine_value AS prop_iodine_value,
                   p.ins_value AS prop_ins_value, p.hardness_coefficient AS prop_hardness_coefficient,
                   p.lather_coefficient AS prop_lather_coefficient,
                   m.applications AS mkt_applications, m.benefits AS mkt_benefits
            FROM ingredients i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN suppliers s ON i.supplier_id = s.id
            LEFT JOIN ingredient_regulatory r ON i.id = r.ingredient_id
            LEFT JOIN ingredient_properties p ON i.id = p.ingredient_id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE i.id = ?
        """, (id,))
        
        row = cursor.fetchone()
        conn.close()
        
        # Build response with nested structure
        result = {
            'id': row['id'],
            'name': row['name'],
            'inci_name': row['inci_name'],
            'cas_number': row['cas_number'],
            'category_id': row['category_id'],
            'category_name': row['category_name'],
            'supplier_id': row['supplier_id'],
            'supplier_name': row['supplier_name'],
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
            'updated_at': row['updated_at']
        }
        
        # Add nested objects if data exists
        if row['reg_einecs'] or row['reg_cosing_ref'] or row['reg_chemical_formula']:
            result['regulatory'] = {
                'einecs': row['reg_einecs'],
                'cosing_ref': row['reg_cosing_ref'],
                'chemical_formula': row['reg_chemical_formula'],
                'us_approved': bool(row['reg_us_approved']) if row['reg_us_approved'] is not None else True,
                'eu_approved': bool(row['reg_eu_approved']) if row['reg_eu_approved'] is not None else True,
                'safety_notes': row['reg_safety_notes']
            }
        
        if row['prop_appearance'] or row['prop_sap_value']:
            result['properties'] = {
                'appearance': row['prop_appearance'],
                'solubility': row['prop_solubility'],
                'formulation_notes': row['prop_formulation_notes'],
                'sap_value': row['prop_sap_value'],
                'iodine_value': row['prop_iodine_value'],
                'ins_value': row['prop_ins_value'],
                'hardness_coefficient': row['prop_hardness_coefficient'],
                'lather_coefficient': row['prop_lather_coefficient']
            }
        
        if row['mkt_applications'] or row['mkt_benefits']:
            result['marketing'] = {
                'applications': row['mkt_applications'],
                'benefits': row['mkt_benefits']
            }
        
        return jsonify({
            'message': 'Ingredient updated successfully',
            'ingredient': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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

# ============================================================================


# ============================================================================
# EXPORT INGREDIENTS TO CSV (with filters)
# ============================================================================

@ingredients_bp.route('/api/ingredients/export-csv', methods=['GET'])
@jwt_required()
def export_ingredients_csv():
    """Export ingredients to CSV with optional filters"""
    try:
        import csv
        import io
        from datetime import datetime as dt
        from flask import Response, request
        
        # Get filter parameters
        category_id = request.args.get('category_id')
        include_regulatory = request.args.get('regulatory', 'true').lower() == 'true'
        include_properties = request.args.get('properties', 'true').lower() == 'true'
        include_marketing = request.args.get('marketing', 'true').lower() == 'true'
        eu_approved = request.args.get('eu_approved')
        us_approved = request.args.get('us_approved')
        stock_status = request.args.get('stock_status')
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Build dynamic query
        select_cols = [
            'i.id', 'i.name', 'i.inci_name', 'i.cas_number', 'c.name as category',
            's.name as supplier', 'i.landed_cost_net_gst', 'i.hsn_code',
            'i.usage_rate_min', 'i.usage_rate_max', 'i.stock_status',
            'i.storage_conditions', 'i.shelf_life_months', 'i.notes'
        ]
        
        headers = [
            'ID', 'Name', 'INCI', 'CAS', 'Category', 'Supplier', 'Cost (Rs/kg)', 
            'HSN', 'Min %', 'Max %', 'Stock', 'Storage', 'Shelf Life', 'Notes'
        ]
        
        if include_regulatory:
            select_cols.extend([
                'r.einecs', 'r.cosing_ref', 'r.chemical_formula',
                'r.eu_approved', 'r.us_approved', 'r.safety_notes'
            ])
            headers.extend(['EINECS', 'COSING', 'Formula', 'EU Approved', 'US Approved', 'Safety Notes'])
        
        if include_properties:
            select_cols.extend([
                'p.sap_value', 'p.iodine_value', 'p.ins_value',
                'p.hardness_coefficient', 'p.lather_coefficient',
                'p.appearance', 'p.solubility'
            ])
            headers.extend(['SAP', 'Iodine', 'INS', 'Hardness', 'Lather', 'Appearance', 'Solubility'])
        
        if include_marketing:
            select_cols.extend(['m.applications', 'm.benefits'])
            headers.extend(['Applications', 'Benefits'])
        
        query = """
            SELECT """ + ', '.join(select_cols) + """
            FROM ingredients i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN suppliers s ON i.supplier_id = s.id
            LEFT JOIN ingredient_regulatory r ON i.id = r.ingredient_id
            LEFT JOIN ingredient_properties p ON i.id = p.ingredient_id
            LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
            WHERE 1=1
        """
        params = []
        
        if category_id:
            query += " AND i.category_id = ?"
            params.append(category_id)
        
        if eu_approved:
            query += " AND r.eu_approved = ?"
            params.append(1 if eu_approved == 'true' else 0)
        
        if us_approved:
            query += " AND r.us_approved = ?"
            params.append(1 if us_approved == 'true' else 0)
        
        if stock_status:
            query += " AND i.stock_status = ?"
            params.append(stock_status)
        
        query += " ORDER BY c.name, i.name"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(headers)
        
        # Find EU/US column positions if regulatory included
        eu_idx = None
        us_idx = None
        if include_regulatory:
            try:
                eu_idx = headers.index('EU Approved')
                us_idx = headers.index('US Approved')
            except ValueError:
                pass
        
        for row in rows:
            row_data = list(row)
            # Convert approval flags to Yes/No
            if eu_idx is not None and eu_idx < len(row_data):
                row_data[eu_idx] = 'Yes' if row_data[eu_idx] == 1 else 'No' if row_data[eu_idx] == 0 else ''
            if us_idx is not None and us_idx < len(row_data):
                row_data[us_idx] = 'Yes' if row_data[us_idx] == 1 else 'No' if row_data[us_idx] == 0 else ''
            writer.writerow(row_data)
        
        output.seek(0)
        filename = "ingredients_" + dt.now().strftime('%Y%m%d_%H%M%S') + ".csv"
        
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=' + filename}
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

