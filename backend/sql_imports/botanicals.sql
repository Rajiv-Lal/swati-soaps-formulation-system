-- MISSING BOTANICALS & EXTRACTS (Category 3)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Arrow Root Extract', 'Maranta Arundinacea Root Extract', '9005-25-8', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Soothing, thickening, absorbent, gentle on skin', 'Baby products, sensitive skin soaps' FROM ingredients WHERE name = 'Arrow Root Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Songyi Mushroom Extract', 'Tricholoma Matsutake Extract', NULL, 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Antioxidant, anti-aging, brightening, premium K-beauty ingredient', 'Luxury soaps, anti-aging products' FROM ingredients WHERE name = 'Songyi Mushroom Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Fig Extract', 'Ficus Carica Fruit Extract', '90028-74-3', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Moisturizing, antioxidant, rich in vitamins, softening', 'Moisturizing soaps, premium skincare' FROM ingredients WHERE name = 'Fig Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lemon Fruit Extract', 'Citrus Limon Fruit Extract', '84929-31-7', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Brightening, astringent, antibacterial, refreshing', 'Brightening soaps, oily skin products' FROM ingredients WHERE name = 'Lemon Fruit Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Licorice Root Extract', 'Glycyrrhiza Glabra Root Extract', '84775-66-6', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Skin brightening, anti-inflammatory, soothing, reduces redness', 'Brightening soaps, sensitive skin, anti-pigmentation' FROM ingredients WHERE name = 'Licorice Root Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lupulus (Hops) Extract', 'Humulus Lupulus Extract', '8060-28-4', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Calming, antibacterial, balances skin, anti-aging', 'Calming soaps, mens products' FROM ingredients WHERE name = 'Lupulus (Hops) Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Mulberry Leaf Extract', 'Morus Alba Leaf Extract', '90064-11-4', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Skin brightening, antioxidant, reduces melanin production', 'Brightening soaps, anti-pigmentation products' FROM ingredients WHERE name = 'Mulberry Leaf Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Orange Peel Extract', 'Citrus Aurantium Dulcis Peel Extract', '84012-24-8', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Brightening, astringent, refreshing, antioxidant', 'Citrus soaps, brightening products' FROM ingredients WHERE name = 'Orange Peel Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Papaya Fruit Extract', 'Carica Papaya Fruit Extract', '84012-30-6', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Exfoliating (papain enzyme), brightening, smoothing', 'Exfoliating soaps, brightening products' FROM ingredients WHERE name = 'Papaya Fruit Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Pineapple Extract', 'Ananas Sativus Fruit Extract', '84650-60-2', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Exfoliating (bromelain enzyme), brightening, smoothing', 'Exfoliating soaps, brightening products' FROM ingredients WHERE name = 'Pineapple Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sarsaparilla Extract', 'Smilax Aristolochiifolia Root Extract', '90106-54-4', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Detoxifying, anti-inflammatory, traditional remedy, skin clearing', 'Detox soaps, acne products, traditional formulas' FROM ingredients WHERE name = 'Sarsaparilla Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Snow Mushroom Extract', 'Tremella Fuciformis Extract', '94465-79-9', 3, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Superior hydration, holds 500x its weight in water, anti-aging', 'Hydrating soaps, premium anti-aging products' FROM ingredients WHERE name = 'Snow Mushroom Extract';

-- VERIFICATION
SELECT 'Botanicals now:';
SELECT name FROM ingredients WHERE category_id = 3 ORDER BY name;
