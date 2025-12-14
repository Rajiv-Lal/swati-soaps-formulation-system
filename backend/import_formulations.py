#!/usr/bin/env python3
"""
Import Formulations from Globalbees Excel File
Run on server: python3 import_formulations.py
"""

import sqlite3
from datetime import datetime

# Database path - update if different
DB_PATH = '/home/swatisoaps/swati-soaps-formulation-system/backend/swati_soaps.db'

# Today's date for created_at/updated_at
TODAY = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# Formulation data extracted from Excel
FORMULATIONS = [
    {
        'name': 'Kozicare Skin Lightening Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP NOODLES', 94.67), ('KAD', 1.55), ('Arbutin', 0.1), ('Glutathione', 0.1),
            ('Golden beauty', 1.3), ('Songi mushroom', 0.07), ('TiO2', 0.3), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Niacinamide', 1.0), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.1), ('Vitamin C (SAP)', 0.1)
        ]
    },
    {
        'name': 'Kozicare Skin Lightening Soap 75g 1-Pack',
        'grammage': 77,
        'pack_count': 1,
        'ingredients': [
            ('SOAP NOODLES', 94.67), ('KAD', 1.55), ('Arbutin', 0.1), ('Glutathione', 0.1),
            ('Golden beauty', 1.3), ('Songi mushroom', 0.07), ('TiO2', 0.3), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Niacinamide', 1.0), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.1), ('Vitamin C (SAP)', 0.1)
        ]
    },
    {
        'name': 'Kozicare Skin Lightening Soap 75g 6-Pack',
        'grammage': 77,
        'pack_count': 6,
        'ingredients': [
            ('SOAP NOODLES', 94.65), ('KAD', 1.55), ('Arbutin', 0.1), ('Glutathione', 0.1),
            ('Golden beauty', 1.3), ('Songi mushroom', 0.1), ('TiO2', 0.3), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Niacinamide', 1.0), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.1), ('Vitamin C (SAP)', 0.1)
        ]
    },
    {
        'name': 'Kozicare Skin Lightening Soap 75g 9-Pack',
        'grammage': 77,
        'pack_count': 9,
        'ingredients': [
            ('SOAP NOODLES', 94.65), ('KAD', 1.55), ('Arbutin', 0.1), ('Glutathione', 0.1),
            ('Golden beauty', 1.3), ('Songi mushroom', 0.1), ('TiO2', 0.3), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Niacinamide', 1.0), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.1), ('Vitamin C (SAP)', 0.1)
        ]
    },
    {
        'name': 'Glutalight Skin Brightening Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP NOODLES', 94.35), ('KAD', 1.5), ('Arbutin', 0.1), ('Glutathione', 0.2),
            ('Golden beauty', 1.3), ('Songi mushroom', 0.35), ('TiO2', 0.3), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Niacinamide', 1.0), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.1), ('Vitamin C (SAP)', 0.1)
        ]
    },
    {
        'name': 'Glutalight Glycerin Soap Bar 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP base', 96.65), ('KAD', 0.2), ('Glutathione', 0.1), ('Pine perfume', 1.5),
            ('Black castor oil', 0.15), ('EDTA', 0.1), ('Olivum 300', 0.3), ('Sodium PCA', 0.2),
            ('Tinoguard TT', 0.05), ('Niacinamide', 0.5), ('Tinopol CBSX', 0.05),
            ('Vitamin E', 0.1), ('Vitamin C (SAP)', 0.1)
        ]
    },
    {
        'name': 'Kozicare Banana Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP base', 93.23), ('KAD', 2.0), ('Glutathione', 0.1), ('Arbutin', 0.02),
            ('Pine', 1.5), ('Niacinamide', 1.0), ('Banana peel extract', 0.6), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Mushroom extract', 0.1), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.15),
            ('Isopropyl myristate', 0.5), ('Vitamin C', 0.1)
        ]
    },
    {
        'name': 'Kozicare Tomato Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP base', 93.33), ('KAD', 2.0), ('Glutathione', 0.1), ('Arbutin', 0.02),
            ('Pine', 1.5), ('Niacinamide', 1.0), ('Tomato extract', 0.5), ('EDTA', 0.1),
            ('Olivum 300', 0.3), ('Sodium PCA', 0.2), ('Tinoguard TT', 0.05),
            ('Mushroom extract', 0.1), ('Tinopol CBSX', 0.05), ('Vitamin E', 0.1),
            ('Isopropyl myristate', 0.5), ('Vitamin C', 0.15)
        ]
    },
    {
        'name': 'Kozicare Saffron Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP base', 94.77), ('KAD', 2.0), ('Saffron perfume', 1.7), ('Virgin coconut oil', 0.3),
            ('Saffron stigma', 0.03), ('EDTA', 0.1), ('Olivum 300', 0.3), ('Sodium PCA', 0.2),
            ('Tinoguard TT', 0.05), ('Olivum 400', 0.3), ('Tinopol CBSX', 0.05),
            ('Vitamin E', 0.1), ('Mushroom extract', 0.1)
        ]
    },
    {
        'name': 'Kozicare Sandal Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP base', 93.05), ('KAD', 2.0), ('Sandal RK', 1.8), ('Virgin coconut oil', 0.3),
            ('Sandal powder', 0.05), ('EDTA', 0.1), ('Olivum 300', 0.5), ('Sodium PCA', 0.2),
            ('Tinoguard TT', 0.05), ('Mushroom extract', 0.1), ('Tinopol CBSX', 0.05),
            ('Vitamin E', 0.4), ('Turmeric oil', 0.5)
        ]
    },
    {
        'name': 'Kozicare Papaya Soap 75g 3-Pack',
        'grammage': 77,
        'pack_count': 3,
        'ingredients': [
            ('SOAP base', 94.9), ('KAD', 2.0), ('Green apple', 1.3), ('Virgin coconut oil', 0.2),
            ('Papaya extract', 0.3), ('EDTA', 0.1), ('Olivum 300', 0.4), ('Sodium PCA', 0.2),
            ('Tinoguard TT', 0.05), ('Mushroom extract', 0.1), ('Tinopol CBSX', 0.05),
            ('Vitamin E', 0.25), ('Licorice extract', 0.15)
        ]
    }
]

# Ingredient name mappings (Excel name -> DB name or new ingredient info)
INGREDIENT_MAPPINGS = {
    'SOAP NOODLES': {'name': 'Soap Noodles', 'category_id': 10},  # Soap Bases
    'SOAP base': {'name': 'Soap Base (Glycerin)', 'category_id': 10},
    'KAD': {'name': 'KAD (Potassium Alum Deodorant)', 'category_id': 2},  # Additives
    'Arbutin': {'name': 'Alpha Arbutin', 'category_id': 1},  # Active Ingredients
    'Glutathione': {'name': 'Glutathione', 'category_id': 1},
    'Golden beauty': {'name': 'Golden Beauty Fragrance', 'category_id': 8},  # Fragrances
    'Songi mushroom': {'name': 'Songi Mushroom Extract', 'category_id': 3},  # Botanicals
    'TiO2': {'name': 'Titanium Dioxide', 'category_id': 6},  # Colorants
    'EDTA': {'name': 'EDTA', 'category_id': 2},
    'Olivum 300': {'name': 'Olivum 300', 'category_id': 2},
    'Olivum 400': {'name': 'Olivum 400', 'category_id': 2},
    'Sodium PCA': {'name': 'Sodium PCA', 'category_id': 1},
    'Tinoguard TT': {'name': 'Tinoguard TT', 'category_id': 2},
    'Niacinamide': {'name': 'Niacinamide', 'category_id': 1},
    'Tinopol CBSX': {'name': 'Tinopol CBSX', 'category_id': 2},
    'Vitamin E': {'name': 'Vitamin E (Tocopherol)', 'category_id': 1},
    'Vitamin C (SAP)': {'name': 'Vitamin C (SAP)', 'category_id': 1},
    'Vitamin C': {'name': 'Vitamin C (Ascorbic Acid)', 'category_id': 1},
    'Pine perfume': {'name': 'Pine Fragrance', 'category_id': 8},
    'Pine': {'name': 'Pine Fragrance', 'category_id': 8},
    'Black castor oil': {'name': 'Black Castor Oil', 'category_id': 5},  # Carrier Oils
    'Banana peel extract': {'name': 'Banana Peel Extract', 'category_id': 3},
    'Mushroom extract': {'name': 'Mushroom Extract', 'category_id': 3},
    'Isopropyl myristate': {'name': 'Isopropyl Myristate', 'category_id': 2},
    'Tomato extract': {'name': 'Tomato Extract', 'category_id': 3},
    'Saffron perfume': {'name': 'Saffron Fragrance', 'category_id': 8},
    'Virgin coconut oil': {'name': 'Virgin Coconut Oil', 'category_id': 5},
    'Saffron stigma': {'name': 'Saffron Stigma Extract', 'category_id': 3},
    'Sandal RK': {'name': 'Sandalwood Fragrance', 'category_id': 8},
    'Sandal powder': {'name': 'Sandalwood Powder', 'category_id': 3},
    'Turmeric oil': {'name': 'Turmeric Oil', 'category_id': 7},  # Essential Oils
    'Green apple': {'name': 'Green Apple Fragrance', 'category_id': 8},
    'Papaya extract': {'name': 'Papaya Extract', 'category_id': 3},
    'Licorice extract': {'name': 'Licorice Extract', 'category_id': 3},
}

def get_or_create_ingredient(cursor, excel_name):
    """Get ingredient ID, create if doesn't exist"""
    mapping = INGREDIENT_MAPPINGS.get(excel_name, {'name': excel_name, 'category_id': 9})  # Default: Miscellaneous
    db_name = mapping['name']
    
    # Try to find by name (case-insensitive)
    cursor.execute("SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?)", (db_name,))
    result = cursor.fetchone()
    
    if result:
        return result[0]
    
    # Also try original Excel name
    cursor.execute("SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?)", (excel_name,))
    result = cursor.fetchone()
    
    if result:
        return result[0]
    
    # Create new ingredient
    cursor.execute("""
        INSERT INTO ingredients (name, category_id, landed_cost_net_gst, created_at, updated_at)
        VALUES (?, ?, 0, ?, ?)
    """, (db_name, mapping['category_id'], TODAY, TODAY))
    
    print(f"  ✅ Created ingredient: {db_name}")
    return cursor.lastrowid

def main():
    print(f"=" * 60)
    print(f"FORMULATION IMPORT")
    print(f"Date: {TODAY}")
    print(f"Database: {DB_PATH}")
    print(f"=" * 60)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get product_type_id for Bar Soap
    cursor.execute("SELECT id FROM product_types WHERE name LIKE '%Bar%' OR name LIKE '%Soap%' LIMIT 1")
    result = cursor.fetchone()
    product_type_id = result[0] if result else 1
    print(f"\nProduct Type ID: {product_type_id}")
    
    formulations_created = 0
    ingredients_linked = 0
    
    for form in FORMULATIONS:
        print(f"\n📦 Processing: {form['name']}")
        
        # Check if formulation already exists
        cursor.execute("SELECT id FROM formulations WHERE LOWER(product_name) = LOWER(?)", (form['name'],))
        if cursor.fetchone():
            print(f"  ⏭️  Already exists, skipping")
            continue
        
        # Create formulation
        cursor.execute("""
            INSERT INTO formulations (
                product_name, product_type_id, grammage, pack_count, 
                status, current_version, created_at, updated_at
            ) VALUES (?, ?, ?, ?, 'active', 'v1.0', ?, ?)
        """, (form['name'], product_type_id, form['grammage'], form['pack_count'], TODAY, TODAY))
        
        formulation_id = cursor.lastrowid
        formulations_created += 1
        print(f"  ✅ Created formulation ID: {formulation_id}")
        
        # Add ingredients
        for ing_name, percentage in form['ingredients']:
            ingredient_id = get_or_create_ingredient(cursor, ing_name)
            
            cursor.execute("""
                INSERT INTO formulation_ingredients (formulation_id, ingredient_id, percentage)
                VALUES (?, ?, ?)
            """, (formulation_id, ingredient_id, percentage))
            ingredients_linked += 1
        
        print(f"  ✅ Linked {len(form['ingredients'])} ingredients")
    
    conn.commit()
    conn.close()
    
    print(f"\n" + "=" * 60)
    print(f"IMPORT COMPLETE")
    print(f"Formulations created: {formulations_created}")
    print(f"Ingredient links: {ingredients_linked}")
    print(f"=" * 60)

if __name__ == '__main__':
    main()
