-- ============================================================================
-- BLOCK 2: CARRIER/BASE OILS (5 products)
-- ============================================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------------------------
-- Argan Oil
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Argan Oil', 'Argania Spinosa Kernel Oil', '223747-87-3', 5, 1.0, 100.0, 'Store in cool, dark place. Temperature 15-25°C. Protect from light and air.', 12, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '607-015-7', '90990', 'Mixture of triglycerides', 1, 1, 'Generally safe. Non-comedogenic (0/5). Well-tolerated by most skin types.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Golden yellow liquid oil', 'Oil-soluble', 'Rich in oleic and linoleic acids. High vitamin E. Fast-absorbing. Use cold-pressed virgin grade.', 192, 95, 97, 0.59, 0.03);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Luxury facial oils, hair treatments, anti-aging serums, body oils', 'Anti-aging, deeply nourishing, non-greasy absorption, rich in antioxidants, improves elasticity');

-- ---------------------------------------------------------------------------
-- Sea Buckthorn Oil
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Sea Buckthorn Oil', 'Hippophae Rhamnoides Fruit Oil', '90106-68-6', 5, 1.0, 10.0, 'Store in cool, dark place. Refrigeration recommended. Temperature 2-8°C.', 12, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '290-108-7', '76074', 'Mixture of triglycerides and carotenoids', 1, 1, 'Generally safe. May stain skin/fabric orange. Rich in beta-carotene. Patch test recommended.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Deep orange to reddish-orange viscous oil', 'Oil-soluble', 'Very potent - use at 1-5%. Stains easily. High in palmitoleic acid (Omega-7). Mix with carrier oils.', 195, 105, 90, 0.57, 0.02);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Healing balms, anti-aging treatments, wound care, rosacea products', 'Skin regeneration, wound healing, anti-inflammatory, rich in Omega-7, antioxidant-rich');

-- ---------------------------------------------------------------------------
-- Rosehip Oil
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Rosehip Oil', 'Rosa Canina Fruit Oil', '84696-47-9', 5, 1.0, 100.0, 'Store in cool, dark place. Refrigeration recommended. Temperature 2-8°C.', 6, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(
