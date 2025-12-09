BEGIN TRANSACTION;

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Sodium Hyaluronate 5M', 'Sodium Hyaluronate', '9067-32-7', 1, 7000.00, 'kg', 'High MW hyaluronic acid. Premium hydrating active.', 0.1, 2.0, 24, 1, 1),
('Ajidew ZN-100', 'Zinc PCA', '15454-75-8', 1, 8350.24, 'kg', 'Zinc PCA. Oil control and antimicrobial active.', 0.1, 2.0, 24, 1, 1),
('L-Glutathione Reduced', 'Glutathione', '70-18-8', 1, 17003.53, 'kg', 'Master antioxidant. Skin brightening active.', 0.1, 5.0, 12, 1, 1),
('Ceramide Complex Oli-8106', 'Ceramide NP', '100403-19-8', 1, 8700.00, 'kg', 'Skin barrier lipid complex.', 0.5, 5.0, 24, 1, 1),
('Veg Collagen', 'Hydrolyzed Vegetable Protein', '100684-25-1', 1, 8800.00, 'kg', 'Plant-derived collagen alternative.', 0.5, 5.0, 24, 1, 1),
('Derma White WF C BC 10046', 'Sodium Ascorbyl Phosphate', NULL, 1, 7776.08, 'kg', 'Multi-action brightening complex.', 1.0, 5.0, 18, 1, 1),
('Eutanol G', 'Octyldodecanol', '5333-42-6', 1, 2115.00, 'kg', 'Premium emollient and solvent.', 1.0, 20.0, 36, 1, 1),
('Titanium Dioxide', 'Titanium Dioxide', '13463-67-7', 1, 332.15, 'kg', 'Mineral UV filter and white pigment.', 1.0, 25.0, 36, 1, 1),
('Banana Spray Dried Powder', 'Musa Sapientum Fruit Powder', NULL, 1, 850.00, 'kg', 'Natural fruit powder for skincare.', 1.0, 10.0, 18, 1, 1),
('Tomato Spray Dried Powder', 'Solanum Lycopersicum Fruit Powder', NULL, 1, 950.00, 'kg', 'Lycopene-rich antioxidant powder.', 1.0, 10.0, 18, 1, 1);

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Magnesium Sulfate Heptahydrate IP', 'Magnesium Sulfate', '10034-99-8', 2, 55.00, 'kg', 'Epsom salt. Bath products and viscosity modifier.', 1.0, 100.0, 36, 1, 1),
('Refined Glycerine IP', 'Glycerin', '56-81-5', 2, 133.61, 'kg', 'Pharmaceutical grade humectant.', 1.0, 30.0, 36, 1, 1);

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Bakuchi Oil', 'Psoralea Corylifolia Seed Oil', NULL, 5, 1300.00, 'kg', 'Ayurvedic oil with bakuchiol. Natural retinol alternative.', 0.5, 5.0, 12, 1, 1),
('Extra Virgin Olive Oil', 'Olea Europaea Fruit Oil', '8001-25-0', 5, 550.00, 'kg', 'Cold-pressed premium olive oil.', 1.0, 100.0, 18, 1, 1),
('Patchouli Oil RCO', 'Pogostemon Cablin Oil', '8014-09-3', 5, 10500.00, 'kg', 'Reconstituted patchouli essential oil.', 0.1, 2.0, 36, 1, 1),
('CNFA-491', 'Coconut Acid', '61788-47-4', 5, 238.60, 'kg', 'Coconut-derived fatty acid blend.', 1.0, 100.0, 24, 1, 1);

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Amino Acid Complex', 'Sodium PCA', NULL, 9, 3300.00, 'kg', 'Natural moisturizing factor complex.', 1.0, 10.0, 24, 1, 1),
('HPMC', 'Hydroxypropyl Methylcellulose', '9004-65-3', 9, 635.00, 'kg', 'Cellulose thickener and film former.', 0.5, 5.0, 36, 1, 1),
('Ethyl Cellulose', 'Ethylcellulose', '9004-57-3', 9, 2150.00, 'kg', 'Film former for styling and nail products.', 1.0, 10.0, 36, 1, 1),
('Methyl Salicylate IP', 'Methyl Salicylate', '119-36-8', 9, 245.00, 'kg', 'Oil of Wintergreen. Cooling soothing agent.', 0.1, 5.0, 36, 1, 1);

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Prisma Yellow', 'CI 19140', '1934-21-0', 6, 8800.00, 'kg', 'Bright yellow cosmetic dye.', 0.01, 1.0, 36, 1, 1),
('Prisma Orange', 'CI 15985', '2783-94-0', 6, 6500.00, 'kg', 'Vivid orange cosmetic dye.', 0.01, 1.0, 36, 1, 1),
('Prisma Red', 'CI 16035', '25956-17-6', 6, 10800.00, 'kg', 'Bright red cosmetic dye.', 0.01, 1.0, 36, 1, 1),
('Prisma Green', 'CI 61570', '128-80-3', 6, 6200.00, 'kg', 'Forest green cosmetic dye.', 0.01, 1.0, 36, 1, 1),
('Prisma Blue', 'CI 42090', '3844-45-9', 6, 6800.00, 'kg', 'Brilliant blue cosmetic dye.', 0.01, 1.0, 36, 1, 1),
('Prism Violet', 'CI 60730', '81-48-1', 6, 7500.00, 'kg', 'Rich violet cosmetic dye.', 0.01, 1.0, 36, 1, 1),
('Alizarine Purple', 'CI 58005', '4430-18-6', 6, 7000.00, 'kg', 'Deep purple acid dye.', 0.01, 1.0, 36, 1, 1),
('Chlorophyll', 'CI 75810', '1406-65-1', 6, 1700.00, 'kg', 'Natural green plant pigment.', 0.01, 2.0, 18, 1, 1),
('Koelron Brown', 'CI 77491', NULL, 6, 4900.00, 'kg', 'Iron oxide brown blend.', 0.1, 5.0, 36, 1, 1),
('Solvent Yellow 18', 'CI 12055', '6358-85-6', 6, 2000.00, 'kg', 'Oil-soluble yellow dye.', 0.01, 0.5, 36, 1, 1),
('Iron Oxide Red', 'CI 77491', '1309-37-1', 6, 450.00, 'kg', 'Natural mineral red pigment.', 0.1, 10.0, 36, 1, 1),
('Iron Oxide Yellow', 'CI 77492', '51274-00-1', 6, 480.00, 'kg', 'Natural mineral yellow pigment.', 0.1, 10.0, 36, 1, 1);

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Frankincense Essential Oil', 'Boswellia Carterii Oil', '8016-36-2', 7, 2882.01, 'kg', 'Ancient aromatic resin oil. Anti-aging properties.', 0.1, 2.0, 36, 1, 1),
('Lavandin Essential Oil', 'Lavandula Hybrida Oil', '8022-15-9', 7, 3066.11, 'kg', 'Hybrid lavender oil. Cost-effective alternative.', 0.1, 2.0, 24, 1, 1),
('Lime Essential Oil', 'Citrus Aurantifolia Oil', '8008-26-2', 7, 2300.00, 'kg', 'Fresh citrus essential oil.', 0.1, 1.0, 12, 1, 1),
('Neem Oil', 'Azadirachta Indica Seed Oil', '8002-65-1', 7, 450.00, 'kg', 'Traditional medicinal oil. Antimicrobial.', 0.5, 10.0, 18, 1, 1),
('Palmarosa Essential Oil', 'Cymbopogon Martini Oil', '8014-19-5', 7, 2225.00, 'kg', 'Sweet rose-like essential oil.', 0.1, 2.0, 24, 1, 1),
('Vetiver Essential Oil', 'Vetiveria Zizanoides Root Oil', '8016-96-4', 7, 3500.00, 'kg', 'Deep earthy grounding oil. Excellent fixative.', 0.1, 2.0, 36, 1, 1);

INSERT INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, unit_of_measure, description, usage_rate_min, usage_rate_max, shelf_life_months, us_approved, eu_approved) VALUES 
('Saffron Extract', 'Crocus Sativus Flower Extract', '84604-17-1', 3, 134178.12, 'kg', 'Precious botanical. Powerful antioxidant and brightening.', 0.01, 1.0, 12, 1, 1),
('Campo Songyi Mushroom Extract', 'Tricholoma Matsutake Extract', NULL, 3, 20501.53, 'kg', 'Premium mushroom extract. Antioxidant rich.', 0.5, 5.0, 12, 1, 1),
('Papaya Fruit Extract', 'Carica Papaya Fruit Extract', '84012-30-6', 3, 900.00, 'kg', 'Enzyme-rich extract. Gentle exfoliation.', 0.5, 5.0, 18, 1, 1);

COMMIT;
