-- ============================================================================
-- SWATI SOAPS - USER SETUP SCRIPT
-- Run this on the server: sqlite3 swati_soaps.db < create_users.sql
-- ============================================================================

-- First, check existing users
-- SELECT id, email, full_name, role FROM users;

-- ============================================================================
-- CREATE 5 USERS
-- Note: In production, passwords should be bcrypt hashed
-- For now, using placeholder (login bypasses password check in dev mode)
-- ============================================================================

-- User 1: Admin (if not exists)
INSERT OR IGNORE INTO users (email, password_hash, full_name, role, is_active, created_at)
VALUES ('admin@swatisoaps.com', 'admin123', 'System Administrator', 'admin', 1, datetime('now'));

-- User 2: Production Manager
INSERT OR IGNORE INTO users (email, password_hash, full_name, role, is_active, created_at)
VALUES ('production@swatisoaps.com', 'prod123', 'Production Manager', 'admin', 1, datetime('now'));

-- User 3: Formulator 1
INSERT OR IGNORE INTO users (email, password_hash, full_name, role, is_active, created_at)
VALUES ('formulator1@swatisoaps.com', 'form123', 'Priya Sharma', 'formulator', 1, datetime('now'));

-- User 4: Formulator 2
INSERT OR IGNORE INTO users (email, password_hash, full_name, role, is_active, created_at)
VALUES ('formulator2@swatisoaps.com', 'form123', 'Amit Patel', 'formulator', 1, datetime('now'));

-- User 5: Quality Control
INSERT OR IGNORE INTO users (email, password_hash, full_name, role, is_active, created_at)
VALUES ('qc@swatisoaps.com', 'qc123', 'Quality Control', 'viewer', 1, datetime('now'));

-- Verify users created
SELECT id, email, full_name, role, is_active FROM users ORDER BY id;
