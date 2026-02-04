#!/usr/bin/env python3
"""
Swati Soaps - Full Application Test Suite
Tests all features with Admin and QC roles

Run: python3 test_full_app.py
"""

import requests
import json
import time
import sys
import os

BASE_URL = "http://localhost:5000/api"

# Test credentials
USERS = {
    'admin': {'email': 'admin@swatisoaps.com', 'password': 'admin123'},
    'qc': {'email': 'qc@swatisoaps.com', 'password': 'qc123'}
}

# Store tokens
TOKENS = {}

# Test results
RESULTS = {'passed': 0, 'failed': 0, 'skipped': 0}
FAILURES = []


def log(message, status=None):
    """Print formatted log message"""
    if status == 'PASS':
        print(f"  ✅ {message}")
        RESULTS['passed'] += 1
    elif status == 'FAIL':
        print(f"  ❌ {message}")
        RESULTS['failed'] += 1
        FAILURES.append(message)
    elif status == 'SKIP':
        print(f"  ⏭️  {message}")
        RESULTS['skipped'] += 1
    elif status == 'SECTION':
        print(f"\n{'='*60}")
        print(f"  {message}")
        print('='*60)
    elif status == 'SUBSECTION':
        print(f"\n  --- {message} ---")
    else:
        print(f"  {message}")


def headers(role='admin'):
    """Get auth headers for role"""
    return {
        'Authorization': f"Bearer {TOKENS.get(role, '')}",
        'Content-Type': 'application/json'
    }


def test_server_running():
    """Check if server is running"""
    log("SERVER CONNECTIVITY", 'SECTION')
    try:
        response = requests.get(f"{BASE_URL.replace('/api', '')}/", timeout=5)
        log("Backend server is running", 'PASS')
        return True
    except requests.exceptions.ConnectionError:
        log("Backend server not running - start with: python3 app.py", 'FAIL')
        return False


def test_authentication():
    """Test login for both roles"""
    log("AUTHENTICATION", 'SECTION')

    for role, creds in USERS.items():
        log(f"Login as {role}", 'SUBSECTION')
        try:
            response = requests.post(f"{BASE_URL}/auth/login", json=creds)
            if response.status_code == 200:
                data = response.json()
                TOKENS[role] = data.get('token')
                user = data.get('user', {})
                log(f"Login successful - {user.get('name')} ({user.get('role')})", 'PASS')
            else:
                log(f"Login failed: {response.text}", 'FAIL')
        except Exception as e:
            log(f"Login error: {e}", 'FAIL')

    return len(TOKENS) > 0


def test_ingredients_crud(role='admin'):
    """Test ingredient operations"""
    log(f"INGREDIENTS ({role.upper()})", 'SECTION')

    # List ingredients
    log("List ingredients", 'SUBSECTION')
    try:
        response = requests.get(f"{BASE_URL}/ingredients", headers=headers(role))
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('ingredients', []))
            log(f"Listed {count} ingredients", 'PASS')
        else:
            log(f"Failed to list: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')

    # Get single ingredient
    log("Get single ingredient", 'SUBSECTION')
    try:
        response = requests.get(f"{BASE_URL}/ingredients/1", headers=headers(role))
        if response.status_code == 200:
            ing = response.json().get('ingredient', {})
            log(f"Got ingredient: {ing.get('name')}", 'PASS')
        else:
            log(f"Failed: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')

    # Search ingredients
    log("Search ingredients", 'SUBSECTION')
    try:
        response = requests.get(f"{BASE_URL}/ingredients?search=coconut", headers=headers(role))
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('ingredients', []))
            log(f"Search returned {count} results", 'PASS')
        else:
            log(f"Search failed: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')

    # Create ingredient (admin only)
    if role == 'admin':
        log("Create ingredient", 'SUBSECTION')
        test_ingredient = {
            'name': f'Test Ingredient {int(time.time())}',
            'category_id': 1,
            'landed_cost_net_gst': 100.00
        }
        try:
            response = requests.post(f"{BASE_URL}/ingredients", headers=headers(role), json=test_ingredient)
            if response.status_code == 201:
                new_id = response.json().get('id')  # Direct ID in response
                log(f"Created ingredient ID: {new_id}", 'PASS')

                # Update ingredient
                log("Update ingredient", 'SUBSECTION')
                response = requests.put(f"{BASE_URL}/ingredients/{new_id}", headers=headers(role),
                                       json={'name': test_ingredient['name'], 'landed_cost_net_gst': 150.00})
                if response.status_code == 200:
                    log("Updated ingredient price", 'PASS')
                else:
                    log(f"Update failed: {response.status_code}", 'FAIL')

                # Delete ingredient
                log("Delete ingredient", 'SUBSECTION')
                response = requests.delete(f"{BASE_URL}/ingredients/{new_id}", headers=headers(role))
                if response.status_code == 200:
                    log("Deleted test ingredient", 'PASS')
                else:
                    log(f"Delete failed: {response.status_code}", 'FAIL')
            else:
                log(f"Create failed: {response.text}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')


def test_categories(role='admin'):
    """Test category endpoints"""
    log(f"CATEGORIES ({role.upper()})", 'SECTION')

    try:
        response = requests.get(f"{BASE_URL}/categories", headers=headers(role))
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('categories', []))
            log(f"Listed {count} categories", 'PASS')
        else:
            log(f"Failed: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')


def test_formulations_crud(role='admin'):
    """Test formulation operations"""
    log(f"FORMULATIONS ({role.upper()})", 'SECTION')

    # List formulations
    log("List formulations", 'SUBSECTION')
    try:
        response = requests.get(f"{BASE_URL}/formulations", headers=headers(role))
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('formulations', []))
            log(f"Listed {count} formulations", 'PASS')
            formulations = data.get('formulations', [])
        else:
            log(f"Failed: {response.status_code}", 'FAIL')
            formulations = []
    except Exception as e:
        log(f"Error: {e}", 'FAIL')
        formulations = []

    # Get single formulation
    if formulations:
        log("Get single formulation", 'SUBSECTION')
        test_id = formulations[0]['id']
        try:
            response = requests.get(f"{BASE_URL}/formulations/{test_id}", headers=headers(role))
            if response.status_code == 200:
                form = response.json().get('formulation', {})
                log(f"Got: {form.get('product_name')}", 'PASS')
            else:
                log(f"Failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')

    # Create formulation
    log("Create formulation", 'SUBSECTION')
    test_formulation = {
        'product_name': f'Test Soap {int(time.time())}',
        'product_type_id': 1,
        'grammage': 100,
        'pack_count': 1,
        'status': 'draft',
        'ingredients': [
            {'ingredient_id': 1, 'percentage': 50},
            {'ingredient_id': 2, 'percentage': 30},
            {'ingredient_id': 3, 'percentage': 20}
        ]
    }

    created_id = None
    try:
        response = requests.post(f"{BASE_URL}/formulations", headers=headers(role), json=test_formulation)
        if response.status_code == 201:
            created_id = response.json().get('formulation_id')
            log(f"Created formulation ID: {created_id}", 'PASS')
        else:
            log(f"Create failed: {response.text[:100]}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')

    if created_id:
        # Update formulation
        log("Update formulation", 'SUBSECTION')
        try:
            update_data = {
                'product_name': test_formulation['product_name'],
                'grammage': 150,
                'pack_count': 1,
                'ingredients': test_formulation['ingredients']
            }
            response = requests.put(f"{BASE_URL}/formulations/{created_id}", headers=headers(role), json=update_data)
            if response.status_code == 200:
                log("Updated grammage to 150g", 'PASS')
            else:
                log(f"Update failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')

        # Create version
        log("Create new version", 'SUBSECTION')
        try:
            version_data = {
                'product_name': test_formulation['product_name'],
                'grammage': 200,
                'pack_count': 1,
                'create_new_version': True,
                'version_notes': 'Test version from script',
                'ingredients': test_formulation['ingredients']
            }
            response = requests.put(f"{BASE_URL}/formulations/{created_id}", headers=headers(role), json=version_data)
            if response.status_code == 200:
                log("Created new version", 'PASS')
            else:
                log(f"Version creation failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')

        # Get versions
        log("Get version history", 'SUBSECTION')
        try:
            response = requests.get(f"{BASE_URL}/formulations/{created_id}/versions", headers=headers(role))
            if response.status_code == 200:
                versions = response.json().get('versions', [])
                log(f"Found {len(versions)} versions", 'PASS')
            else:
                log(f"Failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')

        # Get benefits
        log("Get benefits", 'SUBSECTION')
        try:
            response = requests.get(f"{BASE_URL}/formulations/{created_id}/benefits", headers=headers(role))
            if response.status_code == 200:
                benefits = response.json()
                log(f"Got {len(benefits.get('consolidated_benefits', []))} benefits", 'PASS')
            else:
                log(f"Failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')

        # Get marketing benefits (Claude API)
        log("Get marketing benefits (Claude API)", 'SUBSECTION')
        try:
            response = requests.get(f"{BASE_URL}/formulations/{created_id}/marketing-benefits", headers=headers(role))
            if response.status_code == 200:
                data = response.json()
                statements = data.get('marketing_statements', [])
                if statements:
                    log(f"Generated {len(statements)} marketing statements", 'PASS')
                    for s in statements[:3]:
                        log(f"   • {s}")
                else:
                    message = data.get('message', 'No statements')
                    log(f"No statements: {message}", 'SKIP')
            else:
                log(f"Failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')

        # Delete formulation
        log("Delete formulation", 'SUBSECTION')
        try:
            response = requests.delete(f"{BASE_URL}/formulations/{created_id}", headers=headers(role))
            if response.status_code == 200:
                log("Deleted test formulation", 'PASS')
            else:
                log(f"Delete failed: {response.status_code}", 'FAIL')
        except Exception as e:
            log(f"Error: {e}", 'FAIL')


def test_import_preview(role='admin'):
    """Test ingredient import preview"""
    log(f"INGREDIENT IMPORT ({role.upper()})", 'SECTION')

    # Create test CSV
    import tempfile
    csv_content = """Name,INCI,Category,Cost (Rs/kg)
Coconut Oil,Cocos Nucifera Oil,Oils,275
Palm Oil,Elaeis Guineensis Oil,Oils,195
"""

    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        f.write(csv_content)
        temp_file = f.name

    log("Upload CSV for preview", 'SUBSECTION')
    try:
        with open(temp_file, 'rb') as f:
            files = {'file': ('test_import.csv', f, 'text/csv')}
            response = requests.post(
                f"{BASE_URL}/ingredients/import",
                headers={'Authorization': f"Bearer {TOKENS.get(role, '')}"},
                files=files
            )

        if response.status_code == 200:
            data = response.json()
            changes = len(data.get('changes', []))
            log(f"Preview: {changes} price changes detected", 'PASS')
        else:
            log(f"Import preview failed: {response.text[:100]}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')
    finally:
        os.unlink(temp_file)


def test_dashboard(role='admin'):
    """Test dashboard-like stats by counting formulations and ingredients"""
    log(f"DASHBOARD STATS ({role.upper()})", 'SECTION')

    try:
        # Get formulation count
        response = requests.get(f"{BASE_URL}/formulations", headers=headers(role))
        if response.status_code == 200:
            count = len(response.json().get('formulations', []))
            log(f"Total formulations: {count}", 'PASS')
        else:
            log(f"Failed to get formulations: {response.status_code}", 'FAIL')

        # Get ingredient count
        response = requests.get(f"{BASE_URL}/ingredients", headers=headers(role))
        if response.status_code == 200:
            count = len(response.json().get('ingredients', []))
            log(f"Total ingredients: {count}", 'PASS')
        else:
            log(f"Failed to get ingredients: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')


def test_export(role='admin'):
    """Test ingredient export"""
    log(f"INGREDIENT EXPORT ({role.upper()})", 'SECTION')

    try:
        response = requests.get(f"{BASE_URL}/ingredients/export-csv", headers=headers(role))
        if response.status_code == 200:
            content_type = response.headers.get('Content-Type', '')
            if 'text/csv' in content_type:
                lines = response.text.count('\n')
                log(f"Exported CSV with {lines} rows", 'PASS')
            else:
                log(f"Unexpected content type: {content_type}", 'FAIL')
        else:
            log(f"Export failed: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')


def test_qc_permissions():
    """Test QC role specific permissions"""
    log("QC ROLE PERMISSIONS", 'SECTION')

    if 'qc' not in TOKENS:
        log("QC user not available - skipping permission tests", 'SKIP')
        return

    # QC should be able to read
    log("QC can read formulations", 'SUBSECTION')
    try:
        response = requests.get(f"{BASE_URL}/formulations", headers=headers('qc'))
        if response.status_code == 200:
            log("QC can list formulations", 'PASS')
        else:
            log(f"QC cannot read: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')

    # QC should be able to read ingredients
    log("QC can read ingredients", 'SUBSECTION')
    try:
        response = requests.get(f"{BASE_URL}/ingredients", headers=headers('qc'))
        if response.status_code == 200:
            log("QC can list ingredients", 'PASS')
        else:
            log(f"QC cannot read: {response.status_code}", 'FAIL')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')


def test_existing_formulation_benefits():
    """Test benefits on an existing formulation with ingredients"""
    log("EXISTING FORMULATION BENEFITS", 'SECTION')

    # Find a formulation with many ingredients
    try:
        response = requests.get(f"{BASE_URL}/formulations", headers=headers('admin'))
        if response.status_code == 200:
            formulations = response.json().get('formulations', [])
            # Find one with most ingredients
            best = max(formulations, key=lambda x: x.get('ingredient_count', 0)) if formulations else None

            if best and best.get('ingredient_count', 0) > 5:
                log(f"Testing: {best['product_name']} ({best['ingredient_count']} ingredients)", 'SUBSECTION')

                # Get marketing benefits
                response = requests.get(f"{BASE_URL}/formulations/{best['id']}/marketing-benefits", headers=headers('admin'))
                if response.status_code == 200:
                    data = response.json()
                    statements = data.get('marketing_statements', [])
                    raw = data.get('raw_benefits', [])

                    log(f"Raw benefits: {len(raw)}", 'PASS')

                    if statements:
                        log(f"Marketing statements: {len(statements)}", 'PASS')
                        print("\n  Generated Marketing Copy:")
                        for i, s in enumerate(statements, 1):
                            print(f"    {i}. {s}")
                    else:
                        log(f"No marketing statements: {data.get('message', 'Unknown')}", 'SKIP')
                else:
                    log(f"Failed: {response.status_code}", 'FAIL')
            else:
                log("No formulation with enough ingredients found", 'SKIP')
    except Exception as e:
        log(f"Error: {e}", 'FAIL')


def print_summary():
    """Print test summary"""
    print("\n" + "="*60)
    print("  TEST SUMMARY")
    print("="*60)
    print(f"  ✅ Passed:  {RESULTS['passed']}")
    print(f"  ❌ Failed:  {RESULTS['failed']}")
    print(f"  ⏭️  Skipped: {RESULTS['skipped']}")
    print("="*60)

    if FAILURES:
        print("\n  FAILURES:")
        for f in FAILURES:
            print(f"    • {f}")

    total = RESULTS['passed'] + RESULTS['failed']
    if total > 0:
        success_rate = (RESULTS['passed'] / total) * 100
        print(f"\n  Success Rate: {success_rate:.1f}%")

    print("="*60 + "\n")

    return RESULTS['failed'] == 0


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  SWATI SOAPS - FULL APPLICATION TEST SUITE")
    print("  Testing Admin and QC roles")
    print("="*60)

    # Check server
    if not test_server_running():
        print("\n❌ Cannot proceed - backend server not running")
        print("   Start with: cd backend && python3 app.py\n")
        sys.exit(1)

    # Authentication
    if not test_authentication():
        print("\n❌ Cannot proceed - authentication failed")
        sys.exit(1)

    # Admin tests
    test_dashboard('admin')
    test_categories('admin')
    test_ingredients_crud('admin')
    test_formulations_crud('admin')
    test_import_preview('admin')
    test_export('admin')
    test_existing_formulation_benefits()

    # QC tests
    if 'qc' in TOKENS:
        test_qc_permissions()
        test_ingredients_crud('qc')

    # Summary
    success = print_summary()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
