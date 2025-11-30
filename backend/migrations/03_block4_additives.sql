-- ============================================================================
-- BLOCK 4: REMAINING ADDITIVES (6 products)
-- ============================================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------------------------
-- Stearic Acid
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Stearic Acid', 'Stearic Acid', '57-11-4', 2, 1.0, 25.0, 'Store in cool, dry place. Temperature 15-25°C.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '200-313-4', '80386', 'C18H36O2', 1, 1, 'Generally safe. Well-tolerated. Fatty acid derived from plant or animal sources. Prefer vegetable-derived.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White waxy flakes or pellets', 'Oil-soluble', 'Emulsifier and thickener. Melts at 69-70°C. Use 2-15% in lotions. Creates pearlescent effect. Pairs with NaOH for soap.', 209, 1, 208, 0.93, 0.01);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Lotions, creams, soap making, body butters, emulsified products', 'Emulsification, thickening, creates hard bars, pearlescent effect, stabilizes formulations');

-- ---------------------------------------------------------------------------
-- Cetyl Alcohol
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Cetyl Alcohol', 'Cetyl Alcohol', '36653-82-4', 2, 0.5, 6.0, 'Store in cool, dry place. Temperature 15-25°C.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '253-149-0', '32718', 'C16H34O', 1, 1, 'Generally safe. Non-irritating. Fatty alcohol - NOT drying like ethanol. Well-tolerated.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White waxy solid flakes or pellets', 'Oil-soluble', 'Co-emulsifier and thickener. Melts at 49-52°C. Use 1-6% in lotions. Creates creamy texture.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Lotions, conditioners, creams, body butters, emulsions', 'Thickening, emulsion stability, conditioning, non-greasy feel, improves texture');

-- ---------------------------------------------------------------------------
-- Sodium Bicarbonate
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Sodium Bicarbonate', 'Sodium Bicarbonate', '144-55-8', 2, 0.5, 100.0, 'Store in cool, dry place. Temperature 15-25°C. Keep away from moisture.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '205-633-8', '76074', 'NaHCO3', 1, 1, 'Generally safe. Food-grade quality. May be drying at high concentrations. Alkaline pH ~8.3.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White fine crystalline powder', 'Water-soluble', 'pH adjuster and effervescent agent. Use in bath bombs (50%). Odor neutralizer. Buffering agent.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Bath bombs, deodorants, toothpaste, fizzing products, pH adjustment', 'pH adjustment, odor neutralization, effervescent effect, gentle exfoliation, soothing');

-- ---------------------------------------------------------------------------
-- Sodium Lactate
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Sodium Lactate', 'Sodium Lactate', '72-17-3', 2, 1.0, 3.0, 'Store in cool, dry place. Temperature 15-25°C. Hygroscopic.', 36, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '200-772-0', '32652', 'C3H5NaO3', 1, 1, 'Generally safe. Natural moisturizing factor (NMF). Well-tolerated. Non-irritating.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Clear colorless liquid (60% solution)', 'Water-soluble', 'Humectant. Add to water phase. Hardens soap bars. Natural component of skin. Use 1-3%.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Moisturizers, soap making (hardening), hydrating serums, natural humectant systems', 'Humectant, hardens soap bars, moisturizing, improves skin barrier, natural NMF component');

-- ---------------------------------------------------------------------------
-- Climbazole
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Climbazole', 'Climbazole', '38083-17-9', 2, 0.2, 0.5, 'Store in cool, dry place. Temperature 15-25°C.', 36, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '253-775-4', '32652', 'C15H17ClN2O2', 1, 1, 'Safe at regulated concentrations. Maximum 0.5% in cosmetics. Antifungal agent. Avoid in leave-on facial products.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White to off-white crystalline powder', 'Oil-soluble, poorly water-soluble', 'Antifungal preservative. Add to oil phase or dissolve in solubilizer. Use 0.2-0.5% in shampoos.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-dandruff shampoos, scalp treatments, antifungal products', 'Controls dandruff, antifungal, treats seborrheic dermatitis, prevents scalp irritation');

-- ---------------------------------------------------------------------------
-- Lauric Acid
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Lauric Acid', 'Lauric Acid', '143-07-7', 2, 1.0, 30.0, 'Store in cool, dry place. Temperature 15-25°C.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '205-582-1', '76074', 'C12H24O2', 1, 1, 'Generally safe. Well-tolerated. Fatty acid from coconut/palm kernel oil. Antimicrobial properties.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White waxy solid with slight fatty odor', 'Oil-soluble', 'Surfactant precursor. Creates excellent lather. Melts at 44°C. Use 5-30% in soap. Antimicrobial.', 268, 1, 267, 0.95, 0.90);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Soap making, surfactant production, antimicrobial products, cleansing bars', 'Excellent lather, antimicrobial, creates hard bars, cleansing, coconut-derived');

COMMIT;
