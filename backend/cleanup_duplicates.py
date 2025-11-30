#!/usr/bin/env python3
"""DUPLICATE INGREDIENT CLEANUP"""
import sqlite3

DB_PATH = 'swati_soaps.db'

def find_duplicates():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT LOWER(name) as lower_name, COUNT(*) as count, 
               GROUP_CONCAT(id) as ids,
               GROUP_CONCAT(name) as names
        FROM ingredients
        GROUP BY LOWER(name)
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    ''')
    duplicates = cursor.fetchall()
    conn.close()
    
    if not duplicates:
        print("✅ No duplicates found!")
        return []
    
    print(f"\n{'='*80}")
    print(f"DUPLICATE INGREDIENTS FOUND: {len(duplicates)} sets")
    print(f"{'='*80}")
    print(f"{'Name':<30} {'Count':<10} {'IDs':<20} {'Variations'}")
    print(f"{'-'*80}")
    for dup in duplicates:
        lower_name, count, ids, names = dup
        print(f"{lower_name:<30} {count:<10} {ids:<20} {names}")
    return duplicates

def analyze_usage(duplicate_ids):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    ids = [int(id) for id in duplicate_ids.split(',')]
    print(f"\n  IDs: {ids}")
    for id in ids:
        cursor.execute('''
            SELECT i.id, i.name, COUNT(fi.formulation_id) as usage
            FROM ingredients i
            LEFT JOIN formulation_ingredients fi ON i.id = fi.ingredient_id
            WHERE i.id = ?
            GROUP BY i.id
        ''', (id,))
        result = cursor.fetchone()
        if result:
            print(f"    ID {result[0]}: {result[1]} - Used in {result[2]} formulations")
    conn.close()

def generate_merge_sql(duplicates):
    print(f"\n{'='*80}\nMERGE SQL\n{'='*80}\n")
    with open('/tmp/merge_duplicates.sql', 'w') as f:
        f.write("BEGIN TRANSACTION;\n\n")
        for dup in duplicates:
            lower_name, count, ids, names = dup
            print(f"Merging: {lower_name}")
            analyze_usage(ids)
            id_list = [int(id) for id in ids.split(',')]
            keep_id = min(id_list)
            remove_ids = [id for id in id_list if id != keep_id]
            print(f"  Keep ID {keep_id}, Remove {remove_ids}\n")
            for remove_id in remove_ids:
                f.write(f"UPDATE formulation_ingredients SET ingredient_id = {keep_id} WHERE ingredient_id = {remove_id};\n")
                f.write(f"DELETE FROM ingredients WHERE id = {remove_id};\n")
        f.write("\nCOMMIT;\n")
    print("✅ SQL saved to /tmp/merge_duplicates.sql\n")

print("\n" + "="*80 + "\nDUPLICATE CLEANUP\n" + "="*80)
duplicates = find_duplicates()
if duplicates:
    generate_merge_sql(duplicates)
    print("NEXT: Review /tmp/merge_duplicates.sql, then execute it")
else:
    print("✅ No cleanup needed!")
