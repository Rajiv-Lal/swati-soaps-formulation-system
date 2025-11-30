-- ============================================================================
-- SWATI SOAPS - SCHEMA MIGRATION - OPTION A (NORMALIZED STRUCTURE)
-- Phase 1: Create Normalized Tables + Clean Slate Categories
-- Date: 2025-11-30
-- Architecture: 4-Table Structure (see DATABASE_ARCHITECTURE_DECISION_LOG.md)
-- ============================================================================

-- ARCHITECTURE DECISION:
-- Instead of 31-column fat table, we use 4 normalized tables:
-- 1. ingredients (18 columns) - core formulation & costing
-- 2. ingredient_regulatory (8 columns) - compliance, export, MSDS
-- 3. ingredient_properties (15+ columns) - technical data, predictive features
-- 4. ingredient_marketing (4 columns) - consumer-facing content

-- SAFETY: This migration will:
-- 1. Create 3 new related tables (regulatory, properties, marketing)
-- 2. Keep main ingredients table lean (18 columns, no additions)
-- 3. Delete all existing categories (17 total)
-- 4. Create 11 new PDF-aligned categories
-- 5. Existing ingredients will have category_id set to NULL temporarily
-- 6. Next migration will re-assign category_id to all ingredients

BEGIN TRANSACTION;

-- ============================================================================
-- STEP 1: CREATE RELATED TABLES (Option A Normalized Structure)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Table: ingredient_regulatory
-- Purpose: Export compliance, regulatory filings, MSDS generation
-- Access Frequency: MEDIUM (periodic compliance checks)
-- ---------------------------------------------------------------------------
CREATE TABLE ingredient_regulatory (
    ingredient_id INTEGER PRIMARY KEY,
    einecs TEXT,                    -- European Inventory of Existing Chemical Substances number
    cosing_ref TEXT,                -- EU Cosmetic Ingredient Database reference number
    chemical_formula TEXT,          -- Molecular formula (e.g., C37H64O6)
    us_approved INTEGER DEFAULT 1,  -- FDA approval status (0=no, 1=yes)
    eu_approved INTEGER DEFAULT 1,  -- EU compliance status (0=no, 1=yes)
    safety_notes TEXT,              -- Safety/toxicity information, handling precautions
    regulatory_description TEXT,    -- Official regulatory body descriptions
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- Table: ingredient_properties
-- Purpose: Technical data for predictive features, formulation optimization
-- Access Frequency: MEDIUM-HIGH (Phase 1 predictive features in first release)
-- ---------------------------------------------------------------------------
CREATE TABLE ingredient_properties (
    ingredient_id INTEGER PRIMARY KEY,
    
    -- Basic Technical Properties (from enrichment)
    appearance TEXT,                -- Physical description (color, form, texture)
    solubility TEXT,                -- Water/oil solubility profile
    formulation_notes TEXT,         -- Usage guidelines, temperature, phase addition
    
    -- Phase 1: Lather & Hardness Prediction (FIRST RELEASE - CRITICAL)
    sap_value REAL,                 -- Saponification value (mg KOH/g oil)
    iodine_value REAL,              -- Iodine value (measure of unsaturation)
    ins_value REAL,                 -- INS value (SAP - Iodine, hardness indicator)
    fatty_acid_profile TEXT,        -- JSON: {lauric: X%, myristic: Y%, palmitic: Z%, ...}
    hardness_coefficient REAL,      -- Contribution to soap bar hardness (0-1 scale)
    lather_coefficient REAL,        -- Contribution to lather quality (0-1 scale)
    
    -- Phase 2: Compatibility Prediction (FUTURE)
    ph_value REAL,                  -- pH value if applicable
    ph_range_min REAL,              -- Minimum safe pH range
    ph_range_max REAL,              -- Maximum safe pH range
    max_temperature REAL,           -- Maximum stable temperature (°C)
    chemical_class TEXT,            -- Surfactant type: anionic, cationic, nonionic, amphoteric
    
    -- Phase 3: MSDS Automation (FUTURE)
    flash_point REAL,               -- Flash point temperature (°C)
    specific_gravity REAL,          -- Specific gravity at 20°C
    vapor_pressure REAL,            -- Vapor pressure (mmHg)
    
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Create index for faster JOINs on predictive queries
CREATE INDEX idx_ingredient_properties_id ON ingredient_properties(ingredient_id);

-- ---------------------------------------------------------------------------
-- Table: ingredient_marketing
-- Purpose: Consumer-facing content, product descriptions, sales materials
-- Access Frequency: LOW (occasional reference for product creation)
-- ---------------------------------------------------------------------------
CREATE TABLE ingredient_marketing (
    ingredient_id INTEGER PRIMARY KEY,
    applications TEXT,              -- Product types/uses (e.g., "facial serums, creams, soaps")
    benefits TEXT,                  -- Consumer benefits (e.g., "moisturizing, anti-aging")
    consumer_description TEXT,      -- Marketing-friendly description for product labels
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Note: Main ingredients table remains unchanged (18 columns)
-- No columns added to avoid bloating core business table

-- ============================================================================
-- STEP 2: BACKUP CURRENT CATEGORY ASSIGNMENTS
-- ============================================================================

-- Create temporary backup of current ingredient-category mappings
CREATE TEMP TABLE ingredient_category_backup AS
SELECT id, name, category_id 
FROM ingredients;

-- ============================================================================
-- STEP 3: SET ALL INGREDIENT CATEGORY_IDs TO NULL (TEMPORARY)
-- ============================================================================

-- Temporarily remove category assignments to allow category deletion
UPDATE ingredients SET category_id = NULL;

-- ============================================================================
-- STEP 4: DELETE ALL EXISTING CATEGORIES (CLEAN SLATE)
-- ============================================================================

-- Remove all 17 existing categories
DELETE FROM categories;

-- Reset the autoincrement counter
DELETE FROM sqlite_sequence WHERE name = 'categories';

-- ============================================================================
-- STEP 5: CREATE 11 PDF-ALIGNED CATEGORIES
-- ============================================================================

-- Insert categories in specific order to match PDF structure
INSERT INTO categories (name, created_at) VALUES 
('Active Ingredients', datetime('now')),           -- ID will be 1
('Additives', datetime('now')),                    -- ID will be 2
('Botanicals & Extracts', datetime('now')),        -- ID will be 3
('Butters', datetime('now')),                      -- ID will be 4
('Carrier/Base Oils', datetime('now')),            -- ID will be 5
('Colorants', datetime('now')),                    -- ID will be 6
('Essential Oils', datetime('now')),               -- ID will be 7
('Fragrances', datetime('now')),                   -- ID will be 8
('Miscellaneous Raw Materials', datetime('now')),  -- ID will be 9
('Soap Bases', datetime('now')),                   -- ID will be 10
('Surfactants', datetime('now'));                  -- ID will be 11

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify new tables were created
.tables

-- Verify ingredient_regulatory table structure
PRAGMA table_info(ingredient_regulatory);

-- Verify ingredient_properties table structure
PRAGMA table_info(ingredient_properties);

-- Verify ingredient_marketing table structure
PRAGMA table_info(ingredient_marketing);

-- Verify new categories were created (should show 11 rows)
SELECT id, name FROM categories ORDER BY id;

-- Verify all ingredients have NULL category_id (should show 21 rows with NULL)
SELECT id, name, category_id FROM ingredients;

-- Show ingredient count (should be 21)
SELECT COUNT(*) as ingredient_count FROM ingredients;

COMMIT;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Next steps:
-- 1. Run 02_update_existing_21_ingredients.sql to re-assign categories and add enrichment
-- 2. Run 03_insert_new_30_ingredients.sql to add 30 new ingredients
-- 3. Run 04_verification.sql to verify everything worked

-- ============================================================================
