#!/bin/bash
# SWATI SOAPS - DEPLOYMENT SCRIPT v2.3
# Date: February 14, 2026
# Usage: ./deploy.sh

set -e

echo "================================================"
echo "SWATI SOAPS FORMULATION SYSTEM - DEPLOYMENT"
echo "Version: 2.3 (Version Control Enhancements)"
echo "================================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Server details
SERVER="swatisoaps@165.22.222.87"
REMOTE_DIR="~/swati-soaps-formulation-system"

echo ""
echo "Step 1: Verify local changes..."
git status --short

echo ""
echo "Step 2: Commit changes..."
git add -A
git commit -m "$(cat <<'EOF'
v2.3: Version Control Enhancements

Backend:
- Add generate_ingredient_diff() helper for auto-diff generation
- Add build_change_notes() to combine reasons + notes + diff
- Update update_formulation() to use new helpers
- Support change_reasons array in API

Frontend:
- Add change reason checkboxes (Price, Hardness, Perfume, Colour, Lather, Other)
- Update version dialog with new UI
- Include change_reasons in save payload
- Allow save if reasons selected OR notes provided

Testing:
- Add comprehensive test suite (test_all_functionalities.py)
- Tests all CRUD, version control, validation, BOM

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

echo ""
echo "Step 3: Push to GitHub..."
git push origin main

echo ""
echo "Step 4: Deploy to server..."
ssh $SERVER << 'ENDSSH'
cd ~/swati-soaps-formulation-system

echo "Pulling latest changes..."
git pull origin main

echo "Installing backend dependencies..."
cd backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt

echo "Building frontend..."
cd ../formulation_app
npm install --silent
npm run build

echo "Restarting backend..."
sudo systemctl restart swati-backend || pkill -f "python3 app.py" && nohup python3 app.py > /dev/null 2>&1 &

echo "Deployment complete!"
ENDSSH

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}DEPLOYMENT SUCCESSFUL${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Application URL: http://165.22.222.87:3000"
echo "API URL: http://165.22.222.87:5000/api"
echo ""
echo "To run tests on server:"
echo "  ssh $SERVER"
echo "  cd ~/swati-soaps-formulation-system/backend"
echo "  source venv/bin/activate"
echo "  python3 test_all_functionalities.py"
echo ""
