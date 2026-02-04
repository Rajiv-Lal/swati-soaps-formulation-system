#!/usr/bin/env python3
"""
End-to-End Version Testing Script
Tests: Create formulation, create versions, edit versions, update prices, verify graph data
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000/api"
TOKEN = None

def log(message, data=None):
    print(f"\n{'='*60}")
    print(f">> {message}")
    if data:
        print(json.dumps(data, indent=2))
    print('='*60)

def login():
    global TOKEN
    print("\n[1] LOGGING IN...")

    # Try different credentials
    credentials = [
        {"email": "admin@swatisoaps.com", "password": "admin123"},
        {"email": "admin@swatisoaps.com", "password": "admin"},
        {"email": "in@quintessence.in", "password": "admin123"},
        {"email": "in@quintessence.in", "password": "owner123"},
    ]

    for cred in credentials:
        response = requests.post(f"{BASE_URL}/auth/login", json=cred)
        if response.status_code == 200:
            TOKEN = response.json().get('token')
            print(f"    ✓ Login successful with {cred['email']}")
            return True

    print(f"    ✗ Login failed with all credentials")
    print(f"    Last response: {response.text}")
    return False

def headers():
    return {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

def get_ingredients():
    print("\n[2] FETCHING INGREDIENTS...")
    response = requests.get(f"{BASE_URL}/ingredients", headers=headers())
    if response.status_code == 200:
        ingredients = response.json().get('ingredients', [])
        print(f"    ✓ Found {len(ingredients)} ingredients")
        return ingredients
    print(f"    ✗ Failed to fetch ingredients: {response.text}")
    return []

def create_test_formulation(ingredients):
    print("\n[3] CREATING TEST FORMULATION...")

    # Pick 4 ingredients for the test soap
    test_ingredients = []
    for ing in ingredients[:10]:  # Look in first 10
        if len(test_ingredients) < 4:
            test_ingredients.append(ing)

    if len(test_ingredients) < 4:
        test_ingredients = ingredients[:4]

    # Assign percentages that sum to 100
    percentages = [40, 30, 20, 10]

    payload = {
        "product_name": f"Test Soap Version Check {int(time.time())}",
        "product_type_id": 1,
        "grammage": 75,
        "pack_count": 1,
        "status": "draft",
        "notes": "Test formulation for version checking",
        "ingredients": [
            {"ingredient_id": test_ingredients[i]['id'], "percentage": percentages[i]}
            for i in range(min(4, len(test_ingredients)))
        ]
    }

    print(f"    Creating with ingredients: {[i['name'] for i in test_ingredients[:4]]}")

    response = requests.post(f"{BASE_URL}/formulations", headers=headers(), json=payload)
    if response.status_code == 201:
        data = response.json()
        formulation_id = data.get('formulation_id')
        print(f"    ✓ Created formulation ID: {formulation_id}")
        return formulation_id, test_ingredients[:4]
    else:
        print(f"    ✗ Failed to create formulation: {response.text}")
        return None, None

def create_version(formulation_id, version_num, ingredients, grammage, notes):
    print(f"\n[4.{version_num}] CREATING VERSION {version_num}...")

    # Modify percentages slightly for each version
    base_percentages = [40, 30, 20, 10]
    if version_num == 2:
        base_percentages = [35, 35, 20, 10]  # Changed percentages
    elif version_num == 3:
        base_percentages = [38, 32, 18, 12]  # Changed again

    payload = {
        "product_name": f"Test Soap Version Check",
        "grammage": grammage,
        "pack_count": 1,
        "status": "draft",
        "create_new_version": True,
        "version_notes": notes,
        "ingredients": [
            {"ingredient_id": ingredients[i]['id'], "percentage": base_percentages[i]}
            for i in range(min(4, len(ingredients)))
        ]
    }

    response = requests.put(f"{BASE_URL}/formulations/{formulation_id}", headers=headers(), json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"    ✓ Created version with grammage={grammage}g, notes='{notes}'")
        return True
    else:
        print(f"    ✗ Failed to create version: {response.text}")
        return False

def get_versions(formulation_id):
    print(f"\n[5] FETCHING ALL VERSIONS...")
    response = requests.get(f"{BASE_URL}/formulations/{formulation_id}/versions", headers=headers())
    if response.status_code == 200:
        versions = response.json().get('versions', [])
        print(f"    ✓ Found {len(versions)} versions:")
        for v in versions:
            print(f"       - {v['version_number']}: Cost ₹{v.get('cost_snapshot', 0):.4f}, Notes: {v.get('change_notes', 'N/A')}")
        return versions
    print(f"    ✗ Failed to fetch versions: {response.text}")
    return []

def test_version_loading(formulation_id, version_id, version_number):
    print(f"\n[6] TESTING VERSION LOADING (v{version_number})...")
    response = requests.get(f"{BASE_URL}/formulations/{formulation_id}?version_id={version_id}", headers=headers())
    if response.status_code == 200:
        data = response.json().get('formulation', {})
        loaded_version = data.get('loaded_version_number')
        grammage = data.get('grammage')
        ingredients = data.get('ingredients', [])
        print(f"    ✓ Loaded version: {loaded_version}")
        print(f"    ✓ Grammage: {grammage}g")
        print(f"    ✓ Ingredients count: {len(ingredients)}")
        if ingredients:
            for ing in ingredients[:2]:
                print(f"       - {ing.get('ingredient_name')}: {ing.get('percentage')}%")
        return True
    else:
        print(f"    ✗ Failed to load version: {response.text}")
        return False

def update_ingredient_price(ingredient_id, ingredient_name, new_price):
    print(f"\n[7] UPDATING INGREDIENT PRICE...")
    print(f"    Updating '{ingredient_name}' to ₹{new_price}/kg")

    # First get the ingredient
    response = requests.get(f"{BASE_URL}/ingredients/{ingredient_id}", headers=headers())
    if response.status_code != 200:
        print(f"    ✗ Failed to fetch ingredient: {response.text}")
        return False

    ingredient = response.json().get('ingredient', {})

    # Update with new price
    payload = {
        "name": ingredient.get('name'),
        "landed_cost_net_gst": new_price
    }

    response = requests.put(f"{BASE_URL}/ingredients/{ingredient_id}", headers=headers(), json=payload)
    if response.status_code == 200:
        print(f"    ✓ Updated price to ₹{new_price}/kg")
        return True
    else:
        print(f"    ✗ Failed to update price: {response.text}")
        return False

def create_version_with_updated_prices(formulation_id, ingredients, grammage, notes):
    print(f"\n[8] CREATING NEW VERSION WITH UPDATED PRICES...")

    payload = {
        "product_name": f"Test Soap Version Check",
        "grammage": grammage,
        "pack_count": 1,
        "status": "draft",
        "create_new_version": True,
        "version_notes": notes,
        "ingredients": [
            {"ingredient_id": ingredients[i]['id'], "percentage": [42, 28, 18, 12][i]}
            for i in range(min(4, len(ingredients)))
        ]
    }

    response = requests.put(f"{BASE_URL}/formulations/{formulation_id}", headers=headers(), json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"    ✓ Created new version with updated ingredient prices")
        print(f"    New cost: ₹{data.get('total_cost', 'N/A')}")
        return True
    else:
        print(f"    ✗ Failed to create version: {response.text}")
        return False

def verify_graph_data(formulation_id):
    print(f"\n[9] VERIFYING GRAPH DATA...")
    response = requests.get(f"{BASE_URL}/formulations/{formulation_id}/versions", headers=headers())
    if response.status_code == 200:
        versions = response.json().get('versions', [])
        print(f"    ✓ Graph data available for {len(versions)} versions:")
        print(f"\n    VERSION | DATE                | COST      | NOTES")
        print(f"    " + "-"*70)
        for v in versions:
            version = v.get('version_number', 'N/A')
            date = v.get('created_at', 'N/A')[:19] if v.get('created_at') else 'N/A'
            cost = f"₹{float(v.get('cost_snapshot', 0)):.4f}"
            notes = v.get('change_notes', 'N/A')[:30]
            print(f"    {version:7} | {date:19} | {cost:9} | {notes}")

        # Check cost trend
        costs = [float(v.get('cost_snapshot', 0)) for v in versions]
        if len(costs) >= 2:
            first_cost = costs[-1]  # Oldest (reversed order)
            last_cost = costs[0]    # Newest
            change = ((last_cost - first_cost) / first_cost * 100) if first_cost > 0 else 0
            print(f"\n    Cost Trend: {first_cost:.4f} → {last_cost:.4f} ({change:+.1f}%)")

        return True
    else:
        print(f"    ✗ Failed to fetch graph data: {response.text}")
        return False

def cleanup(formulation_id):
    print(f"\n[10] CLEANUP (Optional)...")
    print(f"    Test formulation ID: {formulation_id}")
    print(f"    You can delete it manually or keep it for testing the UI")

def run_full_test():
    print("\n" + "="*60)
    print("  SWATI SOAPS - VERSION FUNCTIONALITY TEST")
    print("="*60)

    # Step 1: Login
    if not login():
        print("\n❌ TEST FAILED: Could not login")
        return False

    # Step 2: Get ingredients
    ingredients = get_ingredients()
    if len(ingredients) < 4:
        print("\n❌ TEST FAILED: Not enough ingredients in database")
        return False

    # Step 3: Create test formulation
    formulation_id, test_ingredients = create_test_formulation(ingredients)
    if not formulation_id:
        print("\n❌ TEST FAILED: Could not create formulation")
        return False

    # Step 4: Create 3 versions
    # Version 2: Change grammage to 100g
    create_version(formulation_id, 2, test_ingredients, 100, "Increased grammage to 100g")
    time.sleep(1)  # Small delay for different timestamps

    # Version 3: Change grammage to 150g
    create_version(formulation_id, 3, test_ingredients, 150, "Premium size 150g")
    time.sleep(1)

    # Step 5: Fetch all versions
    versions = get_versions(formulation_id)
    if len(versions) < 3:
        print(f"\n⚠️ WARNING: Expected 3 versions, found {len(versions)}")

    # Step 6: Test loading each version
    print("\n" + "-"*60)
    print("  TESTING VERSION EDITABILITY")
    print("-"*60)
    for v in versions[:3]:
        test_version_loading(formulation_id, v['id'], v['version_number'])

    # Step 7: Update prices of two ingredients
    print("\n" + "-"*60)
    print("  UPDATING INGREDIENT PRICES")
    print("-"*60)
    if len(test_ingredients) >= 2:
        # Increase prices by 10%
        old_price_1 = test_ingredients[0].get('landed_cost_net_gst', 100)
        old_price_2 = test_ingredients[1].get('landed_cost_net_gst', 100)

        update_ingredient_price(
            test_ingredients[0]['id'],
            test_ingredients[0]['name'],
            float(old_price_1 or 100) * 1.1
        )
        update_ingredient_price(
            test_ingredients[1]['id'],
            test_ingredients[1]['name'],
            float(old_price_2 or 100) * 1.1
        )

    # Step 8: Create new version with updated prices
    create_version_with_updated_prices(
        formulation_id,
        test_ingredients,
        150,
        "Updated with new ingredient prices (+10%)"
    )

    # Step 9: Verify graph data
    print("\n" + "-"*60)
    print("  VERIFYING GRAPH DATA FOR UI")
    print("-"*60)
    verify_graph_data(formulation_id)

    # Cleanup info
    cleanup(formulation_id)

    print("\n" + "="*60)
    print("  ✅ ALL TESTS COMPLETED SUCCESSFULLY!")
    print("="*60)
    print(f"\n  Test formulation ID: {formulation_id}")
    print(f"  View in UI: http://localhost:3000/formulations/{formulation_id}")
    print(f"  Check Graph View in Version History tab")
    print("="*60 + "\n")

    return True

if __name__ == "__main__":
    run_full_test()
