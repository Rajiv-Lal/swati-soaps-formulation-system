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

-- Verification
SELECT i.name, ip.hardness_coefficient, ip.lather_coefficient, ip.ins_value, ip.formulation_notes
FROM ingredient_properties ip
JOIN ingredients i ON ip.ingredient_id = i.id
WHERE i.name IN ('Soap Noodles 80:20', 'Soap Noodles 80:20(G)', 'SBTS-30');
