#!/usr/bin/env python3
"""
SWATI SOAPS FORMULATION SYSTEM - COMPREHENSIVE TEST SUITE
Version: 2.3
Date: February 14, 2026

Tests all system functionalities including:
- Authentication
- Ingredients CRUD
- Formulations CRUD
- Version Control (with new diff generator and change reasons)
- BOM Generation
- Search & Filtering
- Regulatory Validation

Run: python3 test_all_functionalities.py
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000/api"
TEST_USER = {"email": "admin@swatisoaps.com", "password": "admin123"}

# Test counters
tests_passed = 0
tests_failed = 0
test_results = []


def log_test(name, passed, details=""):
    """Log test result"""
    global tests_passed, tests_failed
    status = "PASS" if passed else "FAIL"
    if passed:
        tests_passed += 1
    else:
        tests_failed += 1
    test_results.append({"name": name, "passed": passed, "details": details})
    print(f"  [{status}] {name}" + (f" - {details}" if details else ""))


def get_token():
    """Authenticate and get JWT token"""
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=TEST_USER)
        if response.status_code == 200:
            return response.json().get("access_token")
        return None
    except Exception as e:
        return None


def headers(token):
    """Get auth headers"""
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ============================================================================
# TEST SUITES
# ============================================================================

def test_authentication():
    """Test authentication endpoints"""
    print("\n1. AUTHENTICATION TESTS")
    print("=" * 50)

    # Test valid login
    response = requests.post(f"{BASE_URL}/auth/login", json=TEST_USER)
    log_test("Valid login returns 200", response.status_code == 200)

    token = response.json().get("access_token") if response.status_code == 200 else None
    log_test("Login returns access_token", token is not None)

    # Test invalid login
    response = requests.post(f"{BASE_URL}/auth/login", json={"email": "wrong@test.com", "password": "wrong"})
    log_test("Invalid login returns 401", response.status_code == 401)

    # Test /auth/me endpoint
    if token:
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers(token))
        log_test("GET /auth/me returns user info", response.status_code == 200)

    return token


def test_ingredients(token):
    """Test ingredient endpoints"""
    print("\n2. INGREDIENT TESTS")
    print("=" * 50)

    # List ingredients
    response = requests.get(f"{BASE_URL}/ingredients", headers=headers(token))
    log_test("GET /ingredients returns 200", response.status_code == 200)

    ingredients = response.json() if response.status_code == 200 else []
    log_test("Ingredients list is array", isinstance(ingredients, list))
    log_test("Has 200+ ingredients", len(ingredients) >= 200, f"Count: {len(ingredients)}")

    # Get single ingredient
    if ingredients:
        ing_id = ingredients[0]["id"]
        response = requests.get(f"{BASE_URL}/ingredients/{ing_id}", headers=headers(token))
        log_test("GET /ingredients/:id returns 200", response.status_code == 200)

        ing_data = response.json()
        log_test("Ingredient has INCI name", "inci_name" in ing_data)
        log_test("Ingredient has regulatory data", "regulatory" in ing_data or "eu_approved" in str(ing_data))

    # Test search
    response = requests.get(f"{BASE_URL}/ingredients?search=coconut", headers=headers(token))
    log_test("Ingredient search works", response.status_code == 200)

    return ingredients


def test_categories(token):
    """Test category endpoints"""
    print("\n3. CATEGORY TESTS")
    print("=" * 50)

    response = requests.get(f"{BASE_URL}/categories", headers=headers(token))
    log_test("GET /categories returns 200", response.status_code == 200)

    categories = response.json() if response.status_code == 200 else []
    log_test("Has 10+ categories", len(categories) >= 10, f"Count: {len(categories)}")

    return categories


def test_formulations(token, ingredients):
    """Test formulation CRUD"""
    print("\n4. FORMULATION TESTS")
    print("=" * 50)

    # List formulations
    response = requests.get(f"{BASE_URL}/formulations", headers=headers(token))
    log_test("GET /formulations returns 200", response.status_code == 200)

    formulations = response.json() if response.status_code == 200 else []
    log_test("Formulations list is array", isinstance(formulations, list))

    # Create test formulation
    if len(ingredients) >= 3:
        test_name = f"Test Soap {datetime.now().strftime('%H%M%S')}"
        create_data = {
            "product_name": test_name,
            "product_type_id": 1,
            "grammage": 100,
            "pack_count": 1,
            "status": "draft",
            "ingredients": [
                {"ingredient_id": ingredients[0]["id"], "percentage": 50},
                {"ingredient_id": ingredients[1]["id"], "percentage": 30},
                {"ingredient_id": ingredients[2]["id"], "percentage": 20}
            ]
        }

        response = requests.post(f"{BASE_URL}/formulations", headers=headers(token), json=create_data)
        log_test("POST /formulations creates formulation", response.status_code == 201)

        if response.status_code == 201:
            form_id = response.json().get("formulation_id")
            log_test("Create returns formulation_id", form_id is not None)

            # Get single formulation
            response = requests.get(f"{BASE_URL}/formulations/{form_id}", headers=headers(token))
            log_test("GET /formulations/:id returns 200", response.status_code == 200)

            form_data = response.json()
            log_test("Formulation has cost calculated", form_data.get("total_cost_per_piece") is not None)
            log_test("Formulation has 3 ingredients", len(form_data.get("ingredients", [])) == 3)

            return form_id

    return None


def test_version_control(token, form_id, ingredients):
    """Test version control with new diff generator and change reasons"""
    print("\n5. VERSION CONTROL TESTS (NEW)")
    print("=" * 50)

    if not form_id or len(ingredients) < 4:
        log_test("Skipping version tests - no formulation", False, "Need formulation ID")
        return

    # Update formulation WITHOUT new version
    update_data = {
        "product_name": f"Updated Soap {datetime.now().strftime('%H%M%S')}",
        "product_type_id": 1,
        "grammage": 100,
        "pack_count": 1,
        "create_new_version": False,
        "ingredients": [
            {"ingredient_id": ingredients[0]["id"], "percentage": 50},
            {"ingredient_id": ingredients[1]["id"], "percentage": 30},
            {"ingredient_id": ingredients[2]["id"], "percentage": 20}
        ]
    }

    response = requests.put(f"{BASE_URL}/formulations/{form_id}", headers=headers(token), json=update_data)
    log_test("Update without new version (create_new_version=false)", response.status_code == 200)

    # Verify version didn't change
    response = requests.get(f"{BASE_URL}/formulations/{form_id}", headers=headers(token))
    version_before = response.json().get("current_version", "v1.0")
    log_test("Version stays at v1.0 when update=false", version_before == "v1.0")

    # Update WITH new version and change reasons
    update_with_version = {
        "product_name": f"Versioned Soap {datetime.now().strftime('%H%M%S')}",
        "product_type_id": 1,
        "grammage": 100,
        "pack_count": 1,
        "create_new_version": True,
        "version_notes": "Testing version control",
        "change_reasons": ["Price Optimization", "Hardness Adjustment"],
        "ingredients": [
            {"ingredient_id": ingredients[0]["id"], "percentage": 60},  # Changed from 50
            {"ingredient_id": ingredients[1]["id"], "percentage": 25},  # Changed from 30
            {"ingredient_id": ingredients[3]["id"], "percentage": 15}   # New ingredient
        ]
    }

    response = requests.put(f"{BASE_URL}/formulations/{form_id}", headers=headers(token), json=update_with_version)
    log_test("Update WITH new version (create_new_version=true)", response.status_code == 200)

    # Verify version changed
    response = requests.get(f"{BASE_URL}/formulations/{form_id}", headers=headers(token))
    version_after = response.json().get("current_version", "v1.0")
    log_test("Version incremented to v1.1", version_after == "v1.1")

    # Get version history
    response = requests.get(f"{BASE_URL}/formulations/{form_id}/versions", headers=headers(token))
    log_test("GET /versions returns 200", response.status_code == 200)

    versions = response.json() if response.status_code == 200 else []
    log_test("Has version history", len(versions) > 0)

    # Verify change notes include reasons and diff
    if versions:
        latest_version = versions[0] if versions else {}
        change_notes = latest_version.get("change_notes", "")
        log_test("Change notes include 'Reasons:'", "Reasons:" in change_notes, change_notes[:100])
        log_test("Change notes include 'Changes:'", "Changes:" in change_notes or "→" in change_notes)


def test_percentage_validation(token, ingredients):
    """Test 100% validation"""
    print("\n6. PERCENTAGE VALIDATION TESTS")
    print("=" * 50)

    if len(ingredients) < 2:
        log_test("Skipping - not enough ingredients", False)
        return

    # Try to create with wrong percentage
    invalid_data = {
        "product_name": "Invalid Test",
        "product_type_id": 1,
        "grammage": 100,
        "ingredients": [
            {"ingredient_id": ingredients[0]["id"], "percentage": 60},
            {"ingredient_id": ingredients[1]["id"], "percentage": 30}  # Total = 90%
        ]
    }

    response = requests.post(f"{BASE_URL}/formulations", headers=headers(token), json=invalid_data)
    log_test("Rejects formulation with 90%", response.status_code == 400)

    error_msg = response.json().get("error", "") if response.status_code == 400 else ""
    log_test("Error mentions 100%", "100" in error_msg or "percentage" in error_msg.lower())


def test_bom_generation(token, form_id):
    """Test BOM generation"""
    print("\n7. BOM GENERATION TESTS")
    print("=" * 50)

    if not form_id:
        log_test("Skipping BOM tests - no formulation", False)
        return

    bom_request = {
        "quantity": 100,
        "wastage_percentage": 5
    }

    response = requests.post(f"{BASE_URL}/formulations/{form_id}/bom/generate",
                            headers=headers(token), json=bom_request)
    log_test("POST /bom/generate returns 200", response.status_code == 200)

    bom = response.json() if response.status_code == 200 else {}
    log_test("BOM has total_cost", "total_cost" in bom)
    log_test("BOM has ingredients", "ingredients" in bom)
    log_test("BOM applies wastage", bom.get("wastage_percentage") == 5)


def test_search(token):
    """Test search functionality"""
    print("\n8. SEARCH TESTS")
    print("=" * 50)

    # Search ingredients
    response = requests.get(f"{BASE_URL}/ingredients?search=oil", headers=headers(token))
    log_test("Ingredient search for 'oil'", response.status_code == 200)

    results = response.json() if response.status_code == 200 else []
    log_test("Search returns results", len(results) > 0, f"Found: {len(results)}")

    # Search formulations
    response = requests.get(f"{BASE_URL}/formulations?search=test", headers=headers(token))
    log_test("Formulation search works", response.status_code == 200)


def test_cleanup(token, form_id):
    """Clean up test data"""
    print("\n9. CLEANUP")
    print("=" * 50)

    if form_id:
        response = requests.delete(f"{BASE_URL}/formulations/{form_id}", headers=headers(token))
        log_test("Delete test formulation", response.status_code == 200)


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("SWATI SOAPS FORMULATION SYSTEM - TEST SUITE")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Target: {BASE_URL}")
    print("=" * 60)

    # Run tests
    token = test_authentication()

    if not token:
        print("\n[FATAL] Authentication failed - cannot continue tests")
        sys.exit(1)

    ingredients = test_ingredients(token)
    categories = test_categories(token)
    form_id = test_formulations(token, ingredients)
    test_version_control(token, form_id, ingredients)
    test_percentage_validation(token, ingredients)
    test_bom_generation(token, form_id)
    test_search(token)
    test_cleanup(token, form_id)

    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    total = tests_passed + tests_failed
    print(f"  Total Tests: {total}")
    print(f"  Passed: {tests_passed} ({100*tests_passed//total if total else 0}%)")
    print(f"  Failed: {tests_failed} ({100*tests_failed//total if total else 0}%)")
    print("=" * 60)

    # Exit code
    if tests_failed > 0:
        print(f"\n[WARNING] {tests_failed} test(s) failed!")
        sys.exit(1)
    else:
        print("\n[SUCCESS] All tests passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()
