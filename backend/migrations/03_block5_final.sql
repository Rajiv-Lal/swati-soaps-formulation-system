-- ============================================================================
-- BLOCK 5: COLORANTS + MISCELLANEOUS (Final 3 products)
-- ============================================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------------------------
-- Mica Powder
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Mica Powder', 'Mica', '12001-26-2', 6, 0.1, 5.0, 'Store in cool, dry place. Temperature 15-25°C. Keep sealed.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '310-127-6', '77019', 'KAl2(AlSi3O10)(OH)2', 1, 1, 'Generally safe. Natural mineral. May contain traces of heavy metals - use cosmetic grade only.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Fine powder with pearlescent shimmer (various colors)', 'Insoluble in water and oils', 'Pearlescent colorant. Disperse thoroughly. Use 0.5-5%. Available in many colors. Add to any phase.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Mineral makeup, soap colorant, shimmer lotions, highlighting products, bath bombs', 'Pearlescent effect, natural mineral color, shimmer/sparkle, wide color range, light-reflecting');

-- ---------------------------------------------------------------------------
-- Charcoal Powder (Activated)
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Charcoal Powder (Activated)', 'Charcoal Powder', '16291-96-6', 6, 0.5, 5.0, 'Store in cool, dry place. Temperature 15-25°C. Keep sealed - very fine powder.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '240-383-3', '77266', 'C (activated carbon)', 1, 1, 'Generally safe. Use cosmetic/food grade only. Can be messy. May stain. Very absorbent.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Fine black powder, odorless', 'Insoluble in water', 'Colors black. Highly absorbent. Use 0.5-3% in soaps/masks. Wear mask when handling (fine particles).', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Detox masks, pore-cleansing products, black soaps, charcoal scrubs, purifying treatments', 'Detoxifying, absorbs impurities, deep pore cleansing, natural black colorant, removes toxins');

-- ---------------------------------------------------------------------------
-- Camel Milk Powder
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Camel Milk Powder', 'Camel Milk Powder', 'N/A', 9, 1.0, 10.0, 'Store in cool, dry place. Temperature 15-25°C. Keep sealed. Refrigeration extends shelf life.', 12, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), NULL, NULL, 'Complex mixture (proteins, fats, lactose)', 1, 1, 'Generally safe. May cause allergic reactions in dairy-sensitive individuals. Requires preservative in formulations.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Cream to light beige fine powder', 'Water-dispersible', 'Rich in proteins and vitamins. Add to water phase. Use 3-10% in soap. Requires preservative. Nourishing additive.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Luxury soaps, milk baths, nourishing lotions, traditional remedies', 'Nourishing, rich in vitamins, moisturizing, gentle cleansing, luxury ingredient, skin softening');

COMMIT;
