# SWATI SOAPS - SERVER COMMAND REFERENCE
**Last Updated:** December 9, 2025  
**Server:** DigitalOcean Ubuntu @ 165.22.222.87  
**User:** swatisoaps  

---

## 🔐 SSH ACCESS

```bash
# Connect to server
ssh swatisoaps@165.22.222.87

# If connection closes immediately, use DigitalOcean Console:
# 1. Go to cloud.digitalocean.com
# 2. Click Droplets → Your droplet
# 3. Click Access → Launch Droplet Console
```

---

## 📁 PROJECT STRUCTURE

```
~/swati-soaps-formulation-system/
├── backend/
│   ├── app.py                    # Flask API (main backend)
│   ├── ingredients_api.py        # Ingredients blueprint
│   ├── swati_soaps.db           # SQLite database
│   ├── venv/                    # Python virtual environment
│   └── requirements.txt         # Python dependencies
├── formulation_app/             # React frontend
│   ├── src/
│   │   ├── pages/              # React pages
│   │   └── components/         # React components
│   ├── package.json
│   └── vite.config.js
├── documentation/               # Project docs
└── session_notes/              # Development notes
```

---

## 1️⃣ NAVIGATION

```bash
# Go to project root
cd ~/swati-soaps-formulation-system

# Go to backend
cd ~/swati-soaps-formulation-system/backend

# Go to frontend
cd ~/swati-soaps-formulation-system/formulation_app

# Check project structure
ls -la ~/swati-soaps-formulation-system/
```

---

## 2️⃣ DATABASE COMMANDS

```bash
# First, navigate to backend
cd ~/swati-soaps-formulation-system/backend
```

### Basic Queries

```bash
# List all tables
sqlite3 swati_soaps.db ".tables"

# Count ingredients
sqlite3 swati_soaps.db "SELECT COUNT(*) FROM ingredients;"

# List all categories
sqlite3 swati_soaps.db "SELECT id, name FROM categories;"

# List all suppliers
sqlite3 swati_soaps.db "SELECT id, name FROM suppliers;"

# Count formulations
sqlite3 swati_soaps.db "SELECT COUNT(*) FROM formulations;"

# Count users
sqlite3 swati_soaps.db "SELECT COUNT(*) FROM users;"
```

### 4-Table Normalized Structure

```bash
# Check ingredient_regulatory table
sqlite3 swati_soaps.db "SELECT COUNT(*) FROM ingredient_regulatory;"

# Check ingredient_properties table
sqlite3 swati_soaps.db "SELECT COUNT(*) FROM ingredient_properties;"

# Check ingredient_marketing table
sqlite3 swati_soaps.db "SELECT COUNT(*) FROM ingredient_marketing;"

# Sample ingredient with all joins
sqlite3 swati_soaps.db "
SELECT i.name, i.inci_name, r.einecs, p.sap_value, m.benefits 
FROM ingredients i 
LEFT JOIN ingredient_regulatory r ON i.id = r.ingredient_id
LEFT JOIN ingredient_properties p ON i.id = p.ingredient_id
LEFT JOIN ingredient_marketing m ON i.id = m.ingredient_id
LIMIT 5;
"
```

### Schema Inspection

```bash
# Show table schema
sqlite3 swati_soaps.db ".schema ingredients"
sqlite3 swati_soaps.db ".schema ingredient_regulatory"
sqlite3 swati_soaps.db ".schema ingredient_properties"
sqlite3 swati_soaps.db ".schema ingredient_marketing"
sqlite3 swati_soaps.db ".schema formulations"
sqlite3 swati_soaps.db ".schema categories"

# Show all columns in a table
sqlite3 swati_soaps.db "PRAGMA table_info(ingredients);"
```

### Data Export

```bash
# Export ingredients to CSV
sqlite3 -header -csv swati_soaps.db "SELECT * FROM ingredients;" > ingredients_export.csv

# Export categories to CSV
sqlite3 -header -csv swati_soaps.db "SELECT * FROM categories;" > categories_export.csv

# Backup entire database
cp swati_soaps.db swati_soaps_backup_$(date +%Y%m%d).db
```

---

## 3️⃣ BACKEND COMMANDS

```bash
# Navigate to backend
cd ~/swati-soaps-formulation-system/backend
```

### Check Status

```bash
# Check if backend is running
ps aux | grep python | grep -v grep

# Check what's using port 5000
sudo lsof -i :5000

# Check backend logs
cat backend.log
tail -f backend.log  # Live log (Ctrl+C to exit)
tail -50 backend.log # Last 50 lines
```

### Start/Stop Backend

```bash
# Kill process on port 5000 (replace <PID> with actual process ID)
sudo kill -9 <PID>

# Kill all python processes (use with caution)
pkill -f "python3 app.py"

# Start backend (keeps running after logout)
nohup python3 app.py > backend.log 2>&1 &

# Start with virtual environment (if needed)
source venv/bin/activate
nohup python3 app.py > backend.log 2>&1 &
```

### Test API

```bash
# Test if API is responding
curl http://localhost:5000/api/categories

# Test with authentication (replace TOKEN with actual JWT)
curl http://localhost:5000/api/ingredients \
  -H "Authorization: Bearer <TOKEN>"

# Test login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@swatisoaps.com","password":"admin123"}'
```

### Install Dependencies

```bash
# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt --break-system-packages

# Deactivate virtual environment
deactivate
```

---

## 4️⃣ FRONTEND COMMANDS

```bash
# Navigate to frontend
cd ~/swati-soaps-formulation-system/formulation_app
```

### Check Status

```bash
# Check if frontend is running
ps aux | grep node | grep -v grep

# Check what's using port 3000
sudo lsof -i :3000

# Check frontend logs
cat frontend.log
tail -f frontend.log  # Live log
```

### Start/Stop Frontend

```bash
# Kill process on port 3000
sudo kill -9 <PID>

# Kill all node processes (use with caution)
pkill -f "node"

# Start frontend dev server (accessible from outside)
nohup npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &

# Start frontend (local only)
nohup npm run dev > frontend.log 2>&1 &
```

### Build & Deploy

```bash
# Install dependencies (first time or after package.json changes)
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 5️⃣ GIT COMMANDS

```bash
# Navigate to project root
cd ~/swati-soaps-formulation-system
```

### Basic Operations

```bash
# Check status
git status

# Check current branch
git branch

# Pull latest changes
git pull origin main

# View recent commits
git log --oneline -10
```

### Committing Changes

```bash
# Stage all changes
git add .

# Stage specific file
git add backend/app.py

# Commit with message
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main
```

### Handling Conflicts

```bash
# If push fails, pull first
git pull origin main

# If there are conflicts, resolve them then:
git add .
git commit -m "Resolved merge conflicts"
git push origin main

# Force push (use with caution - overwrites remote)
git push -f origin main
```

### Undo Changes

```bash
# Discard changes to a file
git checkout -- filename.py

# Discard all local changes
git checkout -- .

# Reset to last commit (keeps changes unstaged)
git reset HEAD~1

# Reset to last commit (discards changes)
git reset --hard HEAD~1
```

---

## 6️⃣ PROCESS MANAGEMENT

### Check Running Services

```bash
# All node and python processes
ps aux | grep -E "(node|python)" | grep -v grep

# Check ports in use
sudo netstat -tlnp | grep -E "(3000|5000)"

# Check all listening ports
sudo netstat -tlnp
```

### System Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check running processes by CPU
top

# Check running processes (snapshot)
htop  # if installed
```

---

## 7️⃣ FILE EDITING (ON SERVER)

### Using nano (easiest)

```bash
# Edit a file
nano filename.py

# Save: Ctrl+O, then Enter
# Exit: Ctrl+X
```

### Using vim

```bash
# Edit a file
vim filename.py

# Press 'i' to enter insert mode
# Press Esc to exit insert mode
# Type ':wq' to save and quit
# Type ':q!' to quit without saving
```

### Quick file operations

```bash
# View file contents
cat filename.py

# View with line numbers
cat -n filename.py

# View first 50 lines
head -50 filename.py

# View last 50 lines
tail -50 filename.py

# Search in file
grep "search_term" filename.py

# Search recursively in folder
grep -r "search_term" ./
```

---

## 8️⃣ QUICK START SEQUENCE

**When you need to get everything running:**

```bash
# 1. Login
ssh swatisoaps@165.22.222.87

# 2. Check what's already running
ps aux | grep -E "(node|python)" | grep -v grep

# 3. Start backend (if not running)
cd ~/swati-soaps-formulation-system/backend
nohup python3 app.py > backend.log 2>&1 &

# 4. Start frontend (if not running)
cd ~/swati-soaps-formulation-system/formulation_app
nohup npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &

# 5. Verify both running
ps aux | grep -E "(node|python)" | grep -v grep

# 6. Check logs for errors
cat ~/swati-soaps-formulation-system/backend/backend.log
cat ~/swati-soaps-formulation-system/formulation_app/frontend.log
```

---

## 9️⃣ TROUBLESHOOTING

### Backend won't start (port in use)

```bash
# Find what's using port 5000
sudo lsof -i :5000

# Kill the process (replace PID)
sudo kill -9 <PID>

# Try starting again
cd ~/swati-soaps-formulation-system/backend
nohup python3 app.py > backend.log 2>&1 &
```

### Frontend won't start (port in use)

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Try starting again
cd ~/swati-soaps-formulation-system/formulation_app
nohup npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &
```

### SSH connection closes immediately

```bash
# Use DigitalOcean Console instead:
# 1. Go to cloud.digitalocean.com
# 2. Click Droplets → Swati-Soaps
# 3. Click Access → Launch Droplet Console
```

### Database locked error

```bash
# Find processes using the database
fuser swati_soaps.db

# Kill if necessary (replace PID)
kill -9 <PID>
```

### Git push permission denied

```bash
# Check if SSH key exists
ls -la ~/.ssh/

# Generate SSH key if needed
ssh-keygen -t ed25519 -C "your_email@example.com"

# Display public key (add to GitHub)
cat ~/.ssh/id_ed25519.pub
```

---

## 🔗 USEFUL LINKS

- **Application:** http://165.22.222.87:3000
- **API:** http://165.22.222.87:5000/api/
- **GitHub:** github.com/Rajiv-Lal/swati-soaps-formulation-system
- **DigitalOcean:** cloud.digitalocean.com

---

## 📝 NOTES

- Backend runs on port **5000**
- Frontend runs on port **3000**
- Database: SQLite at `backend/swati_soaps.db`
- User: `swatisoaps` (not root)
- Always use `nohup` to keep processes running after logout

---

**Document Version:** 1.0  
**Created:** December 9, 2025
