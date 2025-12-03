-- MISSING ITEMS FROM QUINTESSENCE PDF
-- 8 Essential Oils + 3 Fragrances

-- ESSENTIAL OILS (Category 7)

-- 1. Black Seed Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Black Seed Oil', 'Nigella Sativa Seed Oil', '8014-13-9', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '84082', '283-040-9', 1, 1, 'Generally safe - may cause allergic reactions in some' FROM ingredients WHERE name = 'Black Seed Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-inflammatory, antimicrobial, promotes hair growth, treats skin conditions', 'Hair care, medicinal soaps, skincare', 'Warm, slightly bitter, peppery, herbal', 'Herbal-Spicy' FROM ingredients WHERE name = 'Black Seed Oil';

-- 2. Cassia Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Cassia Oil', 'Cinnamomum Cassia Leaf Oil', '8007-80-5', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75745', '284-635-0', 1, 1, 'Strong sensitizer - max 0.01% in leave-on products, similar to cinnamon' FROM ingredients WHERE name = 'Cassia Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Warming, antimicrobial, improves circulation, digestive aid', 'Warming soaps, aromatherapy', 'Strong, warm, sweet-spicy, similar to cinnamon but harsher', 'Spicy' FROM ingredients WHERE name = 'Cassia Oil';

-- 3. Grape Seed Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Grape Seed Oil', 'Vitis Vinifera Seed Oil', '8024-22-4', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '96687', '284-513-7', 1, 1, 'Generally safe - carrier oil' FROM ingredients WHERE name = 'Grape Seed Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Lightweight moisturizer, antioxidant, non-comedogenic, good carrier oil', 'Skincare, massage oils, soaps', 'Very light, neutral, slightly nutty', 'Neutral' FROM ingredients WHERE name = 'Grape Seed Oil';

-- 4. Hemp Seed Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Hemp Seed Oil', 'Cannabis Sativa Seed Oil', '8016-24-8', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75533', '273-313-3', 1, 1, 'Generally safe - contains no THC, legal carrier oil' FROM ingredients WHERE name = 'Hemp Seed Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Rich in omega fatty acids, moisturizing, anti-inflammatory, balances oily skin', 'Skincare, soaps, hair care', 'Slightly nutty, grassy, earthy', 'Herbal-Earthy' FROM ingredients WHERE name = 'Hemp Seed Oil';

-- 5. Rosehip Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rosehip Oil', 'Rosa Canina Fruit Oil', '84603-93-0', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '88268', '283-365-3', 1, 1, 'Generally safe - premium carrier oil' FROM ingredients WHERE name = 'Rosehip Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-aging, reduces scars, brightening, rich in vitamin C and retinoids', 'Premium skincare, anti-aging soaps', 'Mild, woody, slightly nutty, earthy', 'Woody-Earthy' FROM ingredients WHERE name = 'Rosehip Oil';

-- 6. Star Anise Essential Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Star Anise Essential Oil', 'Illicium Verum Fruit Oil', '8007-70-3', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79296', '284-512-1', 1, 1, 'Avoid during pregnancy - contains anethole' FROM ingredients WHERE name = 'Star Anise Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Digestive aid, antimicrobial, warming, expectorant', 'Aromatherapy, warming soaps', 'Strong, sweet, licorice-like anise scent', 'Spicy' FROM ingredients WHERE name = 'Star Anise Essential Oil';

-- 7. Turmeric Leaf Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Turmeric Leaf Oil', 'Curcuma Longa Leaf Oil', '8024-37-1', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '76866', '283-882-9', 1, 1, 'Generally safe - different from root oil, less likely to stain' FROM ingredients WHERE name = 'Turmeric Leaf Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-inflammatory, antimicrobial, less staining than root oil', 'Skincare, soaps, aromatherapy', 'Fresh, herbaceous, ginger-like with mild turmeric notes', 'Herbal' FROM ingredients WHERE name = 'Turmeric Leaf Oil';

-- 8. Wintergreen Essential Oil
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Wintergreen Essential Oil', 'Gaultheria Procumbens Leaf Oil', '68917-75-9', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '97028', '272-800-1', 1, 1, 'Toxic if ingested - external use only at low levels, not for children' FROM ingredients WHERE name = 'Wintergreen Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Pain relief, cooling, anti-inflammatory, muscle relaxant', 'Sports products, pain relief balms, medicinal soaps', 'Strong, minty, sweet medicinal scent', 'Herbal-Medicinal' FROM ingredients WHERE name = 'Wintergreen Essential Oil';

-- FRAGRANCES (Category 8)

-- 9. Florales Fragrance
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Florales Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Florales Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Fresh, feminine, versatile floral', 'Soaps, cosmetics, body care', 'Mixed floral bouquet with fresh green notes', 'Floral' FROM ingredients WHERE name = 'Florales Fragrance';

-- 10. Golden Beauty Fragrance
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Golden Beauty Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Golden Beauty Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Luxurious, sophisticated, feminine', 'Premium beauty soaps, cosmetics', 'Warm floral with amber and musk base', 'Floral-Oriental' FROM ingredients WHERE name = 'Golden Beauty Fragrance';

-- 11. Rose NP7828 Fragrance
INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rose NP7828 Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Rose NP7828 Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Classic, romantic, versatile rose', 'Soaps, perfumes, cosmetics', 'Classic rose with fresh, dewy top notes', 'Floral' FROM ingredients WHERE name = 'Rose NP7828 Fragrance';

-- VERIFICATION
SELECT 'New items added:';
SELECT name, category_id FROM ingredients WHERE name IN ('Black Seed Oil', 'Cassia Oil', 'Grape Seed Oil', 'Hemp Seed Oil', 'Rosehip Oil', 'Star Anise Essential Oil', 'Turmeric Leaf Oil', 'Wintergreen Essential Oil', 'Florales Fragrance', 'Golden Beauty Fragrance', 'Rose NP7828 Fragrance');
