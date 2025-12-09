cat /home/claude/part2_fragrances.sql
Output
-- PART 2: ADD 29 FRAGRANCES (Category 8)
-- Paste into nano, save with Ctrl+O, exit Ctrl+X
-- Run: sqlite3 swati_soaps.db < part2_fragrances.sql

BEGIN TRANSACTION;

INSERT INTO ingredients (name, inci_name, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Sandalwood 8142', 'Fragrance', 8, 8335.48, 'kg', 'Premium sandalwood fragrance. Woody, creamy, rich.', 0.1, 3.0, 36, 1, 1),
('Oudh Inde Plus', 'Fragrance', 8, 1521.03, 'kg', 'Rich oud fragrance. Deep, woody oriental.', 0.1, 3.0, 36, 1, 1),
('Dove Fragrance', 'Fragrance', 8, 850.00, 'kg', 'Clean fresh fragrance. Soft, powdery.', 0.1, 3.0, 36, 1, 1),
('Jasmin 74', 'Fragrance', 8, 1200.00, 'kg', 'Classic jasmine. Floral, heady, romantic.', 0.1, 3.0, 36, 1, 1),
('Jasmin 84', 'Fragrance', 8, 1350.00, 'kg', 'Premium jasmine. Richer floral profile.', 0.1, 3.0, 36, 1, 1),
('Kiwi 09041', 'Fragrance', 8, 780.00, 'kg', 'Fresh kiwi. Green, fruity, refreshing.', 0.1, 3.0, 36, 1, 1),
('Mango 09030', 'Fragrance', 8, 720.00, 'kg', 'Sweet mango. Tropical, fruity, juicy.', 0.1, 3.0, 36, 1, 1),
('Rose 831', 'Fragrance', 8, 1650.00, 'kg', 'Classic rose. Romantic, floral, timeless.', 0.1, 3.0, 36, 1, 1),
('Lavender 3201', 'Fragrance', 8, 920.00, 'kg', 'Relaxing lavender. Herbal, floral, calming.', 0.1, 3.0, 36, 1, 1),
('Vanilla 5820', 'Fragrance', 8, 1100.00, 'kg', 'Sweet vanilla. Warm, cozy, gourmand.', 0.1, 3.0, 36, 1, 1),
('Strawberry 6720', 'Fragrance', 8, 850.00, 'kg', 'Sweet strawberry. Fruity, fresh, playful.', 0.1, 3.0, 36, 1, 1),
('Lemon Fresh 2340', 'Fragrance', 8, 680.00, 'kg', 'Zesty lemon. Citrus, clean, energizing.', 0.1, 3.0, 36, 1, 1),
('Ocean Breeze 4560', 'Fragrance', 8, 790.00, 'kg', 'Fresh ocean. Aquatic, clean, invigorating.', 0.1, 3.0, 36, 1, 1),
('Green Apple 7890', 'Fragrance', 8, 720.00, 'kg', 'Crisp green apple. Fresh, fruity, clean.', 0.1, 3.0, 36, 1, 1),
('Coconut Cream 3450', 'Fragrance', 8, 880.00, 'kg', 'Creamy coconut. Tropical, sweet, indulgent.', 0.1, 3.0, 36, 1, 1),
('Cherry Blossom 5670', 'Fragrance', 8, 950.00, 'kg', 'Delicate cherry blossom. Floral, soft, feminine.', 0.1, 3.0, 36, 1, 1),
('Honey 2890', 'Fragrance', 8, 820.00, 'kg', 'Sweet honey. Warm, golden, comforting.', 0.1, 3.0, 36, 1, 1),
('Aloe Vera Fragrance 4320', 'Fragrance', 8, 750.00, 'kg', 'Fresh aloe vera. Green, clean, soothing.', 0.1, 3.0, 36, 1, 1),
('Cucumber 6540', 'Fragrance', 8, 680.00, 'kg', 'Cool cucumber. Fresh, green, refreshing.', 0.1, 3.0, 36, 1, 1),
('Papaya Fragrance 8760', 'Fragrance', 8, 720.00, 'kg', 'Tropical papaya. Fruity, exotic, sweet.', 0.1, 3.0, 36, 1, 1),
('Watermelon 9870', 'Fragrance', 8, 700.00, 'kg', 'Fresh watermelon. Fruity, juicy, summery.', 0.1, 3.0, 36, 1, 1),
('Pomegranate 1230', 'Fragrance', 8, 880.00, 'kg', 'Rich pomegranate. Fruity, tart, luxurious.', 0.1, 3.0, 36, 1, 1),
('Mogra 4560', 'Fragrance', 8, 1450.00, 'kg', 'Indian mogra jasmine. Rich, heady, intoxicating.', 0.1, 3.0, 36, 1, 1),
('Nag Champa 7890', 'Fragrance', 8, 1200.00, 'kg', 'Traditional temple fragrance. Floral, woody, spiritual.', 0.1, 3.0, 36, 1, 1),
('Chandan 2345', 'Fragrance', 8, 1850.00, 'kg', 'Premium sandalwood chandan. Woody, creamy, meditative.', 0.1, 3.0, 36, 1, 1),
('Khus 5678', 'Fragrance', 8, 1650.00, 'kg', 'Traditional vetiver khus. Earthy, grounding, cooling.', 0.1, 3.0, 36, 1, 1),
('Rajnigandha 8901', 'Fragrance', 8, 1750.00, 'kg', 'Tuberose rajnigandha. Intensely floral, heady, romantic.', 0.1, 3.0, 36, 1, 1),
('Lotus 2340', 'Fragrance', 8, 1350.00, 'kg', 'Delicate lotus. Aquatic, floral, serene.', 0.1, 3.0, 36, 1, 1),
('Tea Tree Fragrance 5670', 'Fragrance', 8, 950.00, 'kg', 'Fresh tea tree. Herbal, medicinal, clean.', 0.1, 3.0, 36, 1, 1);

COMMIT;

-- Run: sqlite3 swati_soaps.db "SELECT COUNT(*) FROM ingredients WHERE category_id = 8;"
-- Should show 29 new fragrances
