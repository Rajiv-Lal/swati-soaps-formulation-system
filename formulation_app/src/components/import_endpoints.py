# Backend Import Endpoints - Add to app.py
# These endpoints handle bulk imports from Excel files

import pandas as pd
from io import BytesIO
from flask import send_file

# ============================================================================
# INGREDIENT BULK IMPORT
# ============================================================================

@app.route('/api/ingredients/import', methods=['POST'])
@jwt_required()
def import_ingredients():
    """
    Bulk import ingredients from Excel/CSV file
    Expects columns: Name, Category, Subcategory, Cost, Supplier, Stock Status, 
                     Unit, MOQ, Shelf Life, HSN Code, CAS Number, INCI Name, 
                     Storage, Tags, US Approved, EU Approved
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read Excel file
        try:
            df = pd.read_excel(file)
        except Exception as e:
            return jsonify({'error': f'Failed to read Excel file: {str(e)}'}), 400
        
        # Validate required columns
        required_cols = ['Name', 'Category', 'Cost (₹/kg)']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_cols)}'}), 400
        
        db = get_db()
        success_count = 0
        error_count = 0
        errors = []
        
        for index, row in df.iterrows():
            try:
                # Validate required fields
                name = str(row['Name']).strip()
                if not name or name == 'nan':
                    errors.append(f"Row {index + 2}: Name is required")
                    error_count += 1
                    continue
                
                # Get category ID
                category_name = str(row.get('Category', '')).strip()
                category = db.execute('SELECT id FROM categories WHERE name = ?', (category_name,)).fetchone()
                if not category:
                    errors.append(f"Row {index + 2}: Invalid category '{category_name}'")
                    error_count += 1
                    continue
                category_id = category['id']
                
                # Get subcategory ID (optional)
                subcategory_id = None
                subcategory_name = str(row.get('Subcategory', '')).strip()
                if subcategory_name and subcategory_name != 'nan':
                    subcategory = db.execute(
                        'SELECT id FROM subcategories WHERE name = ? AND category_id = ?',
                        (subcategory_name, category_id)
                    ).fetchone()
                    if subcategory:
                        subcategory_id = subcategory['id']
                
                # Parse cost
                try:
                    cost = float(row['Cost (₹/kg)'])
                    if cost <= 0:
                        errors.append(f"Row {index + 2}: Cost must be positive")
                        error_count += 1
                        continue
                except (ValueError, TypeError):
                    errors.append(f"Row {index + 2}: Invalid cost value")
                    error_count += 1
                    continue
                
                # Get supplier ID (optional)
                supplier_id = None
                supplier_name = str(row.get('Supplier', '')).strip()
                if supplier_name and supplier_name != 'nan':
                    supplier = db.execute('SELECT id FROM suppliers WHERE name = ?', (supplier_name,)).fetchone()
                    if supplier:
                        supplier_id = supplier['id']
                
                # Parse stock status
                stock_status = str(row.get('Stock Status', 'in_stock')).strip().lower().replace(' ', '_')
                if stock_status not in ['in_stock', 'low_stock', 'out_of_stock']:
                    stock_status = 'in_stock'
                
                # Parse regulatory approvals
                us_approved = None
                us_val = str(row.get('US Approved', '')).strip().lower()
                if us_val in ['yes', 'y', '1', 'true']:
                    us_approved = 1
                elif us_val in ['no', 'n', '0', 'false']:
                    us_approved = 0
                # Otherwise remains None (unknown)
                
                eu_approved = None
                eu_val = str(row.get('EU Approved', '')).strip().lower()
                if eu_val in ['yes', 'y', '1', 'true']:
                    eu_approved = 1
                elif eu_val in ['no', 'n', '0', 'false']:
                    eu_approved = 0
                # Otherwise remains None (unknown)
                
                # Other fields (optional)
                unit = str(row.get('Unit', 'kg')).strip()
                moq = None
                try:
                    if pd.notna(row.get('MOQ')):
                        moq = float(row['MOQ'])
                except (ValueError, TypeError):
                    pass
                
                shelf_life = None
                try:
                    if pd.notna(row.get('Shelf Life')):
                        shelf_life = int(row['Shelf Life'])
                except (ValueError, TypeError):
                    pass
                
                hsn_code = str(row.get('HSN Code', '')).strip() if pd.notna(row.get('HSN Code')) else None
                cas_number = str(row.get('CAS Number', '')).strip() if pd.notna(row.get('CAS Number')) else None
                inci_name = str(row.get('INCI Name', '')).strip() if pd.notna(row.get('INCI Name')) else None
                storage = str(row.get('Storage', '')).strip() if pd.notna(row.get('Storage')) else None
                
                # Check if ingredient already exists
                existing = db.execute('SELECT id FROM ingredients WHERE name = ?', (name,)).fetchone()
                
                if existing:
                    # Update existing ingredient
                    db.execute('''
                        UPDATE ingredients 
                        SET category_id = ?, subcategory_id = ?, landed_cost_net_gst = ?,
                            supplier_id = ?, stock_status = ?, unit_of_measure = ?,
                            minimum_order_qty = ?, shelf_life_months = ?, hsn_code = ?,
                            cas_number = ?, inci_name = ?, storage_conditions = ?,
                            us_approved = ?, eu_approved = ?
                        WHERE id = ?
                    ''', (category_id, subcategory_id, cost, supplier_id, stock_status, unit,
                          moq, shelf_life, hsn_code, cas_number, inci_name, storage,
                          us_approved, eu_approved, existing['id']))
                else:
                    # Insert new ingredient
                    cursor = db.execute('''
                        INSERT INTO ingredients (
                            name, category_id, subcategory_id, landed_cost_net_gst,
                            supplier_id, stock_status, unit_of_measure, minimum_order_qty,
                            shelf_life_months, hsn_code, cas_number, inci_name,
                            storage_conditions, us_approved, eu_approved
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (name, category_id, subcategory_id, cost, supplier_id, stock_status,
                          unit, moq, shelf_life, hsn_code, cas_number, inci_name, storage,
                          us_approved, eu_approved))
                    
                    # Handle tags
                    ingredient_id = cursor.lastrowid
                    tags_str = str(row.get('Tags', '')).strip()
                    if tags_str and tags_str != 'nan':
                        tags = [t.strip().lower() for t in tags_str.split(',')]
                        for tag_name in tags:
                            if tag_name in ['soaps', 'cosmetics', 'both']:
                                # Check if tag exists
                                tag = db.execute('SELECT id FROM tags WHERE name = ?', (tag_name,)).fetchone()
                                if not tag:
                                    # Create tag
                                    cursor = db.execute(
                                        'INSERT INTO tags (name, color) VALUES (?, ?)',
                                        (tag_name, '#3B82F6')
                                    )
                                    tag_id = cursor.lastrowid
                                else:
                                    tag_id = tag['id']
                                
                                # Link tag to ingredient
                                db.execute(
                                    'INSERT OR IGNORE INTO ingredient_tags (ingredient_id, tag_id) VALUES (?, ?)',
                                    (ingredient_id, tag_id)
                                )
                
                db.commit()
                success_count += 1
                
            except Exception as e:
                errors.append(f"Row {index + 2}: {str(e)}")
                error_count += 1
                continue
        
        return jsonify({
            'success': True,
            'message': f'Import completed: {success_count} successful, {error_count} failed',
            'success_count': success_count,
            'error_count': error_count,
            'errors': errors[:20]  # Limit to first 20 errors
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# FORMULATION BULK IMPORT
# ============================================================================

@app.route('/api/formulations/import', methods=['POST'])
@jwt_required()
def import_formulations():
    """
    Bulk import formulations from Excel file with 2 sheets:
    Sheet 1 "Formulations": Product Name, Product Type, Grammage, Pack Count, Status, Notes, Benefits, Tags
    Sheet 2 "Ingredients": Product Name, Ingredient Name, Percentage
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read Excel file (both sheets)
        try:
            formulations_df = pd.read_excel(file, sheet_name='Formulations')
            ingredients_df = pd.read_excel(file, sheet_name='Ingredients')
        except Exception as e:
            return jsonify({'error': f'Failed to read Excel file. Ensure it has "Formulations" and "Ingredients" sheets: {str(e)}'}), 400
        
        current_user_id = get_jwt_identity()
        db = get_db()
        success_count = 0
        error_count = 0
        errors = []
        
        # Process each formulation
        for index, form_row in formulations_df.iterrows():
            try:
                product_name = str(form_row['Product Name']).strip()
                if not product_name or product_name == 'nan':
                    errors.append(f"Formulation row {index + 2}: Product Name is required")
                    error_count += 1
                    continue
                
                # Check if formulation already exists
                existing = db.execute('SELECT id FROM formulations WHERE product_name = ?', (product_name,)).fetchone()
                if existing:
                    errors.append(f"Formulation row {index + 2}: '{product_name}' already exists")
                    error_count += 1
                    continue
                
                # Get product type ID
                product_type_name = str(form_row.get('Product Type', 'Bar Soap')).strip()
                product_type = db.execute('SELECT id FROM product_types WHERE name = ?', (product_type_name,)).fetchone()
                if not product_type:
                    errors.append(f"Formulation row {index + 2}: Invalid product type '{product_type_name}'")
                    error_count += 1
                    continue
                product_type_id = product_type['id']
                
                # Parse grammage
                try:
                    grammage = int(form_row.get('Grammage', 100))
                except (ValueError, TypeError):
                    errors.append(f"Formulation row {index + 2}: Invalid grammage")
                    error_count += 1
                    continue
                
                # Parse pack count
                pack_count = 1
                try:
                    if pd.notna(form_row.get('Pack Count')):
                        pack_count = int(form_row['Pack Count'])
                except (ValueError, TypeError):
                    pass
                
                # Parse status
                status = str(form_row.get('Status', 'draft')).strip().lower()
                if status not in ['draft', 'active', 'under_review', 'archived']:
                    status = 'draft'
                
                notes = str(form_row.get('Notes', '')).strip() if pd.notna(form_row.get('Notes')) else None
                
                # Get ingredients for this formulation
                form_ingredients = ingredients_df[ingredients_df['Product Name'] == product_name]
                
                if len(form_ingredients) == 0:
                    errors.append(f"Formulation row {index + 2}: No ingredients found for '{product_name}'")
                    error_count += 1
                    continue
                
                # Validate percentages sum to 100
                total_percentage = form_ingredients['Percentage'].sum()
                if abs(total_percentage - 100.0) > 0.01:
                    errors.append(f"Formulation row {index + 2}: Percentages sum to {total_percentage:.2f}%, not 100%")
                    error_count += 1
                    continue
                
                # Validate all ingredients exist
                ingredient_data = []
                for _, ing_row in form_ingredients.iterrows():
                    ing_name = str(ing_row['Ingredient Name']).strip()
                    percentage = float(ing_row['Percentage'])
                    
                    ingredient = db.execute('SELECT id, landed_cost_net_gst FROM ingredients WHERE name = ?', (ing_name,)).fetchone()
                    if not ingredient:
                        errors.append(f"Formulation row {index + 2}: Ingredient '{ing_name}' not found in database")
                        error_count += 1
                        break
                    
                    ingredient_data.append({
                        'id': ingredient['id'],
                        'name': ing_name,
                        'percentage': percentage,
                        'cost': ingredient['landed_cost_net_gst']
                    })
                
                if len(ingredient_data) != len(form_ingredients):
                    # Some ingredients missing, already logged error
                    continue
                
                # Calculate total cost
                total_cost = sum((grammage * ing['percentage'] / 100000) * ing['cost'] for ing in ingredient_data)
                
                # Insert formulation
                cursor = db.execute('''
                    INSERT INTO formulations (
                        product_name, product_type_id, grammage, pack_count,
                        total_cost_per_piece, status, current_version, notes, created_by
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (product_name, product_type_id, grammage, pack_count,
                      total_cost, status, 'v1.0', notes, current_user_id))
                
                formulation_id = cursor.lastrowid
                
                # Insert ingredients
                for ing in ingredient_data:
                    quantity_grams = grammage * ing['percentage'] / 100
                    cost_per_piece = (quantity_grams / 1000) * ing['cost']
                    
                    db.execute('''
                        INSERT INTO formulation_ingredients (
                            formulation_id, ingredient_id, percentage, quantity_grams, cost_per_piece
                        ) VALUES (?, ?, ?, ?, ?)
                    ''', (formulation_id, ing['id'], ing['percentage'], quantity_grams, cost_per_piece))
                
                # Create initial version
                db.execute('''
                    INSERT INTO formulation_versions (
                        formulation_id, version_number, cost_snapshot, created_by, change_notes
                    ) VALUES (?, ?, ?, ?, ?)
                ''', (formulation_id, 'v1.0', total_cost, current_user_id, 'Initial import'))
                
                # Handle benefits (optional)
                benefits_str = str(form_row.get('Benefits', '')).strip()
                if benefits_str and benefits_str != 'nan':
                    benefit_names = [b.strip() for b in benefits_str.split(',')]
                    for benefit_name in benefit_names:
                        benefit = db.execute('SELECT id FROM benefit_categories WHERE name = ?', (benefit_name,)).fetchone()
                        if benefit:
                            db.execute('''
                                INSERT OR IGNORE INTO formulation_benefits (formulation_id, benefit_id)
                                VALUES (?, ?)
                            ''', (formulation_id, benefit['id']))
                
                db.commit()
                success_count += 1
                
            except Exception as e:
                errors.append(f"Formulation row {index + 2}: {str(e)}")
                error_count += 1
                db.rollback()
                continue
        
        return jsonify({
            'success': True,
            'message': f'Import completed: {success_count} formulations imported, {error_count} failed',
            'success_count': success_count,
            'error_count': error_count,
            'errors': errors[:20]  # Limit to first 20 errors
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# DOWNLOAD TEMPLATES
# ============================================================================

@app.route('/api/ingredients/template', methods=['GET'])
@jwt_required()
def download_ingredient_template():
    """Download ingredient import template Excel file"""
    try:
        # Create sample data
        data = {
            'Name': ['Coconut Oil', 'Palm Oil', 'Neem Extract'],
            'Category': ['Oils', 'Oils', 'Botanicals'],
            'Subcategory': ['Base Oils', 'Base Oils', 'Extracts'],
            'Cost (₹/kg)': [250.50, 180.00, 1200.00],
            'Supplier': ['ABC Traders', 'XYZ Co', 'ABC Traders'],
            'Stock Status': ['in_stock', 'in_stock', 'low_stock'],
            'Unit': ['kg', 'kg', 'kg'],
            'MOQ': [25, 50, 5],
            'Shelf Life': [24, 24, 12],
            'HSN Code': ['15131000', '15119000', '13021900'],
            'CAS Number': ['8001-31-8', '8002-75-3', '84696-25-3'],
            'INCI Name': ['Cocos Nucifera Oil', 'Elaeis Guineensis Oil', 'Azadirachta Indica Extract'],
            'Storage': ['Cool, dry place', 'Cool, dry place', 'Cool, dark place'],
            'Tags': ['soaps,cosmetics', 'soaps', 'soaps'],
            'US Approved': ['Yes', 'Yes', 'Yes'],
            'EU Approved': ['Yes', 'Yes', 'No']
        }
        
        df = pd.DataFrame(data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Ingredients', index=False)
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='ingredient_import_template.xlsx'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/formulations/template', methods=['GET'])
@jwt_required()
def download_formulation_template():
    """Download formulation import template Excel file (2 sheets)"""
    try:
        # Sheet 1: Formulations
        formulations_data = {
            'Product Name': ['Neem Soap', 'Rose Bath Bar'],
            'Product Type': ['Bar Soap', 'Bar Soap'],
            'Grammage': [125, 100],
            'Pack Count': [3, 6],
            'Status': ['active', 'active'],
            'Notes': ['Our flagship product', 'Luxury line'],
            'Benefits': ['Antibacterial,Moisturizing', 'Moisturizing,Anti-aging'],
            'Tags': ['premium,bestseller', 'luxury,floral']
        }
        
        # Sheet 2: Ingredients
        ingredients_data = {
            'Product Name': ['Neem Soap', 'Neem Soap', 'Neem Soap', 'Neem Soap', 'Neem Soap',
                           'Rose Bath Bar', 'Rose Bath Bar', 'Rose Bath Bar', 'Rose Bath Bar'],
            'Ingredient Name': ['Coconut Oil', 'Palm Oil', 'Neem Extract', 'Caustic Soda', 'Water',
                              'Coconut Oil', 'Palm Oil', 'Rose Oil', 'Caustic Soda'],
            'Percentage': [45.00, 30.00, 5.00, 15.00, 5.00,
                          40.00, 35.00, 2.00, 23.00]
        }
        
        formulations_df = pd.DataFrame(formulations_data)
        ingredients_df = pd.DataFrame(ingredients_data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            formulations_df.to_excel(writer, sheet_name='Formulations', index=False)
            ingredients_df.to_excel(writer, sheet_name='Ingredients', index=False)
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='formulation_import_template.xlsx'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
