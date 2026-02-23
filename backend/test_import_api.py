#!/usr/bin/env python3
"""
Test the formulation import API endpoint
"""

import os
import sys
import json
import requests
import time
import subprocess
import signal

# Configuration
BASE_URL = "http://localhost:5000"
TEST_EMAIL = "admin@swatisoaps.com"
TEST_PASSWORD = "admin123"

def get_auth_token():
    """Login and get JWT token"""
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }, timeout=5)

        if response.status_code == 200:
            data = response.json()
            return data.get('token')
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        return None


def test_import_api(token):
    """Test the import endpoint"""
    test_file = os.path.join(os.path.dirname(__file__), 'test_formulation_import.xlsx')

    if not os.path.exists(test_file):
        print(f"❌ Test file not found: {test_file}")
        return False

    print(f"\n📤 Uploading: {test_file}")

    headers = {
        "Authorization": f"Bearer {token}"
    }

    with open(test_file, 'rb') as f:
        files = {'file': ('test_formulation_import.xlsx', f, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
        response = requests.post(f"{BASE_URL}/api/formulations/import", headers=headers, files=files, timeout=30)

    print(f"\n📥 Response Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"\n📊 Import Results:")
        print(f"   Message: {data.get('message')}")
        print(f"   Imported: {data.get('imported')}")
        print(f"   Skipped: {data.get('skipped')}")
        print(f"   Sheets Processed: {data.get('sheets_processed')}")
        print(f"   Ingredients Matched: {data.get('ingredients_matched')}")
        print(f"   Ingredients Created: {data.get('ingredients_created')}")

        if data.get('errors'):
            print(f"\n   Errors:")
            for err in data['errors']:
                print(f"      - {err}")

        # Validate expected results
        if data.get('imported') == 2 and data.get('skipped') >= 2:
            print(f"\n✅ API TEST PASSED!")
            return True
        else:
            print(f"\n❌ API TEST FAILED: Unexpected results")
            return False
    else:
        print(f"❌ Import failed: {response.text}")
        return False


def cleanup_test_formulations(token):
    """Delete test formulations created during test"""
    headers = {"Authorization": f"Bearer {token}"}

    # Get formulations
    response = requests.get(f"{BASE_URL}/api/formulations", headers=headers)
    if response.status_code == 200:
        formulations = response.json().get('formulations', [])
        for f in formulations:
            if 'Test' in f.get('product_name', ''):
                # Delete test formulation
                del_response = requests.delete(f"{BASE_URL}/api/formulations/{f['id']}", headers=headers)
                if del_response.status_code == 200:
                    print(f"   🗑️ Deleted: {f['product_name']}")


def main():
    print("="*60)
    print("FORMULATION IMPORT API TEST")
    print("="*60)

    # Check if server is running
    token = get_auth_token()

    if not token:
        print("\n⚠️ Server not running. Starting Flask server...")

        # Start server in background
        env = os.environ.copy()
        env['FLASK_APP'] = 'app.py'
        env['FLASK_ENV'] = 'development'

        server_process = subprocess.Popen(
            ['python3', 'app.py'],
            cwd=os.path.dirname(__file__),
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Wait for server to start
        print("   Waiting for server to start...")
        for i in range(10):
            time.sleep(1)
            token = get_auth_token()
            if token:
                break

        if not token:
            print("❌ Could not start server or login")
            server_process.terminate()
            return False

    print(f"✅ Logged in successfully")

    # Clean up any previous test formulations
    print("\n🧹 Cleaning up previous test formulations...")
    cleanup_test_formulations(token)

    # Run import test
    success = test_import_api(token)

    # Cleanup after test
    print("\n🧹 Cleaning up test formulations...")
    cleanup_test_formulations(token)

    return success


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
