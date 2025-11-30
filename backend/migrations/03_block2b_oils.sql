-- ============================================================================
-- BLOCK 2B: CARRIER OILS - Part B (2 products)
-- ============================================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------------------------
-- Bakuchi Oil
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Bakuchi Oil', 'Psoralea Corylifolia Seed Oil', '8023-98-1', 5, 0.5, 2.0, 'Store in cool, dark place. Temperature 15-25°C. Light sensitive.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '232-374-2', '90990', 'Mixture of triglycerides with bakuchiol', 1, 1, 'Generally safe. Natural retinol alternative. Less irritating than retinol. Avoid during pregnancy (as precaution).');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Golden yellow to amber liquid oil', 'Oil-soluble', 'Contains bakuchiol (natural retinol alternative). Use 0.5-2%. Add to oil phase. Light-stable unlike retinol.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging serums, retinol alternatives, brightening treatments', 'Natural retinol alternative, anti-aging, reduces wrinkles, brightens skin, gentler than retinol');

-- ---------------------------------------------------------------------------
-- Wheat Germ Oil
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Wheat Germ Oil', 'Triticum Vulgare Germ Oil', '68917-73-7', 5, 1.0, 100.0, 'Store in cool, dark place. Refrigeration recommended. Temperature 2-8°C.', 6, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '272-490-2', '90990', 'Mixture of triglycerides', 1, 1, 'Generally safe. May cause allergic reactions in wheat-sensitive individuals. Short shelf life.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Golden to amber colored viscous oil', 'Oil-soluble', 'Very high vitamin E content. Heavy oil - use at 5-25%. Prone to oxidation. Natural antioxidant.', 185, 125, 60, 0.38, 0.02);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging creams, body oils, hair masks, vitamin E serums', 'Extremely rich in vitamin E, antioxidant, nourishing, anti-aging, improves skin elasticity');

COMMIT;
