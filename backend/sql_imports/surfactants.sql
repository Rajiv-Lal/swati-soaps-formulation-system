-- MISSING SURFACTANTS/LIQUIDS (Category 11)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galaxy CAPB', 'Cocamidopropyl Betaine', '61789-40-0', 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Mild surfactant, foam booster, thickener, amphoteric', 'Baby soaps, mild cleansers, shampoos' FROM ingredients WHERE name = 'Galaxy CAPB';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('IPA', 'Isopropyl Alcohol', '67-63-0', 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Solvent, removes bubbles in melt and pour, sanitizing', 'Transparent soaps, sanitizers' FROM ingredients WHERE name = 'IPA';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Isopropyl Myristate', 'Isopropyl Myristate', '110-27-0', 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Emollient, penetration enhancer, non-greasy feel', 'Premium soaps, cosmetics' FROM ingredients WHERE name = 'Isopropyl Myristate';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Light Liquid Paraffin', 'Paraffinum Liquidum', '8012-95-1', 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Emollient, moisturizing, protective barrier, lubricant', 'Baby soaps, moisturizing products' FROM ingredients WHERE name = 'Light Liquid Paraffin';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Olivem 1000', 'Cetearyl Olivate and Sorbitan Olivate', NULL, 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural emulsifier, self-emulsifying, olive-derived, premium', 'Natural cosmetics, lotions, premium soaps' FROM ingredients WHERE name = 'Olivem 1000';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Olivem 900', 'Sorbitan Olivate', NULL, 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Co-emulsifier, olive-derived, natural, moisturizing', 'Natural cosmetics, premium soaps' FROM ingredients WHERE name = 'Olivem 900';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('TEA (Triethanolamine)', 'Triethanolamine', '102-71-6', 11, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'pH adjuster, emulsifier, surfactant', 'Liquid soaps, shampoos, cosmetics' FROM ingredients WHERE name = 'TEA (Triethanolamine)';

-- VERIFICATION
SELECT 'Surfactants now:';
SELECT name FROM ingredients WHERE category_id = 11 ORDER BY name;
