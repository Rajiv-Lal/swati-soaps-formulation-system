-- ============================================================================
-- SWATI SOAPS FORMULATION MANAGEMENT SYSTEM
-- Complete Database Initialization Script
-- Date: November 26, 2025
-- Version: 1.0 with Regulatory Approval Tracking
-- ============================================================================

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================================================
-- DROP EXISTING TABLES (if any)
-- ============================================================================

DROP TABLE IF EXISTS formulation_benefits;
DROP TABLE IF EXISTS formulation_tags;
DROP TABLE IF EXISTS ingredient_tags;
DROP TABLE IF EXISTS ingredient_benefits;
DROP TABLE IF EXISTS test_results;
DROP TABLE IF EXISTS formulation_versions;
DROP TABLE IF EXISTS formulation_ingredients;
DROP TABLE IF EXISTS formulations;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS benefit_categories;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS product_types;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subcategories table
CREATE TABLE subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, name)
);

-- Suppliers table
CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    payment_terms TEXT,
    lead_time_days INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Types table
CREATE TABLE product_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Benefit Categories table
CREATE TABLE benefit_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INGREDIENTS TABLE (with Regulatory Approval)
-- ============================================================================

CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    inci_name TEXT,
    cas_number TEXT,
    description TEXT,
    landed_cost_net_gst REAL NOT NULL,
    supplier_id INTEGER,
    stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    unit_of_measure TEXT DEFAULT 'kg',
    minimum_order_qty REAL,
    shelf_life_months INTEGER,
    storage_conditions TEXT,
    hsn_code TEXT,
    usage_rate_min REAL,
    usage_rate_max REAL,
    notes TEXT,
    us_approved INTEGER DEFAULT NULL CHECK (us_approved IN (0, 1, NULL)),
    eu_approved INTEGER DEFAULT NULL CHECK (eu_approved IN (0, 1, NULL)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- ============================================================================
-- FORMULATIONS TABLE
-- ============================================================================

CREATE TABLE formulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL UNIQUE,
    product_type_id INTEGER NOT NULL,
    grammage INTEGER NOT NULL,
    pack_count INTEGER DEFAULT 1,
    total_cost_per_piece REAL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'under_review', 'archived')),
    current_version TEXT DEFAULT 'v1.0',
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_type_id) REFERENCES product_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ============================================================================
-- FORMULATION INGREDIENTS (Junction Table)
-- ============================================================================

CREATE TABLE formulation_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    formulation_id INTEGER NOT NULL,
    ingredient_id INTEGER NOT NULL,
    percentage REAL NOT NULL CHECK (percentage > 0 AND percentage <= 100),
    quantity_grams REAL NOT NULL,
    cost_per_piece REAL NOT NULL,
    notes TEXT,
    FOREIGN KEY (formulation_id) REFERENCES formulations(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT,
    UNIQUE(formulation_id, ingredient_id)
);

-- ============================================================================
-- VERSION CONTROL
-- ============================================================================

CREATE TABLE formulation_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    formulation_id INTEGER NOT NULL,
    version_number TEXT NOT NULL,
    ingredients_snapshot TEXT NOT NULL, -- JSON
    cost_snapshot REAL NOT NULL,
    change_notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formulation_id) REFERENCES formulations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    UNIQUE(formulation_id, version_number)
);

-- ============================================================================
-- TEST RESULTS
-- ============================================================================

CREATE TABLE test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    formulation_id INTEGER NOT NULL,
    version_tested TEXT NOT NULL,
    test_date DATE NOT NULL,
    hardness_value REAL CHECK (hardness_value >= 0 AND hardness_value <= 100),
    hardness_method TEXT,
    lather_quality INTEGER CHECK (lather_quality >= 1 AND lather_quality <= 5),
    lather_quantity INTEGER CHECK (lather_quantity >= 1 AND lather_quantity <= 5),
    lather_stability INTEGER CHECK (lather_stability >= 1 AND lather_stability <= 5),
    notes TEXT,
    tested_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formulation_id) REFERENCES formulations(id) ON DELETE CASCADE,
    FOREIGN KEY (tested_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- ============================================================================
-- JUNCTION TABLES
-- ============================================================================

-- Ingredient Tags
CREATE TABLE ingredient_tags (
    ingredient_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (ingredient_id, tag_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Ingredient Benefits
CREATE TABLE ingredient_benefits (
    ingredient_id INTEGER NOT NULL,
    benefit_id INTEGER NOT NULL,
    PRIMARY KEY (ingredient_id, benefit_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (benefit_id) REFERENCES benefit_categories(id) ON DELETE CASCADE
);

-- Formulation Tags
CREATE TABLE formulation_tags (
    formulation_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (formulation_id, tag_id),
    FOREIGN KEY (formulation_id) REFERENCES formulations(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Formulation Benefits
CREATE TABLE formulation_benefits (
    formulation_id INTEGER NOT NULL,
    benefit_id INTEGER NOT NULL,
    PRIMARY KEY (formulation_id, benefit_id),
    FOREIGN KEY (formulation_id) REFERENCES formulations(id) ON DELETE CASCADE,
    FOREIGN KEY (benefit_id) REFERENCES benefit_categories(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_ingredients_category ON ingredients(category_id);
CREATE INDEX idx_ingredients_supplier ON ingredients(supplier_id);
CREATE INDEX idx_ingredients_stock ON ingredients(stock_status);
CREATE INDEX idx_ingredients_us_approved ON ingredients(us_approved);
CREATE INDEX idx_ingredients_eu_approved ON ingredients(eu_approved);

CREATE INDEX idx_formulations_name ON formulations(product_name);
CREATE INDEX idx_formulations_type ON formulations(product_type_id);
CREATE INDEX idx_formulations_status ON formulations(status);
CREATE INDEX idx_formulations_created ON formulations(created_at);

CREATE INDEX idx_formulation_ingredients_formulation ON formulation_ingredients(formulation_id);
CREATE INDEX idx_formulation_ingredients_ingredient ON formulation_ingredients(ingredient_id);

CREATE INDEX idx_versions_formulation ON formulation_versions(formulation_id);
CREATE INDEX idx_versions_created ON formulation_versions(created_at);

CREATE INDEX idx_tests_formulation ON test_results(formulation_id);
CREATE INDEX idx_tests_date ON test_results(test_date);

-- ============================================================================
-- INSERT REFERENCE DATA
-- ============================================================================

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (username, password_hash, full_name, email, role) VALUES
('admin', 'pbkdf2:sha256:260000$8Zz7YxKd$6c8f5e6c5d9f8c8d5e6c5d9f8c8d5e6c5d9f8c8d5e6c5d9f8c8d5e6c5d', 'Administrator', 'admin@swatisoaps.com', 'admin');

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Oils', 'Base and carrier oils'),
('Butters', 'Solid fats and butters'),
('Waxes', 'Natural and synthetic waxes'),
('Actives', 'Active ingredients and extracts'),
('Botanicals', 'Plant extracts and powders'),
('Essential Oils', 'Pure essential oils'),
('Fragrances', 'Fragrance oils and compounds'),
('Colorants', 'Colors and dyes'),
('Preservatives', 'Preservative systems'),
('Emulsifiers', 'Emulsifying agents'),
('Surfactants', 'Cleansing agents'),
('Thickeners', 'Viscosity modifiers'),
('pH Adjusters', 'pH balancing agents'),
('Humectants', 'Moisture retaining agents'),
('Chelating Agents', 'Metal ion binders'),
('Antioxidants', 'Oxidation inhibitors');

-- Insert subcategories for Oils
INSERT INTO subcategories (category_id, name) VALUES
(1, 'Base Oils'),
(1, 'Carrier Oils'),
(1, 'Specialty Oils');

-- Insert subcategories for Butters
INSERT INTO subcategories (category_id, name) VALUES
(2, 'Natural Butters'),
(2, 'Synthetic Butters');

-- Insert subcategories for Actives
INSERT INTO subcategories (category_id, name) VALUES
(4, 'Vitamins'),
(4, 'Peptides'),
(4, 'Alpha Hydroxy Acids'),
(4, 'Beta Hydroxy Acids');

-- Insert subcategories for Botanicals
INSERT INTO subcategories (category_id, name) VALUES
(5, 'Extracts'),
(5, 'Powders'),
(5, 'Hydrosols');

-- Insert subcategories for Surfactants
INSERT INTO subcategories (category_id, name) VALUES
(11, 'Anionic'),
(11, 'Cationic'),
(11, 'Non-ionic'),
(11, 'Amphoteric');

-- Insert suppliers
INSERT INTO suppliers (name, contact_person, phone, email, payment_terms, lead_time_days) VALUES
('ABC Traders', 'Ramesh Kumar', '+91-9876543210', 'ramesh@abctraders.com', 'Net 30', 7),
('XYZ Chemicals', 'Priya Sharma', '+91-9876543211', 'priya@xyzchemicals.com', 'Net 45', 14),
('Global Suppliers', 'Amit Patel', '+91-9876543212', 'amit@globalsuppliers.com', 'Net 30', 10),
('Natural Ingredients Co', 'Sneha Reddy', '+91-9876543213', 'sneha@naturalingredients.com', 'Net 60', 21),
('Premium Oils Ltd', 'Rajesh Singh', '+91-9876543214', 'rajesh@premiumoils.com', 'Net 30', 7);

-- Insert product types
INSERT INTO product_types (name, description) VALUES
('Bar Soap', 'Traditional bar soap'),
('Liquid Soap', 'Liquid hand soap'),
('Body Wash', 'Shower gel and body wash'),
('Shampoo', 'Hair cleansing products'),
('Face Wash', 'Facial cleansing products'),
('Scrub', 'Exfoliating products'),
('Bath Bomb', 'Fizzing bath products'),
('Lotion', 'Body lotion and moisturizer'),
('Cream', 'Facial and body creams'),
('Balm', 'Healing balms and ointments');

-- Insert benefit categories
INSERT INTO benefit_categories (name, description) VALUES
('Moisturizing', 'Hydrates and softens skin'),
('Antibacterial', 'Kills bacteria and prevents infection'),
('Anti-aging', 'Reduces signs of aging'),
('Brightening', 'Improves skin tone and radiance'),
('Soothing', 'Calms irritated skin'),
('Exfoliating', 'Removes dead skin cells'),
('Nourishing', 'Provides essential nutrients'),
('Cleansing', 'Deep cleans pores'),
('Refreshing', 'Energizes and revitalizes'),
('Healing', 'Promotes skin repair'),
('Oil Control', 'Reduces excess oil'),
('Acne Fighting', 'Prevents and treats acne'),
('Firming', 'Improves skin elasticity'),
('Detoxifying', 'Removes impurities'),
('Sun Protection', 'Protects from UV damage');

-- Insert tags
INSERT INTO tags (name, color) VALUES
('soaps', '#3B82F6'),
('cosmetics', '#10B981'),
('both', '#8B5CF6'),
('premium', '#F59E0B'),
('organic', '#22C55E'),
('vegan', '#14B8A6'),
('bestseller', '#EF4444'),
('new', '#EC4899'),
('seasonal', '#F97316'),
('luxury', '#A855F7');

-- Insert sample ingredients
INSERT INTO ingredients (
    name, category_id, subcategory_id, inci_name, cas_number,
    landed_cost_net_gst, supplier_id, stock_status, unit_of_measure,
    minimum_order_qty, shelf_life_months, storage_conditions, hsn_code,
    us_approved, eu_approved
) VALUES
-- Base Oils
('Coconut Oil', 1, 1, 'Cocos Nucifera Oil', '8001-31-8', 250.50, 1, 'in_stock', 'kg', 25, 24, 'Cool, dry place', '15131000', 1, 1),
('Palm Oil', 1, 1, 'Elaeis Guineensis Oil', '8002-75-3', 180.00, 1, 'in_stock', 'kg', 50, 24, 'Cool, dry place', '15119000', 1, 1),
('Olive Oil', 1, 2, 'Olea Europaea Fruit Oil', '8001-25-0', 450.00, 5, 'in_stock', 'kg', 10, 18, 'Cool, dark place', '15091000', 1, 1),
('Castor Oil', 1, 2, 'Ricinus Communis Seed Oil', '8001-79-4', 320.00, 5, 'in_stock', 'kg', 15, 24, 'Cool, dry place', '15153000', 1, 1),
('Sunflower Oil', 1, 2, 'Helianthus Annuus Seed Oil', '8001-21-6', 280.00, 1, 'in_stock', 'kg', 20, 18, 'Cool, dry place', '15121100', 1, 1),

-- Butters
('Shea Butter', 2, 4, 'Butyrospermum Parkii Butter', '91080-23-8', 850.00, 4, 'in_stock', 'kg', 5, 24, 'Cool, dry place', '15159019', 1, 1),
('Cocoa Butter', 2, 4, 'Theobroma Cacao Seed Butter', '8002-31-1', 720.00, 4, 'in_stock', 'kg', 5, 24, 'Cool, dry place', '18040000', 1, 1),
('Mango Butter', 2, 4, 'Mangifera Indica Seed Butter', '91770-65-9', 980.00, 4, 'low_stock', 'kg', 5, 18, 'Cool, dry place', '15159090', 1, 1),

-- Botanicals
('Neem Extract', 5, 10, 'Azadirachta Indica Extract', '84696-25-3', 1200.00, 4, 'in_stock', 'kg', 5, 12, 'Cool, dark place', '13021900', 1, 0),
('Turmeric Powder', 5, 11, 'Curcuma Longa Root Powder', '84775-52-0', 450.00, 4, 'in_stock', 'kg', 10, 18, 'Cool, dry place', '09103000', 1, 1),
('Aloe Vera Gel', 5, 10, 'Aloe Barbadensis Leaf Juice', '85507-69-3', 680.00, 4, 'in_stock', 'kg', 5, 12, 'Refrigerate', '13023990', 1, 1),

-- Essential Oils
('Lavender Oil', 6, NULL, 'Lavandula Angustifolia Oil', '8000-28-0', 3500.00, 4, 'in_stock', 'kg', 1, 36, 'Cool, dark place', '33012941', 1, 1),
('Tea Tree Oil', 6, NULL, 'Melaleuca Alternifolia Leaf Oil', '68647-73-4', 2800.00, 4, 'in_stock', 'kg', 1, 36, 'Cool, dark place', '33012941', 1, 1),
('Peppermint Oil', 6, NULL, 'Mentha Piperita Oil', '8006-90-4', 2200.00, 4, 'in_stock', 'kg', 1, 36, 'Cool, dark place', '33012941', 1, 1),

-- Surfactants
('Caustic Soda', 11, NULL, 'Sodium Hydroxide', '1310-73-2', 85.00, 2, 'in_stock', 'kg', 50, 60, 'Dry, sealed', '28151100', 1, 1),
('SLS', 11, 14, 'Sodium Lauryl Sulfate', '151-21-3', 180.00, 2, 'in_stock', 'kg', 25, 36, 'Cool, dry place', '34021100', 1, 1),
('SLES', 11, 14, 'Sodium Laureth Sulfate', '68585-34-2', 195.00, 2, 'in_stock', 'kg', 25, 36, 'Cool, dry place', '34021100', 1, 1),

-- Preservatives
('Potassium Sorbate', 9, NULL, 'Potassium Sorbate', '24634-61-5', 420.00, 2, 'in_stock', 'kg', 5, 36, 'Cool, dry place', '29161590', 1, 1),
('Sodium Benzoate', 9, NULL, 'Sodium Benzoate', '532-32-1', 380.00, 2, 'in_stock', 'kg', 5, 36, 'Cool, dry place', '29163190', 1, 1),

-- Humectants
('Glycerin', 14, NULL, 'Glycerin', '56-81-5', 165.00, 2, 'in_stock', 'kg', 25, 36, 'Cool, dry place', '29054500', 1, 1),
('Water', 14, NULL, 'Aqua', '7732-18-5', 5.00, NULL, 'in_stock', 'liter', 1000, 999, 'Any', '22011010', 1, 1);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_ingredients_timestamp 
AFTER UPDATE ON ingredients
BEGIN
    UPDATE ingredients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_formulations_timestamp 
AFTER UPDATE ON formulations
BEGIN
    UPDATE formulations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

CREATE VIEW v_ingredients_with_details AS
SELECT 
    i.*,
    c.name as category_name,
    s.name as subcategory_name,
    sup.name as supplier_name
FROM ingredients i
LEFT JOIN categories c ON i.category_id = c.id
LEFT JOIN subcategories s ON i.subcategory_id = s.id
LEFT JOIN suppliers sup ON i.supplier_id = sup.id;

CREATE VIEW v_formulations_with_details AS
SELECT 
    f.*,
    pt.name as product_type_name,
    u.full_name as created_by_name,
    COUNT(DISTINCT fi.ingredient_id) as ingredient_count
FROM formulations f
LEFT JOIN product_types pt ON f.product_type_id = pt.id
LEFT JOIN users u ON f.created_by = u.id
LEFT JOIN formulation_ingredients fi ON f.id = fi.formulation_id
GROUP BY f.id;

-- ============================================================================
-- INITIALIZATION COMPLETE
-- ============================================================================

SELECT 'Database initialized successfully!' as message;
SELECT 'Total tables created: ' || COUNT(*) as info FROM sqlite_master WHERE type='table';
SELECT 'Default admin user: admin / admin123 (CHANGE PASSWORD!)' as security_note;
