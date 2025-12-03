-- SWATI SOAPS - SAFE IMPORT SCRIPT
-- Essential Oils & Fragrances with EU Classification + Scent Profiles

-- PART 1: UPDATE EXISTING 4 ESSENTIAL OILS WITH SCENT DATA

UPDATE ingredient_marketing 
SET scent_profile = 'Sweet floral with herbaceous undertones, calming',
    scent_family = 'Floral',
    benefits = 'Calming, promotes sleep, antiseptic, anti-inflammatory, balances skin'
WHERE ingredient_id = (SELECT id FROM ingredients WHERE name = 'Lavender Oil');

UPDATE ingredient_marketing 
SET scent_profile = 'Fresh, medicinal, camphoraceous, slightly spicy',
    scent_family = 'Herbal-Medicinal',
    benefits = 'Antimicrobial, antifungal, treats acne, soothes skin irritation, natural disinfectant'
WHERE ingredient_id = (SELECT id FROM ingredients WHERE name = 'Tea Tree Oil');

UPDATE ingredient_marketing 
SET scent_profile = 'Strong, sharp, cool minty with sweet undertones',
    scent_family = 'Herbal-Medicinal',
    benefits = 'Cooling sensation, relieves headaches, improves focus, soothes muscle pain, antimicrobial'
WHERE ingredient_id = (SELECT id FROM ingredients WHERE name = 'Peppermint Oil');

UPDATE ingredient_marketing 
SET scent_profile = 'Sweet, herbaceous, slightly spicy with anise notes',
    scent_family = 'Herbal',
    benefits = 'Mental clarity, relieves muscle tension, antibacterial, insect repellent'
WHERE ingredient_id = (SELECT id FROM ingredients WHERE name = 'Basil Essential Oil');

-- PART 2: CITRUS ESSENTIAL OILS (Category 7)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Bergamot Essential Oil', 'Citrus Aurantium Bergamia Fruit Oil', '8007-75-8', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75159', '282-280-1', 1, 1, 'Phototoxic - max 0.4% in leave-on products' FROM ingredients WHERE name = 'Bergamot Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Uplifting, stress relief, antibacterial, balances oily skin', 'Soaps, perfumes, skincare', 'Fresh citrus with subtle floral undertones, slightly spicy', 'Citrus' FROM ingredients WHERE name = 'Bergamot Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lemon Essential Oil', 'Citrus Limon Peel Oil', '8008-56-8', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79358', '284-515-8', 1, 1, 'Phototoxic - max 2% in leave-on products' FROM ingredients WHERE name = 'Lemon Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Brightening, cleansing, energizing, antibacterial, astringent', 'Soaps, cleansers, household products', 'Sharp, fresh, clean citrus scent', 'Citrus' FROM ingredients WHERE name = 'Lemon Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lime Essential Oil', 'Citrus Aurantifolia Oil', '8008-26-2', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79360', '282-283-8', 1, 1, 'Phototoxic if cold-pressed - max 0.7% in leave-on products' FROM ingredients WHERE name = 'Lime Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Refreshing, uplifting, cleansing, antibacterial', 'Soaps, bath products, perfumes', 'Zesty, sharp, green citrus with slight sweetness', 'Citrus' FROM ingredients WHERE name = 'Lime Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Orange Essential Oil', 'Citrus Aurantium Dulcis Peel Oil', '8008-57-9', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79805', '232-433-8', 1, 1, 'Generally safe - mild phototoxicity' FROM ingredients WHERE name = 'Orange Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Uplifting, calming, cleansing, promotes positivity', 'Soaps, diffusers, skincare', 'Sweet, fresh, fruity orange peel aroma', 'Citrus' FROM ingredients WHERE name = 'Orange Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Mandarin Essential Oil', 'Citrus Nobilis Peel Oil', '8008-31-9', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79377', '284-521-0', 1, 1, 'Low phototoxicity risk' FROM ingredients WHERE name = 'Mandarin Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Calming, gentle, suitable for sensitive skin, uplifting', 'Baby products, soaps, skincare', 'Sweet, soft, tangy citrus - gentler than orange', 'Citrus' FROM ingredients WHERE name = 'Mandarin Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lemongrass Essential Oil', 'Cymbopogon Schoenanthus Oil', '8007-02-1', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79356', '289-752-0', 1, 1, 'May cause skin sensitization - max 0.7% in leave-on' FROM ingredients WHERE name = 'Lemongrass Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Deodorizing, antibacterial, insect repellent, energizing', 'Soaps, deodorants, household cleaners', 'Strong lemony, grassy, herbaceous scent', 'Citrus-Herbal' FROM ingredients WHERE name = 'Lemongrass Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Grapefruit Essential Oil', 'Citrus Paradisi Peel Oil', '8016-20-4', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79271', '289-904-6', 1, 1, 'Phototoxic - max 4% in leave-on products' FROM ingredients WHERE name = 'Grapefruit Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Energizing, uplifting, cleansing, cellulite reduction', 'Soaps, body care, aromatherapy', 'Fresh, tangy, sweet-tart citrus', 'Citrus' FROM ingredients WHERE name = 'Grapefruit Essential Oil';

-- PART 3: FLORAL ESSENTIAL OILS

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lavandin Essential Oil', 'Lavandula Hybrida Oil', '8022-15-9', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79352', '294-470-6', 1, 1, 'Generally safe - similar to lavender' FROM ingredients WHERE name = 'Lavandin Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Relaxing, deodorizing, antimicrobial, cost-effective lavender alternative', 'Soaps, detergents, household products', 'Similar to lavender but sharper, more camphoraceous', 'Floral' FROM ingredients WHERE name = 'Lavandin Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rose Damask Absolute', 'Rosa Damascena Flower Oil', '8007-01-0', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '88270', '290-260-3', 1, 1, 'Generally safe - premium ingredient' FROM ingredients WHERE name = 'Rose Damask Absolute';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-aging, moisturizing, balances skin, emotional wellness, luxury ingredient', 'Premium soaps, high-end skincare, perfumes', 'Rich, deep, honey-sweet floral with spicy undertones', 'Floral' FROM ingredients WHERE name = 'Rose Damask Absolute';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rose Geranium Essential Oil', 'Pelargonium Graveolens Oil', '8000-46-2', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79262', '290-140-0', 1, 1, 'Generally safe - may cause sensitization in some' FROM ingredients WHERE name = 'Rose Geranium Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Balances hormones, anti-inflammatory, insect repellent, skin balancing', 'Soaps, skincare, perfumes', 'Rose-like floral with minty, citrusy undertones', 'Floral' FROM ingredients WHERE name = 'Rose Geranium Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Geranium Essential Oil', 'Pelargonium Graveolens Flower Oil', '8000-46-2', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79262', '290-140-0', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Geranium Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Skin balancing, astringent, promotes cellular regeneration', 'Soaps, skincare, perfumes', 'Sweet floral with green, slightly minty notes', 'Floral' FROM ingredients WHERE name = 'Geranium Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Ylang Ylang Essential Oil', 'Cananga Odorata Flower Oil', '8006-81-3', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '97067', '283-461-2', 1, 1, 'May cause sensitization - use at low levels' FROM ingredients WHERE name = 'Ylang Ylang Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Aphrodisiac, calming, balances sebum, promotes hair growth', 'Perfumes, soaps, hair care', 'Intensely sweet, exotic floral with fruity, spicy notes', 'Floral' FROM ingredients WHERE name = 'Ylang Ylang Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Neroli Essential Oil', 'Citrus Aurantium Amara Flower Oil', '8016-38-4', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79756', '277-143-2', 1, 1, 'Generally safe - premium ingredient' FROM ingredients WHERE name = 'Neroli Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-aging, reduces scars, calming, promotes cell regeneration, luxury ingredient', 'Premium skincare, perfumes, aromatherapy', 'Sweet, honeyed floral with citrus undertones', 'Floral' FROM ingredients WHERE name = 'Neroli Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Chamomile Essential Oil', 'Chamomilla Recutita Flower Oil', '8002-66-2', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75531', '284-365-3', 1, 1, 'Generally safe - avoid if allergic to ragweed' FROM ingredients WHERE name = 'Chamomile Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Calming, anti-inflammatory, soothes sensitive skin, promotes sleep', 'Baby products, sensitive skin care, soaps', 'Sweet, apple-like, herbaceous floral', 'Floral' FROM ingredients WHERE name = 'Chamomile Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Palmarosa Essential Oil', 'Cymbopogon Martini Oil', '8014-19-5', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '76918', '287-404-2', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Palmarosa Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Hydrating, balances sebum, antimicrobial, rose-like alternative', 'Skincare, soaps, perfumes', 'Sweet, floral, rose-like with grassy notes', 'Floral' FROM ingredients WHERE name = 'Palmarosa Essential Oil';

-- PART 4: HERBAL/MEDICINAL ESSENTIAL OILS

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Eucalyptus Essential Oil', 'Eucalyptus Globulus Leaf Oil', '8000-48-4', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '78295', '283-406-2', 1, 1, 'Avoid with children under 10 - contains eucalyptol' FROM ingredients WHERE name = 'Eucalyptus Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Decongestant, antimicrobial, cooling, invigorating, insect repellent', 'Cold remedies, soaps, household cleaners', 'Strong, fresh, camphoraceous, minty-cool', 'Herbal-Medicinal' FROM ingredients WHERE name = 'Eucalyptus Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Spearmint Essential Oil', 'Mentha Viridis Leaf Oil', '8008-79-5', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '82529', '284-489-8', 1, 1, 'Generally safe - milder than peppermint' FROM ingredients WHERE name = 'Spearmint Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Milder cooling, refreshing, digestive aid, antimicrobial', 'Oral care, soaps, food flavoring', 'Sweet, fresh minty - softer than peppermint', 'Herbal-Medicinal' FROM ingredients WHERE name = 'Spearmint Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rosemary Essential Oil', 'Rosmarinus Officinalis Leaf Oil', '8000-25-7', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '88273', '283-291-9', 1, 1, 'Avoid during pregnancy and with epilepsy' FROM ingredients WHERE name = 'Rosemary Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Stimulates hair growth, improves memory, antimicrobial, antioxidant', 'Hair care, soaps, aromatherapy', 'Fresh, herbaceous, woody with camphoraceous notes', 'Herbal' FROM ingredients WHERE name = 'Rosemary Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Neem Essential Oil', 'Azadirachta Indica Seed Oil', '8002-65-1', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '74932', '281-117-2', 1, 1, 'Not for internal use' FROM ingredients WHERE name = 'Neem Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Antifungal, antibacterial, treats dandruff, insect repellent, treats skin conditions', 'Medicated soaps, hair care, pest control', 'Strong, pungent, garlic-like, sulfurous', 'Herbal-Medicinal' FROM ingredients WHERE name = 'Neem Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Turmeric Essential Oil', 'Curcuma Longa Root Oil', '8024-37-1', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '76866', '283-882-9', 1, 1, 'May stain skin yellow - patch test recommended' FROM ingredients WHERE name = 'Turmeric Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-inflammatory, brightening, antioxidant, treats acne, wound healing', 'Brightening soaps, traditional skincare', 'Warm, spicy, earthy with ginger-like notes', 'Spicy-Earthy' FROM ingredients WHERE name = 'Turmeric Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Camphor Essential Oil', 'Cinnamomum Camphora Bark Oil', '8008-51-3', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75528', '232-475-7', 1, 1, 'Toxic in large amounts - use at low levels' FROM ingredients WHERE name = 'Camphor Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Cooling, decongestant, pain relief, insect repellent', 'Medicinal products, balms, soaps', 'Strong, penetrating, medicinal, cool', 'Herbal-Medicinal' FROM ingredients WHERE name = 'Camphor Essential Oil';

-- PART 5: WOODY AND SPICY ESSENTIAL OILS

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Cedarwood Essential Oil', 'Cedrus Atlantica Bark Oil', '8000-27-9', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75398', '283-366-5', 1, 1, 'Avoid during pregnancy' FROM ingredients WHERE name = 'Cedarwood Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Calming, promotes hair growth, insect repellent, grounding', 'Mens products, soaps, aromatherapy', 'Warm, woody, balsamic with slight sweetness', 'Woody' FROM ingredients WHERE name = 'Cedarwood Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Patchouli Essential Oil', 'Pogostemon Cablin Oil', '8014-09-3', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87236', '282-493-9', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Patchouli Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-aging, anti-inflammatory, grounding, aphrodisiac, treats acne', 'Perfumes, soaps, skincare', 'Deep, earthy, musky with sweet, spicy undertones', 'Woody-Earthy' FROM ingredients WHERE name = 'Patchouli Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Frankincense Essential Oil', 'Boswellia Carterii Oil', '8016-36-2', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75079', '290-492-5', 1, 1, 'Generally safe' FROM ingredients WHERE name = 'Frankincense Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Anti-aging, reduces scars, promotes meditation, anti-inflammatory, cell regeneration', 'Premium skincare, aromatherapy, soaps', 'Warm, balsamic, slightly citrusy, resinous', 'Woody-Resinous' FROM ingredients WHERE name = 'Frankincense Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Juniper Berry Essential Oil', 'Juniperus Communis Fruit Oil', '8012-91-7', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '79329', '283-268-3', 1, 1, 'Avoid during pregnancy and kidney disease' FROM ingredients WHERE name = 'Juniper Berry Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Detoxifying, antiseptic, grounding, relieves muscle pain', 'Detox products, soaps, aromatherapy', 'Fresh, woody, slightly fruity, pine-like', 'Woody' FROM ingredients WHERE name = 'Juniper Berry Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Cinnamon Essential Oil', 'Cinnamomum Zeylanicum Bark Oil', '8015-91-6', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '75723', '283-479-0', 1, 1, 'Strong sensitizer - max 0.01% in leave-on products' FROM ingredients WHERE name = 'Cinnamon Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Warming, antimicrobial, improves circulation, aphrodisiac', 'Warming soaps, massage oils, aromatherapy', 'Warm, sweet, spicy - classic cinnamon bark scent', 'Spicy' FROM ingredients WHERE name = 'Cinnamon Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Clove Essential Oil', 'Eugenia Caryophyllus Bud Oil', '8000-34-8', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '78295', '284-638-7', 1, 1, 'Strong sensitizer - max 0.5% in products' FROM ingredients WHERE name = 'Clove Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Analgesic, antimicrobial, warming, dental care, antioxidant', 'Dental products, warming soaps, aromatherapy', 'Strong, warm, spicy, slightly sweet and woody', 'Spicy' FROM ingredients WHERE name = 'Clove Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Black Pepper Essential Oil', 'Piper Nigrum Fruit Oil', '8006-82-4', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87531', '284-524-7', 1, 1, 'May cause skin irritation at high concentrations' FROM ingredients WHERE name = 'Black Pepper Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Warming, improves circulation, muscle relaxation, energizing', 'Sports products, warming soaps, aromatherapy', 'Sharp, spicy, warm with woody undertones', 'Spicy' FROM ingredients WHERE name = 'Black Pepper Essential Oil';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Vanilla Essential Oil', 'Vanilla Planifolia Fruit Extract', '8024-06-4', 7, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '96535', '293-791-4', 1, 1, 'Generally safe - usually CO2 extract or absolute' FROM ingredients WHERE name = 'Vanilla Essential Oil';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Calming, aphrodisiac, antioxidant, comforting', 'Soaps, perfumes, aromatherapy', 'Sweet, warm, creamy, comforting vanilla scent', 'Sweet' FROM ingredients WHERE name = 'Vanilla Essential Oil';

-- PART 6: FLORAL FRAGRANCES (Category 8)

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Jasmine Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Jasmine Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Romantic, calming, luxurious scent', 'Soaps, perfumes, cosmetics', 'Intensely sweet, rich floral with musky undertones', 'Floral' FROM ingredients WHERE name = 'Jasmine Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Rose Fragrance (Fasli Gulab)', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Rose Fragrance (Fasli Gulab)';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Romantic, classic, universally loved', 'Premium soaps, perfumes, cosmetics', 'Fresh, dewy rose with green top notes - Indian rose style', 'Floral' FROM ingredients WHERE name = 'Rose Fragrance (Fasli Gulab)';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Roses of Heaven Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Roses of Heaven Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Romantic, luxurious, sophisticated', 'Premium soaps, perfumes', 'Rich, complex rose with powdery, sweet undertones', 'Floral' FROM ingredients WHERE name = 'Roses of Heaven Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lavender Fresh Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Lavender Fresh Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Calming, clean, relaxing', 'Soaps, household products, cosmetics', 'Fresh, clean lavender with herbal notes', 'Floral-Herbal' FROM ingredients WHERE name = 'Lavender Fresh Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Champa Millenium Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Champa Millenium Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Spiritual, calming, traditional Indian', 'Traditional soaps, incense-style products', 'Rich, sweet floral with sandalwood and musk notes', 'Floral-Oriental' FROM ingredients WHERE name = 'Champa Millenium Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sakura Dream Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Sakura Dream Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Delicate, feminine, romantic, exotic', 'Premium soaps, body care', 'Soft, delicate cherry blossom with powdery notes', 'Floral-Powdery' FROM ingredients WHERE name = 'Sakura Dream Fragrance';

-- PART 7: WOODY/ORIENTAL FRAGRANCES

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Sandalwood Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Sandalwood Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Calming, meditative, luxurious, traditional', 'Premium soaps, perfumes, traditional products', 'Creamy, soft, woody, slightly sweet and milky', 'Woody' FROM ingredients WHERE name = 'Sandalwood Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Oudh Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Oudh Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Luxurious, exotic, long-lasting, premium', 'Premium soaps, luxury perfumes', 'Deep, complex, woody with smoky, animalic notes', 'Woody-Oriental' FROM ingredients WHERE name = 'Oudh Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Khus (Vetiver) Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Khus (Vetiver) Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Cooling, grounding, calming, traditional Indian', 'Traditional soaps, mens products', 'Earthy, smoky, woody with green, cooling undertones', 'Earthy-Woody' FROM ingredients WHERE name = 'Khus (Vetiver) Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Pine Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Pine Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Fresh, clean, invigorating', 'Household cleaners, soaps, mens products', 'Fresh, sharp, resinous pine forest scent', 'Woody-Fresh' FROM ingredients WHERE name = 'Pine Fragrance';

-- PART 8: CITRUS AND FRUITY FRAGRANCES

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Lemon Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Lemon Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Energizing, fresh, clean, uplifting', 'Soaps, household cleaners, dish wash', 'Bright, zesty, fresh lemon scent', 'Citrus' FROM ingredients WHERE name = 'Lemon Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Orange Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Orange Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Uplifting, cheerful, energizing', 'Soaps, household products', 'Sweet, fresh, juicy orange scent', 'Citrus' FROM ingredients WHERE name = 'Orange Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Green Apple Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Green Apple Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Fresh, crisp, youthful, energizing', 'Soaps, shampoos, body care', 'Crisp, fresh, sweet-tart green apple', 'Fruity-Fresh' FROM ingredients WHERE name = 'Green Apple Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Mango Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Mango Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Tropical, exotic, sweet, summery', 'Soaps, body care, tropical products', 'Sweet, juicy, tropical mango fruit', 'Fruity' FROM ingredients WHERE name = 'Mango Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Papaya Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Papaya Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Tropical, fresh, exotic', 'Soaps, body care', 'Sweet, tropical papaya with subtle musky notes', 'Fruity' FROM ingredients WHERE name = 'Papaya Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Peach Nectar Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Peach Nectar Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Sweet, fruity, feminine', 'Soaps, body care, feminine products', 'Juicy, sweet peach with creamy undertones', 'Fruity' FROM ingredients WHERE name = 'Peach Nectar Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Kiwi Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Kiwi Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Fresh, tangy, exotic, energizing', 'Soaps, body care', 'Fresh, sweet-tart kiwi fruit', 'Fruity-Fresh' FROM ingredients WHERE name = 'Kiwi Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Grape Fusion Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Grape Fusion Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Sweet, fruity, refreshing', 'Soaps, body care', 'Sweet, juicy grape with fresh notes', 'Fruity' FROM ingredients WHERE name = 'Grape Fusion Fragrance';

-- PART 9: SWEET/GOURMAND FRAGRANCES

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Vanilla Flower Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Vanilla Flower Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Comforting, warm, sweet, calming', 'Soaps, body care, perfumes', 'Sweet, warm, creamy vanilla', 'Sweet-Gourmand' FROM ingredients WHERE name = 'Vanilla Flower Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Coffee Classic Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Coffee Classic Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Energizing, rich, invigorating', 'Exfoliating soaps, body scrubs', 'Rich, roasted coffee bean aroma', 'Sweet-Gourmand' FROM ingredients WHERE name = 'Coffee Classic Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Coffee Vanilla Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Coffee Vanilla Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Warm, comforting, indulgent', 'Gourmet soaps, body care', 'Creamy vanilla latte, sweet and roasted', 'Sweet-Gourmand' FROM ingredients WHERE name = 'Coffee Vanilla Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Dark Chocolate Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Dark Chocolate Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Indulgent, rich, comforting', 'Luxury soaps, body care', 'Rich, bitter-sweet dark chocolate', 'Sweet-Gourmand' FROM ingredients WHERE name = 'Dark Chocolate Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Butter Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Butter Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Creamy, rich, moisturizing association', 'Moisturizing soaps, body butters', 'Creamy, rich buttery scent', 'Sweet-Gourmand' FROM ingredients WHERE name = 'Butter Fragrance';

-- PART 10: CLEAN/FRESH FRAGRANCES

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Dove Type Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Dove Type Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Clean, fresh, gentle, familiar', 'Beauty bars, gentle soaps', 'Soft, clean, fresh with subtle floral notes', 'Fresh-Clean' FROM ingredients WHERE name = 'Dove Type Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Pears Type Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Pears Type Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Classic, gentle, nostalgic, trusted', 'Transparent soaps, gentle cleansers', 'Classic amber, clean, slightly floral', 'Fresh-Clean' FROM ingredients WHERE name = 'Pears Type Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Baby Powder Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Baby Powder Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Gentle, clean, comforting, baby-safe', 'Baby products, gentle soaps', 'Soft, powdery, clean baby powder scent', 'Fresh-Clean' FROM ingredients WHERE name = 'Baby Powder Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Carbolic Soap Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Carbolic Soap Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Antiseptic association, medicinal, clean', 'Medicated soaps, household cleaners', 'Phenolic, medicinal, clean antiseptic scent', 'Fresh-Medicinal' FROM ingredients WHERE name = 'Carbolic Soap Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Clinical Musk Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Clinical Musk Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Clean, professional, subtle', 'Professional soaps, institutional products', 'Clean musk with subtle fresh notes', 'Fresh-Clean' FROM ingredients WHERE name = 'Clinical Musk Fragrance';
-- PART 11: HERBAL AND DESIGNER FRAGRANCES

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Neem Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Neem Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Herbal, natural, medicinal association', 'Herbal soaps, medicinal products', 'Green, herbal neem with fresh notes', 'Herbal' FROM ingredients WHERE name = 'Neem Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Turmeric Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Turmeric Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Traditional, Ayurvedic, natural', 'Traditional soaps, Ayurvedic products', 'Warm, earthy, spicy turmeric', 'Herbal-Spicy' FROM ingredients WHERE name = 'Turmeric Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Saffron Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Saffron Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Luxurious, traditional, exotic', 'Premium traditional soaps', 'Rich, honey-like, slightly metallic, exotic', 'Oriental' FROM ingredients WHERE name = 'Saffron Fragrance';

INSERT OR IGNORE INTO ingredients (name, inci_name, cas_number, category_id, landed_cost_net_gst, stock_status, unit_of_measure, created_at, updated_at)
VALUES ('Polo Sport Type Fragrance', 'Parfum', NULL, 8, 0, 'in_stock', 'kg', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO ingredient_regulatory (ingredient_id, cosing_ref, einecs, eu_approved, us_approved, safety_notes)
SELECT id, '87175', NULL, 1, 1, 'Fragrance compound - IFRA compliant' FROM ingredients WHERE name = 'Polo Sport Type Fragrance';
INSERT OR IGNORE INTO ingredient_marketing (ingredient_id, benefits, applications, scent_profile, scent_family)
SELECT id, 'Fresh, sporty, masculine, energizing', 'Mens soaps, sports products', 'Fresh, aquatic, ozonic with mint and ginger', 'Fresh-Aquatic' FROM ingredients WHERE name = 'Polo Sport Type Fragrance';

-- PART 12: VERIFICATION QUERIES

SELECT 'Total ingredients by category:';
SELECT c.name, COUNT(i.id) as count FROM categories c LEFT JOIN ingredients i ON c.id = i.category_id GROUP BY c.id ORDER BY c.id;

SELECT 'Essential Oils with scent data:';
SELECT i.name, m.scent_family FROM ingredients i JOIN ingredient_marketing m ON i.id = m.ingredient_id WHERE i.category_id = 7 ORDER BY i.name;

SELECT 'Fragrances with scent data:';
SELECT i.name, m.scent_family FROM ingredients i JOIN ingredient_marketing m ON i.id = m.ingredient_id WHERE i.category_id = 8 ORDER BY i.name;
