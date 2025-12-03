-- MISSING COLORANTS (Category 6)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Acid Orange 7', 'CI 15510', '633-96-5', 6, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '74108', '211-199-0', 1, 1, 'Approved colorant for rinse-off products' FROM ingredients WHERE name = 'Acid Orange 7';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Bright orange color, water soluble', 'Transparent soaps, rinse-off products' FROM ingredients WHERE name = 'Acid Orange 7';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Alizarine Purple', 'CI 58005', '4430-18-6', 6, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '74162', '224-628-8', 1, 1, 'Approved colorant' FROM ingredients WHERE name = 'Alizarine Purple';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Deep purple/violet color, stable', 'Soaps, cosmetics' FROM ingredients WHERE name = 'Alizarine Purple';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Xerlite Sinopia Brown', 'CI 77491', '1309-37-1', 6, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '77491', '215-168-2', 1, 1, 'Iron oxide based - generally safe' FROM ingredients WHERE name = 'Xerlite Sinopia Brown';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural brown color, stable, earth tone', 'Natural soaps, earthy themed products' FROM ingredients WHERE name = 'Xerlite Sinopia Brown';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Chlorophyll', 'CI 75810', '1406-65-1', 6, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75810', '215-800-7', 1, 1, 'Natural colorant - may fade in light' FROM ingredients WHERE name = 'Chlorophyll';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural green color from plants, eco-friendly', 'Natural soaps, herbal products, green themed soaps' FROM ingredients WHERE name = 'Chlorophyll';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Koelron Brown', 'CI 77499', '1317-61-9', 6, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '77499', '215-277-5', 1, 1, 'Iron oxide based - generally safe' FROM ingredients WHERE name = 'Koelron Brown';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Rich brown color, stable, warm tone', 'Chocolate soaps, coffee soaps, natural products' FROM ingredients WHERE name = 'Koelron Brown';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Solvent Yellow 18', 'CI 12740', '6486-23-3', 6, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '12740', '229-386-1', 1, 1, 'Approved colorant for rinse-off products' FROM ingredients WHERE name = 'Solvent Yellow 18';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Bright yellow color, oil soluble', 'Opaque soaps, yellow themed products' FROM ingredients WHERE name = 'Solvent Yellow 18';

-- VERIFICATION
SELECT 'Colorants now:';
SELECT name FROM ingredients WHERE category_id = 6 ORDER BY name;
