BEGIN TRANSACTION;

-- Frag.AL16456-SHK
INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, created_at, updated_at) VALUES ('Fragrance AL16456-SHK', 'Parfum', NULL, 8, 928.30, 'in_stock', 'kg', 0.5, 3.0, 'Store in cool, dark place. Temperature 15-25C. Keep tightly sealed.', 24, datetime('now'), datetime('now'));
INSERT INTO ingredient_marketing (ingredient_id, applications, benefits) VALUES ((SELECT id FROM ingredients WHERE name = 'Fragrance AL16456-SHK'), 'Soaps, cosmetics, personal care products', 'Proprietary fragrance blend from Quintessence');

-- Frag. C1824
INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, created_at, updated_at) VALUES ('Fragrance C1824', 'Parfum', NULL, 8, 1129.80, 'in_stock', 'kg', 0.5, 3.0, 'Store in cool, dark place. Temperature 15-25C. Keep tightly sealed.', 24, datetime('now'), datetime('now'));
INSERT INTO ingredient_marketing (ingredient_id, applications, benefits) VALUES ((SELECT id FROM ingredients WHERE name = 'Fragrance C1824'), 'Soaps, cosmetics, personal care products', 'Proprietary fragrance blend from Quintessence');

-- Fragrance B0525
INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, created_at, updated_at) VALUES ('Fragrance B0525', 'Parfum', NULL, 8, 1069.21, 'in_stock', 'kg', 0.5, 3.0, 'Store in cool, dark place. Temperature 15-25C. Keep tightly sealed.', 24, datetime('now'), datetime('now'));
INSERT INTO ingredient_marketing (ingredient_id, applications, benefits) VALUES ((SELECT id FROM ingredients WHERE name = 'Fragrance B0525'), 'Soaps, cosmetics, personal care products', 'Proprietary fragrance blend from Quintessence');

-- Sandelia K
INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, usage_rate_min, usage_rate_max, storage_conditions, shelf_life_months, created_at, updated_at) VALUES ('Sandelia K Fragrance', 'Parfum', NULL, 8, 1766.10, 'in_stock', 'kg', 0.5, 3.0, 'Store in cool, dark place. Temperature 15-25C. Keep tightly sealed.', 24, datetime('now'), datetime('now'));
INSERT INTO ingredient_marketing (ingredient_id, applications, benefits) VALUES ((SELECT id FROM ingredients WHERE name = 'Sandelia K Fragrance'), 'Soaps, cosmetics, personal care products', 'Sandalwood-type fragrance blend from Quintessence');

COMMIT;

