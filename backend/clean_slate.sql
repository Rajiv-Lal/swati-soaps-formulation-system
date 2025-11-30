BEGIN TRANSACTION;

-- Remove all formulations and their ingredients
DELETE FROM formulation_ingredients;
DELETE FROM formulations;

-- Remove auto-created ingredients from failed imports (keep original 1-21)
DELETE FROM ingredients WHERE id >= 22;

-- Reset sequences
DELETE FROM sqlite_sequence WHERE name IN ('formulations', 'formulation_ingredients', 'ingredients');
UPDATE sqlite_sequence SET seq = 21 WHERE name = 'ingredients';

COMMIT;

SELECT '✅ Cleanup complete!' as status;
SELECT 'Ingredients remaining:' as info, COUNT(*) as count FROM ingredients;
SELECT 'Formulations:' as info, COUNT(*) as count FROM formulations;
