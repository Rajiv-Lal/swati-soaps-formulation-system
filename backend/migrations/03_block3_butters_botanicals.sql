-- ============================================================================
-- BLOCK 3: BUTTERS + BOTANICALS (10 products)
-- ============================================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------------------------
-- Kokum Butter
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Kokum Butter', 'Garcinia Indica Seed Butter', '91744-26-8', 4, 1.0, 100.0, 'Store in cool, dry place. Temperature 15-25°C.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '294-835-6', '84776', 'Mixture of triglycerides', 1, 1, 'Generally safe. Non-comedogenic (0-1/5). Excellent for acne-prone skin.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Hard white to pale yellow solid fat', 'Oil-soluble', 'Very hard butter. Melts at 37-43°C. Non-greasy feel. High in stearic acid. Use 3-15% in lotions.', 188, 45, 143, 0.74, 0.04);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Body butters, lip balms, soap making, hair conditioners, lotion bars', 'Non-greasy moisturizing, regenerates skin cells, healing properties, creates hard bars, non-comedogenic');

-- ---------------------------------------------------------------------------
-- Coffee Extract
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Coffee Extract', 'Coffea Arabica Seed Extract', '84650-00-0', 3, 0.5, 5.0, 'Store in cool, dark place. Temperature 15-25°C. Protect from light.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '283-481-1', '84650', 'Complex plant extract with caffeine', 1, 1, 'Generally safe. May cause sensitivity in caffeine-sensitive individuals. Avoid near eyes.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Brown liquid or powder with coffee aroma', 'Water-soluble or oil-soluble depending on extraction', 'Add to water phase. Rich in caffeine and antioxidants. Use 1-5%. May darken formulation.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Eye creams, anti-cellulite products, energizing body scrubs, tightening serums', 'Reduces puffiness, anti-cellulite, antioxidant-rich, tightens skin, improves microcirculation');

-- ---------------------------------------------------------------------------
-- Pomegranate Extract
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Pomegranate Extract', 'Punica Granatum Fruit Extract', '84961-57-9', 3, 0.5, 5.0, 'Store in cool, dark place. Temperature 15-25°C. Protect from light.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '284-646-0', '84961', 'Complex plant extract with polyphenols', 1, 1, 'Generally safe. Well-tolerated. Rich in antioxidants. Non-irritating.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Reddish-brown liquid or powder', 'Water-soluble', 'Add to water phase. High in ellagic acid and punicalagins. Use 1-5%. May tint formulation pink.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging serums, antioxidant treatments, sun damage repair, brightening products', 'Powerful antioxidant, anti-aging, protects from UV damage, skin regeneration, brightening');

-- ---------------------------------------------------------------------------
-- Grape Seed Extract
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Grape Seed Extract', 'Vitis Vinifera Seed Extract', '84929-27-1', 3, 0.1, 3.0, 'Store in cool, dark place. Temperature 15-25°C. Protect from light.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '284-511-6', '84929', 'Complex plant extract with proanthocyanidins', 1, 1, 'Generally safe. Well-tolerated. Powerful antioxidant. Non-irritating.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Reddish-brown to purple powder or liquid', 'Water-soluble or alcohol-soluble', 'Add to water/alcohol phase. Rich in OPCs (oligomeric proanthocyanidins). Use 0.5-3%.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging creams, antioxidant serums, sun protection, anti-redness treatments', 'Powerful antioxidant, strengthens capillaries, anti-aging, protects collagen, reduces inflammation');

-- ---------------------------------------------------------------------------
-- Cucumber Extract
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Cucumber Extract', 'Cucumis Sativus Fruit Extract', '89998-01-6', 3, 1.0, 10.0, 'Store in cool place. Refrigeration recommended. Temperature 2-8°C.', 12, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '289-738-7', '84012', 'Complex plant extract', 1, 1, 'Generally safe. Very well-tolerated. Suitable for sensitive skin. Non-irritating.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Clear to slightly cloudy liquid with fresh scent', 'Water-soluble', 'Add to water phase. High water content. Soothing properties. Use 3-10%. Requires preservative.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Eye gels, soothing toners, after-sun products, facial mists, sensitive skin care', 'Cooling, soothing, hydrating, reduces puffiness, anti-inflammatory, refreshing');

-- ---------------------------------------------------------------------------
-- Hibiscus Flower Extract
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Hibiscus Flower Extract', 'Hibiscus Sabdariffa Flower Extract', '84775-96-2', 3, 0.5, 5.0, 'Store in cool, dark place. Temperature 15-25°C. Protect from light.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '283-891-0', '84775', 'Complex plant extract with AHAs', 1, 1, 'Generally safe. Contains natural AHAs. May increase sun sensitivity. Use sunscreen.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Deep red to magenta liquid or powder', 'Water-soluble', 'Add to water phase. Natural source of AHAs. May tint formulation pink/red. Use 1-5%.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging products, exfoliating toners, brightening masks, natural color cosmetics', 'Natural exfoliation, anti-aging, brightens skin, tightens pores, rich in antioxidants');

-- ---------------------------------------------------------------------------
-- Rice Extract (Water Soluble)
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Rice Extract (Water Soluble)', 'Oryza Sativa Extract', '90320-46-0', 3, 1.0, 10.0, 'Store in cool, dry place. Temperature 15-25°C.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '291-016-0', '90320', 'Complex plant extract', 1, 1, 'Generally safe. Well-tolerated. Suitable for sensitive skin. Non-irritating.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Light yellow to amber liquid', 'Water-soluble', 'Add to water phase. Rich in vitamins and minerals. Brightening properties. Use 2-10%.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Brightening serums, anti-aging products, soothing lotions, traditional Asian beauty', 'Skin brightening, anti-aging, soothing, antioxidant-rich, improves skin texture');

-- ---------------------------------------------------------------------------
-- Basil Essential Oil
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Basil Essential Oil', 'Ocimum Basilicum Oil', '8015-73-4', 7, 0.1, 1.0, 'Store in cool, dark place in amber glass. Temperature 15-25°C. Keep tightly closed.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '283-900-8', '76074', 'Complex mixture (linalool, eugenol, estragole)', 1, 1, 'Use with caution. May cause skin sensitivity. Avoid during pregnancy. Contains estragole (potential concern). Use <1%.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Clear to pale yellow liquid with herbaceous aroma', 'Oil-soluble. Partially soluble in alcohol.', 'Add at cool-down phase. Antimicrobial properties. Very potent - use sparingly (0.1-0.5%).', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Aromatherapy blends, muscle relief products, clarifying treatments, natural deodorants', 'Antimicrobial, mental clarity, uplifting, muscle relaxation, balances oily skin');

-- ---------------------------------------------------------------------------
-- Beta Cyclodextrin
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Beta Cyclodextrin', 'Cyclodextrin', '7585-39-9', 2, 0.1, 5.0, 'Store in cool, dry place. Temperature 15-25°C. Hygroscopic - keep sealed.', 36, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '231-493-2', '76074', 'C42H70O35', 1, 1, 'Generally safe. Well-tolerated. Used in pharmaceutical formulations. Non-toxic.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White crystalline powder', 'Water-soluble', 'Encapsulation agent. Improves stability of actives. Enhances solubility. Odor absorption. Use 1-5%.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Deodorants, fragrance encapsulation, active delivery systems, odor control', 'Encapsulates actives, enhances stability, controls odor, improves solubility, sustained release');

-- ---------------------------------------------------------------------------
-- BHT (Butylated Hydroxytoluene)
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('BHT (Butylated Hydroxytoluene)', 'BHT', '128-37-0', 2, 0.01, 0.1, 'Store in cool, dry place. Temperature 15-25°C.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '204-881-4', '32849', 'C15H24O', 1, 1, 'Generally safe at cosmetic concentrations. Maximum 0.1%. Some controversy - natural alternatives available.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White crystalline powder', 'Oil-soluble', 'Antioxidant preservative. Add to oil phase. Prevents rancidity. Use 0.01-0.1%. Combine with other antioxidants.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Oil-based products, lipsticks, creams with oils, shelf life extension', 'Prevents oxidation, extends shelf life, protects oils from rancidity, stabilizer');

COMMIT;
