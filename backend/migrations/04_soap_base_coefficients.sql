-- Migration: Add hardness and lather coefficients for soap bases
-- Date: 2026-02-23
-- Description: Adds predictive data for primary soap bases used in formulations

-- Soap Noodles 80:20 (80% tallow, 20% coconut blend)
-- Specs: TFM 78.53%, Iodine Value 39.75
INSERT OR REPLACE INTO ingredient_properties (ingredient_id, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient, formulation_notes)
SELECT id, 198, 39.75, 158, 0.76, 0.23, '80% tallow, 20% coconut blend. TFM 78.53%. Produces hard bar with creamy lather.'
FROM ingredients WHERE name = 'Soap Noodles 80:20';

-- Soap Noodles 80:20(G) - same specs
INSERT OR REPLACE INTO ingredient_properties (ingredient_id, sap_value, iodine_value, ins_value, hardness_coefficient, lather_coefficient, formulation_notes)
SELECT id, 198, 39.75, 158, 0.76, 0.23, '80% tallow, 20% coconut blend. TFM 78.53%. Produces hard bar with creamy lather.'
FROM ingredients WHERE name = 'Soap Noodles 80:20(G)';

-- SBTS-30 (Transparent soap base)
-- Specs: TFM 38.33%, FFA 1.05%, Solid Solubility 60%
INSERT OR REPLACE INTO ingredient_properties (ingredient_id, ins_value, hardness_coefficient, lather_coefficient, formulation_notes)
SELECT id, 120, 0.50, 0.35, 'Transparent soap base. TFM 38.33%, FFA 1.05%, Solid solubility 60%. Moderate hardness, good clarity.'
FROM ingredients WHERE name = 'SBTS-30';

-- SBTS-40 variants (Transparent soap base, higher TFM)
-- Specs: TFM 41.30%, FFA 0.96%, Solid Content 67.38%, pH 10
INSERT OR REPLACE INTO ingredient_properties (ingredient_id, ins_value, hardness_coefficient, lather_coefficient, formulation_notes)
SELECT id, 125, 0.55, 0.38, 'Transparent soap base SBTS-40. TFM 41.30%, FFA 0.96%, Solid content 67.38%, pH 10. Higher TFM than SBTS-30.'
FROM ingredients WHERE name = 'SBTS-40-Naulakha';

INSERT OR REPLACE INTO ingredient_properties (ingredient_id, ins_value, hardness_coefficient, lather_coefficient, formulation_notes)
SELECT id, 125, 0.55, 0.38, 'Naulakha SBTS 40. TFM 41.30%, FFA 0.96%, Solid content 67.38%, pH 10. Higher TFM than SBTS-30.'
FROM ingredients WHERE name = 'Naulakha SBTS 40';

-- Galaxy SN 937 (Syndet base)
-- Specs: TFM 40,820, Surface Active Agent >4000, pH 9.88
INSERT OR IGNORE INTO ingredients (name, inci_name, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Galaxy SN 937', 'Syndet Base', 10, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));

INSERT OR REPLACE INTO ingredient_properties (ingredient_id, hardness_coefficient, lather_coefficient, formulation_notes)
SELECT id, 0.45, 0.55, 'Syndet (synthetic detergent) base. TFM 40,820, Surface Active Agent >4000, pH 9.88. Milder than traditional soap, excellent lather.'
FROM ingredients WHERE name = 'Galaxy SN 937';

INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications)
SELECT id, 'Mild syndet base, gentle on skin, excellent lather, pH balanced', 'Syndet bars, sensitive skin soaps, baby soaps'
FROM ingredients WHERE name = 'Galaxy SN 937';

-- Verification
SELECT i.name, ip.hardness_coefficient, ip.lather_coefficient, ip.ins_value, ip.formulation_notes
FROM ingredient_properties ip
JOIN ingredients i ON ip.ingredient_id = i.id
WHERE i.name IN ('Soap Noodles 80:20', 'Soap Noodles 80:20(G)', 'SBTS-30', 'SBTS-40-Naulakha', 'Naulakha SBTS 40', 'Galaxy SN 937');
