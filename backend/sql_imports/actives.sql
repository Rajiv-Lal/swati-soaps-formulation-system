-- MISSING ACTIVES (Category 1)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Ajidew ZN-100', 'Zinc PCA', '15454-75-8', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '97090', '239-469-5', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Ajidew ZN-100';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Oil control, antimicrobial, moisturizing, reduces acne', 'Acne soaps, oily skin products' FROM ingredients WHERE name = 'Ajidew ZN-100';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Alpha Arbutin', 'Alpha-Arbutin', '84380-01-8', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '74827', '282-824-1', 1, 1, 'Generally safe - max 2% in formulations' FROM ingredients WHERE name = 'Alpha Arbutin';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Skin brightening, reduces dark spots, safe alternative to hydroquinone', 'Brightening soaps, anti-pigmentation products' FROM ingredients WHERE name = 'Alpha Arbutin';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Banana Spray Dried Powder', 'Musa Sapientum Fruit Powder', NULL, 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '82680', NULL, 1, 1, 'Generally safe - natural ingredient' FROM ingredients WHERE name = 'Banana Spray Dried Powder';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Moisturizing, rich in potassium and vitamins, natural exfoliant', 'Natural soaps, moisturizing products' FROM ingredients WHERE name = 'Banana Spray Dried Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Camel Milk Powder', 'Camel Milk', NULL, 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, NULL, NULL, 1, 1, 'Generally safe - natural ingredient' FROM ingredients WHERE name = 'Camel Milk Powder';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Rich in vitamins, antibacterial, moisturizing, anti-aging, gentle on sensitive skin', 'Luxury soaps, sensitive skin products, anti-aging' FROM ingredients WHERE name = 'Camel Milk Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Derma White WF', 'Phenylethyl Resorcinol', '85-27-8', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87464', '201-589-7', 1, 1, 'Generally safe - max 0.5%' FROM ingredients WHERE name = 'Derma White WF';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Powerful skin brightening, reduces melanin, anti-aging', 'Brightening soaps, whitening products' FROM ingredients WHERE name = 'Derma White WF';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Eutanol G', 'Octyldodecanol', '5333-42-6', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '84014', '226-242-9', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Eutanol G';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Emollient, improves spreadability, non-greasy feel', 'Premium soaps, cosmetics' FROM ingredients WHERE name = 'Eutanol G';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Kojic Acid Dipalmitate', 'Kojic Dipalmitate', '79725-98-7', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79342', NULL, 1, 1, 'Generally safe - more stable than kojic acid' FROM ingredients WHERE name = 'Kojic Acid Dipalmitate';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Skin brightening, stable form of kojic acid, oil soluble', 'Brightening soaps, anti-pigmentation products' FROM ingredients WHERE name = 'Kojic Acid Dipalmitate';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('L-Glutathione Reduced', 'Glutathione', '70-18-8', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '78630', '200-725-4', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'L-Glutathione Reduced';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Powerful antioxidant, skin brightening, anti-aging, detoxifying', 'Premium brightening soaps, anti-aging products' FROM ingredients WHERE name = 'L-Glutathione Reduced';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Pancil COS-17', 'Undecylenoyl Phenylalanine', '175357-18-3', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '96439', NULL, 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Pancil COS-17';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Skin brightening, reduces melanin synthesis, anti-pigmentation', 'Brightening soaps, even skin tone products' FROM ingredients WHERE name = 'Pancil COS-17';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Red Sandal Powder', 'Pterocarpus Santalinus Wood Powder', '84787-70-2', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87918', '284-130-5', 1, 1, 'Generally safe - natural ingredient' FROM ingredients WHERE name = 'Red Sandal Powder';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Anti-inflammatory, skin brightening, treats acne, natural colorant', 'Traditional soaps, Ayurvedic products, brightening soaps' FROM ingredients WHERE name = 'Red Sandal Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rice Extract Water Soluble', 'Oryza Sativa Extract', '68553-81-1', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '84647', '271-398-9', 1, 1, 'Generally safe - natural ingredient' FROM ingredients WHERE name = 'Rice Extract Water Soluble';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Brightening, moisturizing, antioxidant, traditional Asian beauty ingredient', 'Brightening soaps, K-beauty inspired products' FROM ingredients WHERE name = 'Rice Extract Water Soluble';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Seaweed Extract', 'Algae Extract', '92128-82-0', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '74226', '295-842-9', 1, 1, 'Generally safe - natural ingredient' FROM ingredients WHERE name = 'Seaweed Extract';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Detoxifying, mineral-rich, hydrating, anti-aging, firming', 'Spa soaps, detox products, anti-aging' FROM ingredients WHERE name = 'Seaweed Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Saffron Extract', 'Crocus Sativus Extract', '84604-17-1', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '76789', '283-370-7', 1, 1, 'Generally safe - premium ingredient' FROM ingredients WHERE name = 'Saffron Extract';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Brightening, anti-aging, antioxidant, luxurious, traditional Ayurvedic', 'Premium soaps, luxury skincare, bridal products' FROM ingredients WHERE name = 'Saffron Extract';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Titanium Dioxide', 'Titanium Dioxide', '13463-67-7', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '96140', '236-675-5', 1, 1, 'EU restricted in certain applications - check latest regulations' FROM ingredients WHERE name = 'Titanium Dioxide';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'White colorant, opacity, UV protection, brightening appearance', 'White soaps, sun care, opacity in formulations' FROM ingredients WHERE name = 'Titanium Dioxide';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Tomato Spray Dried Powder', 'Solanum Lycopersicum Fruit Powder', NULL, 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '90891', NULL, 1, 1, 'Generally safe - natural ingredient' FROM ingredients WHERE name = 'Tomato Spray Dried Powder';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Rich in lycopene, antioxidant, brightening, tightens pores', 'Natural soaps, brightening products, anti-aging' FROM ingredients WHERE name = 'Tomato Spray Dried Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Veg Collagen', 'Hydrolyzed Vegetable Protein', '100209-45-8', 1, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '78824', NULL, 1, 1, 'Generally safe - vegan alternative' FROM ingredients WHERE name = 'Veg Collagen';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Vegan collagen alternative, anti-aging, firming, moisturizing', 'Vegan soaps, anti-aging products' FROM ingredients WHERE name = 'Veg Collagen';

-- VERIFICATION
SELECT 'Actives now:';
SELECT name FROM ingredients WHERE category_id = 1 ORDER BY name;
