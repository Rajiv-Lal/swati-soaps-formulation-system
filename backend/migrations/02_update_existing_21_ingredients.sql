-- ============================================================================
-- SWATI SOAPS - UPDATE EXISTING 21 INGREDIENTS (OPTION A)
-- Phase 2: Re-assign Categories + Populate Related Tables
-- Date: 2025-11-30
-- ============================================================================

-- This script updates the 21 existing ingredients in the database:
-- 1. Assigns new category_id (matching 11 PDF categories)
-- 2. Populates ingredient_regulatory table
-- 3. Populates ingredient_properties table
-- 4. Populates ingredient_marketing table

-- After schema migration (01_schema_migration.sql), new category IDs are:
-- 1 = Active Ingredients
-- 2 = Additives
-- 3 = Botanicals & Extracts
-- 4 = Butters
-- 5 = Carrier/Base Oils
-- 6 = Colorants
-- 7 = Essential Oils
-- 8 = Fragrances
-- 9 = Miscellaneous Raw Materials
-- 10 = Soap Bases
-- 11 = Surfactants

BEGIN TRANSACTION;

-- ============================================================================
-- CARRIER/BASE OILS (Category ID = 5)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 1: Coconut Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 5,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-30°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 1;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (1, '232-282-8', '32596', 'Mixture of triglycerides', 1, 1, 'Generally safe. Potential comedogenic for some skin types. Patch test recommended.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (1, 'White solid at room temperature, clear liquid above 76°F/24°C', 'Oil-soluble', 'Melts at 76°F/24°C. High in saturated fats. Creates hard bar with fluffy lather.', 257, 10, 247, 1.0, 0.77);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (1, 'Soap making, hair care, body butters, lip balms, massage oils', 'Moisturizing, antimicrobial, creates hard bars, excellent lather, skin barrier support');

-- ---------------------------------------------------------------------------
-- ID 2: Palm Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 5,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 2;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (2, '232-316-1', '75623', 'Mixture of triglycerides', 1, 1, 'Generally safe. Non-irritating. Comedogenic rating 2-4/5. Sustainability concerns - use RSPO certified.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (2, 'Semi-solid orange-yellow to reddish colored fat at room temperature', 'Oil-soluble', 'Rich in palmitic acid. Creates hard, long-lasting soap bars.', 199, 53, 146, 0.75, 0.15);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (2, 'Soap making, body products, sustainable palm applications', 'Creates hard bars, stable lather, long soap life, plant-based alternative');

-- ---------------------------------------------------------------------------
-- ID 3: Olive Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 5,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dark place. Temperature 15-25°C. Protect from light and heat.',
    shelf_life_months = 12,
    updated_at = datetime('now')
WHERE id = 3;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (3, '232-277-0', '75027', 'Mixture of triglycerides', 1, 1, 'Generally safe for all skin types. Low comedogenic rating (2/5). Well-tolerated.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (3, 'Golden yellow to greenish liquid oil', 'Oil-soluble', 'High oleic acid content. Creates mild, conditioning soaps.', 190, 85, 105, 0.62, 0.05);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (3, 'Castile soap, facial products, hair care, massage oils, luxury soaps', 'Deeply moisturizing, rich in antioxidants, gentle on skin, creamy lather');

-- ---------------------------------------------------------------------------
-- ID 4: Castor Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 5,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 4;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (4, '232-293-8', '32603', 'Mixture of triglycerides (90% ricinoleic acid)', 1, 1, 'Generally safe. Can be sticky if used at high percentages. Non-comedogenic.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (4, 'Clear to slightly yellow viscous liquid', 'Oil-soluble. Soluble in alcohol.', 'Very high ricinoleic acid (85-95%). Excellent lather booster. Use 5-10% in soap.', 180, 86, 94, 0.58, 0.72);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (4, 'Soap making (lather booster), hair growth products, lip balms', 'Exceptional lather enhancement, moisturizing, hair growth support, anti-inflammatory');

-- ---------------------------------------------------------------------------
-- ID 5: Sunflower Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 5,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dark place. Temperature 15-25°C. Protect from light.',
    shelf_life_months = 12,
    updated_at = datetime('now')
WHERE id = 5;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (5, '232-273-9', '55454', 'Mixture of triglycerides', 1, 1, 'Generally safe. Low comedogenic rating (0-2/5). Well-tolerated by most skin types.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (5, 'Light yellow to golden colored liquid oil', 'Oil-soluble', 'High linoleic acid. Light, non-greasy. Prone to oxidation.', 192, 125, 67, 0.40, 0.02);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (5, 'Soap making, body lotions, facial serums, massage oils, hair care', 'Lightweight moisturizing, rich in vitamin E, skin barrier support, non-greasy');

-- ============================================================================
-- BUTTERS (Category ID = 4)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 6: Shea Butter
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 4,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 6;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (6, '194-043-4', '32669', 'Mixture of triglycerides and fatty acids', 1, 1, 'Generally safe. Very low comedogenic rating (0-2/5). Excellent for sensitive skin.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (6, 'Ivory to light yellow colored fat, soft solid at room temperature', 'Oil-soluble', 'Melts at body temperature. Excellent skin conditioning. Use up to 15% in soap.', 180, 59, 121, 0.67, 0.08);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (6, 'Body butters, lotions, soap making, lip balms, hair treatments', 'Deep moisturizing, anti-inflammatory, skin healing, UV protection, rich in vitamins A and E');

-- ---------------------------------------------------------------------------
-- ID 7: Cocoa Butter
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 4,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 7;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (7, '232-303-0', '84649', 'Mixture of triglycerides', 1, 1, 'Generally safe. Comedogenic rating 4/5 - may clog pores for acne-prone skin.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (7, 'Pale yellow solid fat with chocolate aroma', 'Oil-soluble', 'Melts at 34-38°C. Creates very hard, stable bars. Chocolate scent.', 193, 37, 156, 0.78, 0.05);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (7, 'Body lotions, lip balms, soap making, stretch mark creams, chocolate-scented products', 'Deep moisturizing, creates hard bars, antioxidants, improves skin elasticity');

-- ---------------------------------------------------------------------------
-- ID 8: Mango Butter
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 4,
    usage_rate_min = 1.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 8;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (8, '291-046-4', '90063', 'Mixture of triglycerides', 1, 1, 'Generally safe. Low comedogenic rating (2/5). Well-tolerated.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (8, 'Creamy white to pale yellow soft solid', 'Oil-soluble', 'Similar to shea butter but lighter. Melts easily. Non-greasy feel.', 185, 60, 125, 0.68, 0.07);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (8, 'Body butters, lotions, soap making, hair care, lip products', 'Moisturizing, lightweight feel, rich in vitamins A and C, skin regeneration');

-- ============================================================================
-- BOTANICALS & EXTRACTS (Category ID = 3)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 9: Neem Extract
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 3,
    usage_rate_min = 0.5,
    usage_rate_max = 10.0,
    storage_conditions = 'Store in cool, dry place away from light. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 9;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (9, '283-644-7', '84696', 'Complex plant extract', 1, 1, 'Generally safe. Strong odor. May cause sensitivity in some individuals. Patch test recommended.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (9, 'Golden yellow to greenish brown liquid or powder', 'Water or oil soluble depending on extraction', 'Add to cool-down phase. Strong natural scent. Antimicrobial properties.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (9, 'Acne treatments, anti-dandruff products, natural pest repellents, traditional skincare', 'Antimicrobial, anti-inflammatory, treats acne, soothes skin irritation, natural healing');

-- ---------------------------------------------------------------------------
-- ID 10: Turmeric Powder
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 3,
    usage_rate_min = 0.5,
    usage_rate_max = 5.0,
    storage_conditions = 'Store in cool, dry place protected from light. Temperature 15-25°C.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 10;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (10, '283-882-1', '84775', 'C21H20O6 (curcumin)', 1, 1, 'Generally safe. May stain skin temporarily (yellow color). Can cause sensitivity in high concentrations.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (10, 'Bright yellow-orange fine powder', 'Poorly water-soluble, disperses better in oils', 'Stains easily. Use at low percentages (0.5-2%). Add to oil phase or disperse in water.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (10, 'Skin brightening products, anti-inflammatory treatments, natural colorant, traditional remedies', 'Anti-inflammatory, antioxidant, skin brightening, antibacterial, wound healing');

-- ---------------------------------------------------------------------------
-- ID 11: Aloe Vera Gel
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 3,
    usage_rate_min = 0.5,
    usage_rate_max = 100.0,
    storage_conditions = 'Refrigerate after opening. Temperature 2-8°C. Shelf life reduced once opened.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 11;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (11, '287-390-8', '85507', 'Complex polysaccharides and glycoproteins', 1, 1, 'Generally safe. Very well-tolerated. Rare allergic reactions possible.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (11, 'Clear to slightly cloudy viscous gel', 'Water-soluble', 'Add to water phase. Requires preservative. Can replace part of water in formulations.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (11, 'After-sun products, soothing gels, facial serums, burn treatments, hydrating lotions', 'Deeply hydrating, soothing, anti-inflammatory, wound healing, cooling effect');

-- ============================================================================
-- ESSENTIAL OILS (Category ID = 7)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 12: Lavender Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 7,
    usage_rate_min = 0.5,
    usage_rate_max = 3.0,
    storage_conditions = 'Store in cool, dark place in amber glass. Temperature 15-25°C. Keep tightly closed.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 12;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (12, '289-995-2', '90063', 'Complex mixture (linalool, linalyl acetate)', 1, 1, 'Generally safe. May cause sensitivity. Contains allergens (linalool). Avoid during pregnancy (first trimester).');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (12, 'Clear to pale yellow liquid with characteristic floral aroma', 'Oil-soluble. Partially soluble in alcohol.', 'Add at cool-down phase (below 40°C) to preserve aroma. Volatile - use proper storage.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (12, 'Aromatherapy products, relaxation blends, sleep aids, soap fragrance, skin care', 'Calming, stress relief, promotes sleep, antiseptic, anti-inflammatory, balances skin');

-- ---------------------------------------------------------------------------
-- ID 13: Tea Tree Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 7,
    usage_rate_min = 0.5,
    usage_rate_max = 5.0,
    storage_conditions = 'Store in cool, dark place in amber glass. Temperature 15-25°C. Keep tightly closed.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 13;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (13, '285-377-1', '90063', 'Complex mixture (terpinen-4-ol, γ-terpinene)', 1, 1, 'Generally safe. May cause sensitivity in some individuals. Do not ingest. Toxic to pets.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (13, 'Clear to pale yellow liquid with medicinal, camphoraceous aroma', 'Oil-soluble. Slightly soluble in water.', 'Add at cool-down phase. Powerful antimicrobial. Use 1-5% for therapeutic benefits.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (13, 'Acne treatments, anti-dandruff shampoos, antiseptic products, natural deodorants', 'Antimicrobial, antifungal, treats acne, soothes skin irritation, natural disinfectant');

-- ---------------------------------------------------------------------------
-- ID 14: Peppermint Oil
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 7,
    usage_rate_min = 0.1,
    usage_rate_max = 2.0,
    storage_conditions = 'Store in cool, dark place in amber glass. Temperature 15-25°C. Keep tightly closed.',
    shelf_life_months = 24,
    updated_at = datetime('now')
WHERE id = 14;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (14, '282-015-4', '84082', 'Complex mixture (menthol, menthone)', 1, 1, 'Use with caution. Very strong. May irritate sensitive skin. Avoid near eyes. Not for infants/young children.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (14, 'Clear to pale yellow liquid with strong minty aroma', 'Oil-soluble. Partially soluble in alcohol.', 'Add at cool-down phase. Very potent - use sparingly (0.1-1%). Cooling sensation.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (14, 'Cooling balms, foot care, headache relief, digestive wellness, energizing products', 'Cooling sensation, relieves headaches, improves focus, soothes muscle pain, antimicrobial');

-- ============================================================================
-- ADDITIVES (Category ID = 2)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 15: Caustic Soda (Sodium Hydroxide)
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 2,
    usage_rate_min = 1.0,
    usage_rate_max = 20.0,
    storage_conditions = 'Store in airtight container in cool, dry place. Keep away from moisture and acids. Temperature 15-25°C.',
    shelf_life_months = 60,
    updated_at = datetime('now')
WHERE id = 15;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (15, '215-185-5', '75028', 'NaOH', 1, 1, 'HAZARDOUS. Highly corrosive. Causes severe burns. Use protective equipment. Keep away from children. Neutralizes in saponification.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (15, 'White crystalline solid, pellets or flakes', 'Highly soluble in water (exothermic reaction)', 'CRITICAL: Always add lye to water, NEVER water to lye. Essential for cold/hot process soap making.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (15, 'Soap making (saponification agent), pH adjustment, drain cleaners', 'Essential for traditional soap making, converts oils to soap through saponification');

-- ---------------------------------------------------------------------------
-- ID 20: Glycerin
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 2,
    usage_rate_min = 1.0,
    usage_rate_max = 10.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C. Hygroscopic - keep tightly sealed.',
    shelf_life_months = 36,
    updated_at = datetime('now')
WHERE id = 20;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (20, '200-289-5', '32596', 'C3H8O3', 1, 1, 'Generally safe. Very well-tolerated. May feel sticky at high concentrations. Non-toxic.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (20, 'Clear, colorless, viscous liquid', 'Miscible with water and alcohol. Insoluble in oils.', 'Add to water phase. Natural byproduct of soap making. Excellent humectant. Use 1-10%.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (20, 'Moisturizers, lotions, soap making, hair care, toothpaste', 'Humectant, draws moisture to skin, non-irritating, improves texture, prevents dryness');

-- ============================================================================
-- PRESERVATIVES (Category ID = 2 - Additives)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 18: Potassium Sorbate
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 2,
    usage_rate_min = 0.1,
    usage_rate_max = 0.6,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C. Keep away from moisture.',
    shelf_life_months = 36,
    updated_at = datetime('now')
WHERE id = 18;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (18, '246-376-1', '56490', 'C6H7KO2', 1, 1, 'Generally safe. Well-tolerated. FDA approved. Maximum usage 0.6% in cosmetics.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (18, 'White crystalline powder', 'Soluble in water', 'Add to water phase when cool (<40°C). Works best at pH <6. Often paired with sodium benzoate.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (18, 'Water-based cosmetics, lotions, creams, shampoos, natural preservative systems', 'Prevents mold and yeast growth, extends product shelf life, food-grade safety');

-- ---------------------------------------------------------------------------
-- ID 19: Sodium Benzoate
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 2,
    usage_rate_min = 0.1,
    usage_rate_max = 0.5,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C. Keep away from moisture.',
    shelf_life_months = 36,
    updated_at = datetime('now')
WHERE id = 19;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (19, '208-534-8', '76443', 'C7H5NaO2', 1, 1, 'Generally safe. Well-tolerated. FDA approved. Maximum usage 0.5% in cosmetics. Avoid mixing with vitamin C in acidic formulas.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (19, 'White crystalline powder', 'Soluble in water', 'Add to water phase when cool (<40°C). Works best at pH <4. Often paired with potassium sorbate.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (19, 'Water-based cosmetics, acidic formulations, natural preservative systems', 'Antibacterial, prevents spoilage, extends shelf life, cost-effective preservation');

-- ============================================================================
-- SURFACTANTS (Category ID = 11)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 16: SLS (Sodium Lauryl Sulfate)
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 11,
    usage_rate_min = 1.0,
    usage_rate_max = 40.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 36,
    updated_at = datetime('now')
WHERE id = 16;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (16, '205-788-1', '76443', 'C12H25NaO4S', 1, 1, 'Can be irritating to skin/eyes at high concentrations. Safe at cosmetic use levels. May cause dryness.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (16, 'White to cream colored powder or paste', 'Water-soluble. Creates foam easily.', 'Anionic surfactant. Excellent cleansing and foaming. Use 8-15% in shampoos, 1-5% in cleansers.', NULL, NULL, NULL, 0, 0.85);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (16, 'Shampoos, body washes, toothpaste, cleansers, bubble bath', 'Excellent foaming, strong cleansing, cost-effective, versatile surfactant');

-- ---------------------------------------------------------------------------
-- ID 17: SLES (Sodium Laureth Sulfate)
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 11,
    usage_rate_min = 1.0,
    usage_rate_max = 40.0,
    storage_conditions = 'Store in cool, dry place. Temperature 15-25°C.',
    shelf_life_months = 36,
    updated_at = datetime('now')
WHERE id = 17;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (17, '500-234-8', '76443', 'C12H25Na(O-CH2-CH2)nO4S', 1, 1, 'Milder than SLS. Generally safe. Better tolerated by sensitive skin. May contain traces of 1,4-dioxane.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (17, 'Clear to pale yellow viscous liquid', 'Water-soluble. Creates abundant foam.', 'Anionic surfactant. Gentler than SLS. Use 10-20% in shampoos, 3-8% in body wash.', NULL, NULL, NULL, 0, 0.80);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (17, 'Shampoos, body washes, facial cleansers, gentle formulations', 'Milder than SLS, excellent foaming, good cleansing, suitable for sensitive skin');

-- ============================================================================
-- MISCELLANEOUS RAW MATERIALS (Category ID = 9)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- ID 21: Water
-- ---------------------------------------------------------------------------
UPDATE ingredients SET
    category_id = 9,
    usage_rate_min = 0.0,
    usage_rate_max = 100.0,
    storage_conditions = 'Store in clean container. Use distilled or deionized water for cosmetics.',
    shelf_life_months = 12,
    updated_at = datetime('now')
WHERE id = 21;

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (21, '231-791-2', 'AQUA', 'H2O', 1, 1, 'Generally safe. Use purified/distilled water for cosmetics. Tap water may contain minerals/contaminants.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (21, 'Clear, colorless, odorless liquid', 'Universal solvent', 'Use distilled or deionized water. Heat to dissolve water-soluble ingredients. Requires preservative.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (21, 'Universal solvent for all water-based cosmetics, lotions, creams, serums', 'Hydration, solvent for actives, base for formulations, essential for life');

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all ingredients now have category_id assigned
SELECT 
    i.id, 
    i.name, 
    i.category_id, 
    c.name as category_name,
    i.inci_name,
    i.cas_number,
    i.usage_rate_min,
    i.usage_rate_max
FROM ingredients i
JOIN categories c ON i.category_id = c.id
ORDER BY i.category_id, i.name;

-- Count by category
SELECT 
    c.name as category,
    COUNT(i.id) as ingredient_count
FROM categories c
LEFT JOIN ingredients i ON c.id = i.category_id
GROUP BY c.id
ORDER BY c.id;

-- Verify related tables populated
SELECT COUNT(*) as regulatory_count FROM ingredient_regulatory;
SELECT COUNT(*) as properties_count FROM ingredient_properties;
SELECT COUNT(*) as marketing_count FROM ingredient_marketing;

-- Check for any NULL category_id (should be 0)
SELECT COUNT(*) as null_category_count FROM ingredients WHERE category_id IS NULL;

-- ============================================================================
-- MIGRATION COMPLETE - EXISTING 21 INGREDIENTS UPDATED
-- ============================================================================

-- Next steps:
-- 1. Run 03_insert_new_29_ingredients.sql to add 29 new ingredients (30 minus Mango Butter duplicate)
-- 2. Run 04_populate_predictive_data.sql to add SAP/iodine values for oils/fats
-- 3. Run 05_verification.sql for final verification

-- ============================================================================
