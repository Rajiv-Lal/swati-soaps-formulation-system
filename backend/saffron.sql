BEGIN TRANSACTION;

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, created_at, updated_at) VALUES ('Saffron Extract', 'Crocus Sativus Flower Extract', '84604-17-1', 3, 134178.12, 'in_stock', 'kg', 0.1, 2.0, 'Store in cool, dark place. Temperature 2-8C. Protect from light. Keep container tightly sealed.', 24, datetime('now'), datetime('now'));

INSERT INTO ingredient_regulatory (ingredient_id, einecs, cosing_ref, chemical_formula, us_approved, eu_approved, safety_notes) VALUES ((SELECT id FROM ingredients WHERE name = 'Saffron Extract'), '283-295-0', '55522', 'Natural extract', 1, 1, 'Generally safe. Non-toxic. No skin sensitivity or irritation. Safe for sensitive skin. Vegan and halal.');

INSERT INTO ingredient_properties (ingredient_id, appearance, solubility, formulation_notes, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient) VALUES ((SELECT id FROM ingredients WHERE name = 'Saffron Extract'), 'Pale yellow to golden liquid or powder', 'Water-soluble and oil-soluble forms available', 'Premium ingredient - use sparingly due to high cost. Add to water phase or oil phase depending on extract type. Use 0.1-2%. Potent antioxidant.', NULL, NULL, NULL, 0, 0);

INSERT INTO ingredient_marketing (ingredient_id, applications, benefits) VALUES ((SELECT id FROM ingredients WHERE name = 'Saffron Extract'), 'Luxury soaps, brightening serums, anti-aging creams, premium skincare, Ayurvedic formulations', 'Skin brightening, reduces hyperpigmentation, potent antioxidant, anti-aging, promotes radiant complexion, cell renewal, collagen production, traditional Ayurvedic ingredient');

COMMIT;
