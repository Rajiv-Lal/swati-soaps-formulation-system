-- SOAP BASES (Category 10)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Coconut Base', 'Sodium Cocoate', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Good lather, cleansing, natural base', 'Cold process soaps, natural soaps' FROM ingredients WHERE name = 'Coconut Base';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galaxy 622', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Standard soap noodles, good lather', 'Toilet soaps, beauty bars' FROM ingredients WHERE name = 'Galaxy 622';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galaxy SN 8262 SP', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Premium soap noodles, smooth texture', 'Premium toilet soaps' FROM ingredients WHERE name = 'Galaxy SN 8262 SP';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galaxy SN 8501', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'High TFM soap noodles', 'Quality toilet soaps' FROM ingredients WHERE name = 'Galaxy SN 8501';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galaxy SN960 SF', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Sulfate-free soap noodles, gentle', 'Sensitive skin soaps, baby soaps' FROM ingredients WHERE name = 'Galaxy SN960 SF';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galfusion Gentle Care-SB', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Gentle, moisturizing base', 'Sensitive skin soaps, baby products' FROM ingredients WHERE name = 'Galfusion Gentle Care-SB';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galsoft SCI 85', 'Sodium Cocoyl Isethionate', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'SLS-free surfactant, gentle, creamy lather', 'Syndet bars, shampoo bars, sensitive skin' FROM ingredients WHERE name = 'Galsoft SCI 85';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Ipure-SFMP7', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Premium melt and pour base', 'Transparent soaps, glycerin soaps' FROM ingredients WHERE name = 'Ipure-SFMP7';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('KLK Soap Noodles', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Malaysian palm-based noodles, consistent quality', 'Toilet soaps, export quality' FROM ingredients WHERE name = 'KLK Soap Noodles';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('SBCG-SLS Free Base', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'SLS-free, gentle on skin', 'Sensitive skin soaps, natural products' FROM ingredients WHERE name = 'SBCG-SLS Free Base';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('SBCG-UW', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Ultra white base, bright appearance', 'White toilet soaps, beauty bars' FROM ingredients WHERE name = 'SBCG-UW';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('SBTS-30', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Transparent soap base 30% TFM', 'Transparent soaps, glycerin bars' FROM ingredients WHERE name = 'SBTS-30';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('SBTS-32', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Transparent soap base 32% TFM', 'Transparent soaps, premium glycerin bars' FROM ingredients WHERE name = 'SBTS-32';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('SBTS-40-Naulakha', 'Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'High TFM transparent base, premium quality', 'Premium transparent soaps' FROM ingredients WHERE name = 'SBTS-40-Naulakha';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Shampoo Bar Base', 'Syndet Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'SLS-free shampoo bar base, gentle on hair', 'Shampoo bars, solid shampoos' FROM ingredients WHERE name = 'Shampoo Bar Base';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sinar Mas Soap Noodles', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Indonesian palm-based noodles, cost-effective', 'Toilet soaps, laundry bars' FROM ingredients WHERE name = 'Sinar Mas Soap Noodles';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Soap Noodles 3F', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Standard grade soap noodles', 'Economy toilet soaps' FROM ingredients WHERE name = 'Soap Noodles 3F';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Soap Noodles 73%', 'Soap Noodles 73% TFM', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, '73% TFM soap noodles, grade 2', 'Standard toilet soaps' FROM ingredients WHERE name = 'Soap Noodles 73%';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Soap Noodles 80:20', 'Soap Noodles 80:20 Blend', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, '80% tallow 20% coconut blend, creamy lather', 'Premium toilet soaps, beauty bars' FROM ingredients WHERE name = 'Soap Noodles 80:20';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Soap Noodles Jocil', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Jocil brand soap noodles, Indian made', 'Toilet soaps, domestic market' FROM ingredients WHERE name = 'Soap Noodles Jocil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Soap Noodles-R', 'Soap Noodles', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Regular grade soap noodles', 'Economy soaps' FROM ingredients WHERE name = 'Soap Noodles-R';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Transparent Soap Base CIX01', 'Melt and Pour Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Clear melt and pour base, easy to work with', 'Transparent soaps, decorative soaps' FROM ingredients WHERE name = 'Transparent Soap Base CIX01';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Transparent Base', 'Glycerin Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Standard transparent glycerin base', 'Glycerin soaps, melt and pour' FROM ingredients WHERE name = 'Transparent Base';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Transparent Base MFG', 'Glycerin Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Manufacturing grade transparent base', 'Bulk transparent soap production' FROM ingredients WHERE name = 'Transparent Base MFG';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Tr.Base Chem.Int.', 'Glycerin Soap Base', NULL, 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Chemical Industries transparent base', 'Transparent soaps' FROM ingredients WHERE name = 'Tr.Base Chem.Int.';

-- VERIFICATION
SELECT 'Soap Bases added:';
SELECT name FROM ingredients WHERE category_id = 10 ORDER BY name;
