-- MISSING ADDITIVES (Category 2)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('AOS', 'Sodium C14-16 Olefin Sulfonate', '68439-57-6', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Foaming agent, mild surfactant, good lather', 'Shampoo bars, liquid soaps' FROM ingredients WHERE name = 'AOS';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Bees Wax', 'Cera Alba', '8012-89-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural emulsifier, hardener, protective barrier, moisturizing', 'Natural soaps, balms, lotion bars' FROM ingredients WHERE name = 'Bees Wax';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Bronopol', '2-Bromo-2-Nitropropane-1,3-Diol', '52-51-7', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Preservative, antimicrobial, broad spectrum protection', 'Liquid soaps, shampoos' FROM ingredients WHERE name = 'Bronopol';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Carnauba Wax', 'Copernicia Cerifera Wax', '8015-86-9', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Hardener, gloss, vegan alternative to beeswax', 'Hard bars, glossy finish soaps' FROM ingredients WHERE name = 'Carnauba Wax';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Carrageenan Powder', 'Carrageenan', '9000-07-1', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural thickener, stabilizer, gelling agent', 'Transparent soaps, cosmetics' FROM ingredients WHERE name = 'Carrageenan Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('EDTA', 'Disodium EDTA', '139-33-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Chelating agent, preservative booster, improves lather in hard water', 'All soaps, improves performance' FROM ingredients WHERE name = 'EDTA';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galguard Trident', 'Phenoxyethanol and Ethylhexylglycerin', NULL, 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Broad spectrum preservative, paraben-free option', 'Liquid soaps, cosmetics' FROM ingredients WHERE name = 'Galguard Trident';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('GMS', 'Glyceryl Monostearate', '31566-31-1', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Emulsifier, thickener, opacifier, pearlescent effect', 'Creamy soaps, lotions' FROM ingredients WHERE name = 'GMS';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('HCO', 'Hydrogenated Castor Oil', '8001-78-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Hardener, thickener, increases bar hardness', 'Hard bars, stick products' FROM ingredients WHERE name = 'HCO';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('KOH', 'Potassium Hydroxide', '1310-58-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Saponifying agent for liquid soaps, pH adjuster', 'Liquid soaps, soft soaps' FROM ingredients WHERE name = 'KOH';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lanolin', 'Lanolin', '8006-54-0', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Emollient, moisturizing, protective, similar to skin sebum', 'Moisturizing soaps, baby products' FROM ingredients WHERE name = 'Lanolin';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Magnesium Chloride', 'Magnesium Chloride', '7786-30-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Mineral additive, skin soothing, improves texture', 'Mineral soaps, therapeutic products' FROM ingredients WHERE name = 'Magnesium Chloride';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Magnesium Sulphate', 'Magnesium Sulfate', '7487-88-9', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Epsom salt, detoxifying, muscle relaxing, exfoliant', 'Bath soaps, spa products, detox bars' FROM ingredients WHERE name = 'Magnesium Sulphate';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Maize Starch Powder', 'Zea Mays Starch', '9005-25-8', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural thickener, absorbent, silky feel', 'Powdered products, dusting powder' FROM ingredients WHERE name = 'Maize Starch Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Microcrystalline Cellulose', 'Microcrystalline Cellulose', '9004-34-6', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Binder, filler, texturizer, improves bar hardness', 'Tablet soaps, hard bars' FROM ingredients WHERE name = 'Microcrystalline Cellulose';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Niacinamide', 'Niacinamide', '98-92-0', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Brightening, pore minimizing, anti-aging, barrier repair', 'Premium skincare soaps, anti-aging products' FROM ingredients WHERE name = 'Niacinamide';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Olivem 300', 'Sorbitan Olivate', '223705-79-1', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural emulsifier, olive-derived, moisturizing', 'Natural cosmetics, premium soaps' FROM ingredients WHERE name = 'Olivem 300';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Olivem 400', 'PEG-7 Olivate', NULL, 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Solubilizer, olive-derived, helps blend oils and water', 'Clear products, oil-infused soaps' FROM ingredients WHERE name = 'Olivem 400';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('SBC', 'Sodium Bicarbonate', '144-55-8', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Fizzing agent, deodorizing, mild exfoliant', 'Bath bombs, fizzy soaps' FROM ingredients WHERE name = 'SBC';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Scrub Powder', 'Exfoliant Powder', NULL, 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Physical exfoliant, removes dead skin cells', 'Exfoliating soaps, scrub bars' FROM ingredients WHERE name = 'Scrub Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sodium Ascorbyl Phosphate', 'Sodium Ascorbyl Phosphate', '66170-10-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Stable vitamin C, brightening, antioxidant, anti-aging', 'Brightening soaps, anti-aging products' FROM ingredients WHERE name = 'Sodium Ascorbyl Phosphate';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sodium Citrate', 'Sodium Citrate', '68-04-2', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'pH adjuster, chelating agent, buffering agent', 'All soap formulations' FROM ingredients WHERE name = 'Sodium Citrate';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sodium CMC', 'Sodium Carboxymethyl Cellulose', '9004-32-4', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Thickener, stabilizer, binder', 'Liquid soaps, gels' FROM ingredients WHERE name = 'Sodium CMC';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sodium Metabisulphite', 'Sodium Metabisulfite', '7681-57-4', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Antioxidant, preservative, prevents discoloration', 'Prevents rancidity, color stability' FROM ingredients WHERE name = 'Sodium Metabisulphite';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sodium PCA', 'Sodium PCA', '28874-51-3', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Natural humectant, moisturizing, part of skin NMF', 'Moisturizing soaps, premium skincare' FROM ingredients WHERE name = 'Sodium PCA';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sodium Stearate', 'Sodium Stearate', '822-16-2', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Soap hardener, emulsifier, thickener', 'Hard bars, stick products' FROM ingredients WHERE name = 'Sodium Stearate';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Talc Powder', 'Talc', '14807-96-6', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Absorbent, smooth feel, filler', 'Powdered products, soap finishing' FROM ingredients WHERE name = 'Talc Powder';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Tinogard TT', 'Pentaerythrityl Tetra-di-t-butyl Hydroxyhydrocinnamate', '6683-19-8', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Antioxidant, protects oils from rancidity, extends shelf life', 'Oil-rich soaps, extends product life' FROM ingredients WHERE name = 'Tinogard TT';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Tinopal CBSX', 'Disodium Distyrylbiphenyl Disulfonate', '27344-41-8', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Optical brightener, makes white soaps appear brighter', 'White soaps, brightening effect' FROM ingredients WHERE name = 'Tinopal CBSX';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Zinc Stearate', 'Zinc Stearate', '557-05-1', 2, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Lubricant, mold release, water repellent', 'Soap production, powder products' FROM ingredients WHERE name = 'Zinc Stearate';

-- VERIFICATION
SELECT 'Additives now:';
SELECT name FROM ingredients WHERE category_id = 2 ORDER BY name;
