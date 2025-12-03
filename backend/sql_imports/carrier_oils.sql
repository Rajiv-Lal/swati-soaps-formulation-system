-- MISSING CARRIER OILS (Category 5)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Almond Oil', 'Prunus Amygdalus Dulcis Oil', '8007-69-0', 5, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79823', '232-430-1', 1, 1, 'Generally safe - avoid if nut allergy' FROM ingredients WHERE name = 'Almond Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Moisturizing, rich in vitamin E, softens skin, mild nutty scent', 'Soaps, massage oils, skincare, hair care' FROM ingredients WHERE name = 'Almond Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Apricot Kernel Oil', 'Prunus Armeniaca Kernel Oil', '72869-69-3', 5, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79824', '276-980-0', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Apricot Kernel Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Lightweight, absorbs quickly, rich in vitamins A and E, anti-aging', 'Facial soaps, premium skincare, massage oils' FROM ingredients WHERE name = 'Apricot Kernel Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Avocado Oil', 'Persea Gratissima Oil', '8024-32-6', 5, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87413', '232-428-0', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Avocado Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Deeply moisturizing, rich in oleic acid, penetrates skin, anti-aging', 'Dry skin soaps, luxury skincare, hair treatments' FROM ingredients WHERE name = 'Avocado Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Carrot Seed Oil', 'Daucus Carota Sativa Seed Oil', '8015-88-1', 5, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '76941', '289-603-5', 1, 1, 'Avoid during pregnancy' FROM ingredients WHERE name = 'Carrot Seed Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Antioxidant, rejuvenating, natural SPF properties, anti-aging', 'Anti-aging soaps, sun care, mature skin products' FROM ingredients WHERE name = 'Carrot Seed Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Pine Tar Oil', 'Pinus Palustris Tar Oil', '8011-48-1', 5, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87445', '232-374-8', 1, 1, 'May cause sensitivity - patch test recommended' FROM ingredients WHERE name = 'Pine Tar Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Treats psoriasis, eczema, dandruff, antiseptic, traditional remedy', 'Medicated soaps, scalp treatments, therapeutic products' FROM ingredients WHERE name = 'Pine Tar Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Walnut Oil', 'Juglans Regia Seed Oil', '8024-09-7', 5, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79329', '232-389-5', 1, 1, 'Generally safe - avoid if nut allergy' FROM ingredients WHERE name = 'Walnut Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Rich in omega-3, anti-inflammatory, moisturizing, strengthens hair', 'Premium soaps, hair care, anti-aging products' FROM ingredients WHERE name = 'Walnut Oil';

-- VERIFICATION
SELECT 'Carrier Oils now:';
SELECT name FROM ingredients WHERE category_id = 5 ORDER BY name;
