-- ============================================================================
-- BLOCK 1: ACTIVE INGREDIENTS (5 products)
-- ============================================================================

BEGIN TRANSACTION;

-- ---------------------------------------------------------------------------
-- Hyaluronic Acid (5M Hyaskin)
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Hyaluronic Acid (5M Hyaskin)', 'Sodium Hyaluronate', '9067-32-7', 1, 0.1, 2.0, 'Store in cool, dry place. Temperature 2-8°C. Refrigeration recommended after opening.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '618-620-0', '76074', 'Polysaccharide', 1, 1, 'Generally safe. Well-tolerated. Non-irritating. Suitable for sensitive skin.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'Clear to slightly hazy viscous liquid', 'Water-soluble', 'Add to water phase. Use at cool-down (<40°C). Highly hygroscopic. Molecular weight affects viscosity.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging serums, hydrating masks, eye creams, moisturizers', 'Deep hydration, plumps skin, reduces fine lines, moisture retention, improves skin elasticity');

-- ---------------------------------------------------------------------------
-- Kojic Acid
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Kojic Acid', 'Kojic Acid', '501-30-4', 1, 0.5, 2.0, 'Store in cool, dry, dark place. Temperature 15-25°C. Light sensitive - use opaque packaging.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '207-922-4', '76074', 'C6H6O4', 1, 1, 'Generally safe at cosmetic concentrations. May cause sensitivity. Avoid during pregnancy. Maximum 1-2% recommended.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White to light beige crystalline powder', 'Water-soluble', 'Add to water phase when cool. Light and air sensitive. Combine with antioxidants. pH 4-6 optimal.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Skin brightening products, anti-pigmentation treatments, dark spot correctors', 'Lightens hyperpigmentation, inhibits melanin production, evens skin tone, brightens complexion');

-- ---------------------------------------------------------------------------
-- Salicylic Acid
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Salicylic Acid', 'Salicylic Acid', '69-72-7', 1, 0.5, 2.0, 'Store in cool, dry place. Temperature 15-25°C. Keep container tightly closed.', 36, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '200-712-3', '76074', 'C7H6O3', 1, 1, 'Safe at 0.5-2%. May cause dryness/irritation. Not for children under 3. Avoid during pregnancy. FDA OTC monograph ingredient.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White crystalline powder', 'Slightly water-soluble, alcohol-soluble', 'Dissolve in alcohol or propylene glycol first. pH 3-4 optimal. Add at cool-down phase. BHA (beta hydroxy acid).', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Acne treatments, exfoliating toners, anti-dandruff shampoos, pore minimizers', 'Exfoliates skin, unclogs pores, treats acne, reduces blackheads, anti-inflammatory');

-- ---------------------------------------------------------------------------
-- Zinc Oxide
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Zinc Oxide', 'Zinc Oxide', '1314-13-2', 1, 1.0, 25.0, 'Store in cool, dry place. Temperature 15-25°C. Keep away from moisture.', 60, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), '215-222-5', '98230', 'ZnO', 1, 1, 'Generally safe. FDA approved sunscreen active. Non-nano preferred for transparency. May leave white cast.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White fine powder', 'Insoluble in water', 'Disperse in oil phase or use as powder. Physical UV filter. Non-nano particles recommended. Use 15-25% for SPF protection.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Sunscreens, diaper rash creams, calming lotions, mineral makeup', 'Broad-spectrum UV protection, soothing, anti-inflammatory, wound healing, antibacterial');

-- ---------------------------------------------------------------------------
-- Ceramide Complex (Oli-8106)
-- ---------------------------------------------------------------------------
INSERT INTO ingredients (name, inci_name, cas_number, category_id, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, landed_cost_net_gst, created_at, updated_at)
VALUES ('Ceramide Complex (Oli-8106)', 'Ceramide NP', '100403-19-8', 1, 0.1, 3.0, 'Store in cool, dry place. Temperature 15-25°C. Sensitive to heat and oxidation.', 24, 0.00, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes)
VALUES (last_insert_rowid(), NULL, '90650', 'Complex lipid structure', 1, 1, 'Generally safe. Biomimetic to skin lipids. Well-tolerated. Non-irritating.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient)
VALUES (last_insert_rowid(), 'White to off-white waxy solid or powder', 'Oil-soluble', 'Add to oil phase. Melts at 85-95°C. Requires emulsification system. Use 0.5-3% concentration.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits)
VALUES (last_insert_rowid(), 'Anti-aging creams, barrier repair lotions, eczema treatments, sensitive skin care', 'Strengthens skin barrier, moisture retention, reduces TEWL, repairs damaged skin, anti-aging');

COMMIT;
