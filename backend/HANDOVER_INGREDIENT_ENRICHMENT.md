# INGREDIENT ENRICHMENT PROJECT - HANDOVER DOCUMENT
**Date:** November 30, 2025  
**Status:** HIGH Priority Complete (7/55), MEDIUM Priority Ready to Start (10/55)  
**Project:** Swati Soaps Formulation Management System - Ingredient Database Enrichment  

---

## EXECUTIVE SUMMARY

**Goal:** Enrich ingredient database with complete data from public sources (INCI, CAS, usage rates, storage, etc.) for all 55 unique ingredients (21 existing + 34 from Excel import).

**Current Progress:**
- ✅ Deduplication complete (55 unique ingredients identified)
- ✅ Completeness analysis complete  
- ✅ HIGH priority enrichment complete (7 ingredients - fully enriched)
- 🔄 MEDIUM priority ready (10 ingredients - need enrichment)
- ⏳ LOW priority pending (17 ingredients)
- ⏳ DB_ONLY enrichment pending (21 ingredients - need usage rates only)

**Next Action:** Continue enriching MEDIUM priority ingredients, then generate SQL INSERT/UPDATE statements.

---

## 1. PROJECT CONTEXT

### 1.1 Background
User uploaded Excel file with 12 soap formulations containing 34 unique ingredients not in database. Existing database has 21 ingredients with basic data but missing usage rates. Total: 55 unique ingredients need complete enrichment.

### 1.2 Key Files (All on Server)

**Server Location:** `~/swati-soaps-formulation-system/backend/`

| File | Location | Purpose |
|------|----------|---------|
| Database | `swati_soaps.db` | SQLite database |
| Backend Code | `app.py` | Flask API (1966 lines) |
| SRS Document | Check Git repo | Requirements doc |
| Excel Source | `/mnt/user-data/uploads/Globalbees_75_gram_soap_costing_June_2025.xlsx` | 12 formulations, 34 ingredients |
| Progress Doc | `ENRICHMENT_PROGRESS.md` | Status tracking |
| This Handover | `HANDOVER_INGREDIENT_ENRICHMENT.md` | You're reading it |

### 1.3 Git Repository
All code is version controlled. Use:
```bash
cd ~/swati-soaps-formulation-system/backend
git log --oneline -10  # View recent commits
git status             # Check current state
```

---

## 2. WHAT'S BEEN COMPLETED

### 2.1 Phase 1: Deduplication ✅

**Process Used:**
1. Downloaded 21 existing ingredients from database to Claude
2. Extracted 34 ingredients from Excel file in Claude  
3. Deduplicated using case-insensitive name matching
4. Created unified list of 55 unique ingredients

**Result:** Unified ingredient list with source tracking (DB_ONLY, EXCEL_ONLY, BOTH)

### 2.2 Phase 2: Completeness Analysis ✅

**Critical Fields Analyzed (10 total):**
- inci_name, cas_number, category_id, storage_conditions, shelf_life_months
- usage_rate_min, usage_rate_max, hsn_code, landed_cost_net_gst, supplier_id

**Findings:**
- HIGH priority (10+ uses): 7 ingredients - 0% complete
- MEDIUM priority (5-9 uses): 10 ingredients - 0% complete  
- LOW priority (1-4 uses): 17 ingredients - 0% complete
- DB_ONLY (0 uses): 21 ingredients - 80.5% complete (missing only usage rates)

### 2.3 Phase 3: HIGH Priority Enrichment ✅

**Completed 7 Ingredients:**

| Name | INCI | CAS | Category | Usage % | Fields |
|------|------|-----|----------|---------|--------|
| KAD | Kojic Dipalmitate | 79725-98-7 | Skin Brightening | 1-5 | 18 |
| Sodium PCA | Sodium PCA | 28874-51-3 | Humectant | 1-5 | 16 |
| Tinopol CBSX | Disodium 2,2'-([1,1'-Biphenyl]...) | 27344-41-8 | Optical Brightener | 0.05-1 | 17 |
| Tinoguard TT | Pentaerythrityl Tetra-di-t-butyl... | N/A | Antioxidant | 0.1-1 | 14 |
| EDTA | Disodium EDTA | 139-33-3 | Chelating Agent | 0.1-0.5 | 13 |
| Vitamin E | Tocopherol | 59-02-9 | Antioxidant/Vitamin | 0.5-5 | 18 |
| Olivum 300 | Olive Oil PEG-7 Esters | 226708-41-4 | Emulsifier | 0.5-10 | 13 |

**Data Sources Used:**
- SpecialChem.com (primary)
- INCIDecoder.com
- BASF technical datasheets
- LotionCrafter.com
- Various cosmetic ingredient suppliers

---

## 3. DATA FILES IN CLAUDE

**CRITICAL:** These files were created in Claude (previous chat). New chat must recreate them.

### 3.1 File: `/tmp/unified_ingredients.json`

**Purpose:** Master list of all 55 deduplicated ingredients  
**Size:** ~50KB  
**Structure:**
```json
[
  {
    "name": "KAD",
    "source": "EXCEL_ONLY",
    "priority": "HIGH",
    "usage_count": 11,
    "db_id": null,
    "excel_data": {
      "supplier": "Innovission",
      "cost": 2500.0,
      "hsn_code": "",
      "usage_count": 11
    },
    "db_data": {},
    "needs_enrichment": true
  },
  ...
]
```

**How to Recreate:**
1. Download 21 DB ingredients (see Section 5.2)
2. Extract 34 Excel ingredients (see Section 5.3)
3. Deduplicate using case-insensitive name matching
4. Assign priority: HIGH (≥10), MEDIUM (5-9), LOW (1-4), DB_ONLY (0)

### 3.2 File: `/tmp/ingredient_analysis.json`

**Purpose:** Completeness analysis showing which fields are missing  
**Size:** ~30KB  
**Structure:**
```json
[
  {
    "name": "KAD",
    "priority": "HIGH",
    "usage_count": 11,
    "fields_populated": 0,
    "total_fields": 10,
    "completeness_pct": 0,
    "missing_fields": ["inci_name", "cas_number", "category_id", ...]
  },
  ...
]
```

### 3.3 File: `/tmp/high_priority_enrichment.json`

**Purpose:** Complete enrichment data for 7 HIGH priority ingredients  
**Size:** 12KB  
**Status:** ✅ COMPLETE AND VALIDATED

**Structure:**
```json
{
  "enrichment_date": "2025-11-30",
  "priority": "HIGH",
  "ingredients": [
    {
      "name": "KAD",
      "inci_name": "Kojic Dipalmitate",
      "cas_number": "79725-98-7",
      "einecs": "207-922-4",
      "cosing_ref": "34802",
      "chemical_formula": "C37H64O6",
      "category": "Active Ingredients - Skin Brightening",
      "function": "Emollient, Skin Lightening, Tyrosinase Inhibitor",
      "description": "Stable derivative of kojic acid...",
      "usage_rate_min": 1.0,
      "usage_rate_max": 5.0,
      "storage_conditions": "Cool, dry place. Protect from light...",
      "shelf_life_months": 24,
      "appearance": "White to almost white crystalline powder",
      "solubility": "Oil-soluble. Insoluble in water...",
      "formulation_notes": "Add to oil phase at 80-85°C...",
      "safety": "Non-toxic when used at 1-5%...",
      "applications": "Skin whitening creams, serums...",
      "benefits": "Lightens dark spots, evens skin tone...",
      "tags": ["skin_brightening", "anti-aging", "active_ingredient"],
      "source_urls": ["https://www.specialchem.com/..."]
    },
    ...
  ]
}
```

**This file is COMPLETE and ready for SQL generation.**

---

## 4. AGREED METHODOLOGY

### 4.1 Enrichment Process (CRITICAL - Follow Exactly)

**For Each Ingredient:**

1. **Search Public Sources** (use web_search tool in Claude):
   - Primary: SpecialChem.com
   - Secondary: INCIDecoder.com, CosIng database
   - Tertiary: Manufacturer datasheets (BASF, etc.)
   
   Query format: `[Ingredient Name] cosmetic INCI CAS usage rate storage shelf life`

2. **Extract Required Fields:**
   - INCI name (standardized cosmetic nomenclature)
   - CAS number (Chemical Abstracts Service)
   - EINECS/ELINCS number (European inventory)
   - COSING REF number (EU cosmetic ingredient database)
   - Chemical formula (if available)
   - Category (function-based: Oils, Humectants, Actives, etc.)
   - Function (what it does)
   - Description (1-2 sentences)
   - Usage rate min/max (percentage in formulations)
   - Storage conditions (temperature, light, humidity)
   - Shelf life (months)
   - Appearance (physical form/color)
   - Solubility (water/oil soluble)
   - Safety notes (allergies, irritation, limits)
   - Applications (product types)
   - Benefits (consumer benefits)
   - Tags (keywords for search)
   - Source URLs (for verification)

3. **Store in Structured JSON:**
```json
   {
     "name": "...",
     "inci_name": "...",
     "cas_number": "...",
     ...
   }
```

4. **Quality Check:**
   - INCI and CAS must be present (non-negotiable)
   - Usage rates critical for safety
   - Cross-reference multiple sources if data conflicts

### 4.2 Prioritization (ALREADY DETERMINED)

**Do NOT re-prioritize. Use this exact order:**

1. **HIGH (7 ingredients)** - ✅ DONE
2. **MEDIUM (10 ingredients)** - 🔄 NEXT
3. **LOW (17 ingredients)** - ⏳ Later
4. **DB_ONLY (21 ingredients)** - ⏳ Last (only need usage rates)

### 4.3 Data Storage

**All work stays in Claude until SQL generation:**
- Do NOT update database during enrichment
- Store enriched data in JSON files
- Generate SQL only after enrichment complete
- User executes SQL on server

---

## 5. EXACT NEXT STEPS

### 5.1 Start New Chat - Setup

**In new chat, say:**
```
I'm continuing ingredient enrichment work. Please read:
1. /home/swatisoaps/swati-soaps-formulation-system/backend/HANDOVER_INGREDIENT_ENRICHMENT.md
2. /home/swatisoaps/swati-soaps-formulation-system/backend/ENRICHMENT_PROGRESS.md

Then confirm you understand the project and are ready to continue.
```

### 5.2 Recreate Base Data - Get DB Ingredients

**Run on server:**
```bash
cd ~/swati-soaps-formulation-system/backend
sqlite3 swati_soaps.db << 'SQL' > /tmp/db_ingredients_export.json
.mode json
SELECT id, name, inci_name, cas_number, category_id, supplier_id,
       landed_cost_net_gst, hsn_code, storage_conditions, shelf_life_months,
       usage_rate_min, usage_rate_max, notes
FROM ingredients
ORDER BY id;
SQL

cat /tmp/db_ingredients_export.json
```

**Copy output to new chat.**

### 5.3 Recreate Base Data - Extract Excel Ingredients

**Use file:** `/mnt/user-data/uploads/Globalbees_75_gram_soap_costing_June_2025.xlsx`

**Python code to extract (already tested):**
```python
import openpyxl
from collections import defaultdict

file_path = '/mnt/user-data/uploads/Globalbees_75_gram_soap_costing_June_2025.xlsx'
wb = openpyxl.load_workbook(file_path, data_only=True)

excel_ingredients = defaultdict(lambda: {
    'name': '', 'supplier': '', 'hsn_code': '', 
    'cost': 0, 'usage_count': 0
})

for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    
    # Find ingredients (after "PARTICULARS" row)
    ingredient_start = None
    for idx, row in enumerate(ws.iter_rows(values_only=True), 1):
        if row[0] and 'particulars' in str(row[0]).lower():
            ingredient_start = idx + 1
            break
    
    if ingredient_start:
        for row in ws.iter_rows(min_row=ingredient_start, values_only=True):
            name = row[0]
            supplier = row[1]
            hsn = row[3]
            cost = row[5]
            
            if not name or 'total' in str(name).lower():
                break
            
            key = str(name).strip().lower()
            if not excel_ingredients[key]['name']:
                excel_ingredients[key]['name'] = str(name).strip()
                excel_ingredients[key]['supplier'] = str(supplier or '')
                excel_ingredients[key]['hsn_code'] = str(hsn or '')
                excel_ingredients[key]['cost'] = float(cost or 0)
            excel_ingredients[key]['usage_count'] += 1

# Result: 34 unique ingredients
```

### 5.4 Load HIGH Priority Enrichment (DONE)

**HIGH priority enrichment is COMPLETE.** File structure in Section 3.3.

**Create this file in new chat:**
```bash
# Copy the structure from Section 3.3
# All 7 ingredients fully enriched
# Ready for SQL generation
```

### 5.5 Enrich MEDIUM Priority (NEXT ACTION)

**10 Ingredients to Enrich:**

| Name | Usage | Category (estimate) |
|------|-------|---------------------|
| Glutathione | 8 | Active - Antioxidant |
| Arbutin | 8 | Active - Skin Brightening |
| Niacinamide | 7 | Active - Vitamin |
| SOAP base | 6 | Soap Base |
| Vitamin C (SAP) | 5 | Active - Vitamin |
| TiO2 | 5 | Pigment/UV Filter |
| Mushroom extract | 5 | Botanical Extract |
| Golden beauty | 5 | (Unknown - research) |
| SOAP NOODLES | 5 | Soap Base |
| Songi mushroom | 5 | Botanical Extract |

**For EACH ingredient:**
1. Search: `[Name] cosmetic INCI CAS usage rate storage shelf life`
2. Extract all fields (see Section 4.1 step 2)
3. Add to JSON structure (same as HIGH priority)
4. Save to `/tmp/medium_priority_enrichment.json`

**Search queries to use:**
- `Glutathione cosmetic INCI CAS usage rate antioxidant`
- `Arbutin cosmetic INCI CAS usage rate skin brightening`
- `Niacinamide cosmetic INCI CAS usage rate vitamin B3`
- `SOAP base ingredients composition usage cosmetic`
- `Sodium Ascorbyl Phosphate SAP vitamin C INCI CAS usage`
- `Titanium Dioxide TiO2 cosmetic INCI CAS usage sunscreen`
- `Mushroom extract cosmetic INCI skin care active`
- `Golden beauty ingredient cosmetic` (may need multiple searches)
- `Soap noodles composition manufacturing cosmetic`
- `Songi mushroom extract cosmetic INCI`

### 5.6 Generate SQL Statements

**After all enrichment complete, create SQL for database updates.**

**For NEW ingredients (34 from Excel):**
```sql
INSERT INTO ingredients (
    name, inci_name, cas_number, category_id, supplier_id,
    landed_cost_net_gst, hsn_code, storage_conditions, shelf_life_months,
    usage_rate_min, usage_rate_max, stock_status, unit_of_measure,
    created_at, updated_at
) VALUES
('KAD', 'Kojic Dipalmitate', '79725-98-7', [category_id], [supplier_id],
 2500.0, '', 'Cool, dry place. Protect from light.', 24,
 1.0, 5.0, 'in_stock', 'kg',
 datetime('now'), datetime('now'));
```

**For existing ingredients (21 from DB) - UPDATE only usage rates:**
```sql
UPDATE ingredients 
SET usage_rate_min = 0.5,
    usage_rate_max = 5.0,
    updated_at = datetime('now')
WHERE id = 13;  -- Tea Tree Oil
```

**Category Mapping (IMPORTANT):**
Query database first to get category IDs:
```sql
SELECT id, name FROM categories;
```

Map enriched categories to DB category IDs. Create new categories if needed:
```sql
INSERT INTO categories (name, created_at) 
VALUES ('Active Ingredients', datetime('now'));
```

---

## 6. DATABASE SCHEMA REFERENCE

### 6.1 Ingredients Table Structure
```sql
CREATE TABLE ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    inci_name TEXT,
    cas_number TEXT,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    supplier_id INTEGER,
    landed_cost_net_gst REAL,
    hsn_code TEXT,
    stock_status TEXT DEFAULT 'in_stock',
    unit_of_measure TEXT DEFAULT 'kg',
    minimum_order_qty REAL,
    shelf_life_months INTEGER,
    storage_conditions TEXT,
    usage_rate_min REAL,
    usage_rate_max REAL,
    description TEXT,
    notes TEXT,
    us_approved BOOLEAN DEFAULT 1,
    eu_approved BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
```

### 6.2 Categories Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Existing Categories (query to verify):**
```sql
SELECT id, name FROM categories;
```

Expected:
1. Oils
2. Butters  
3. Surfactants
5. Botanicals
6. Essential Oils
9. Preservatives
11. Surfactants (alt)
14. Humectants
17. Uncategorized (created during failed import)

**May need to add:**
- Active Ingredients
- Vitamins
- Antioxidants
- Pigments
- Chelating Agents
- Optical Brighteners
- Emulsifiers

### 6.3 Tags System
```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredient_tags (
    ingredient_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (ingredient_id, tag_id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

**Predefined Tags:**
- soaps, cosmetics, both, premium, organic, vegan, bestseller, new, seasonal, luxury

**Will need to add functional tags:**
- skin_brightening, anti_aging, humectant, antioxidant, active_ingredient, etc.

---

## 7. KEY DECISIONS MADE

### 7.1 No Separation Between Sources
All 55 ingredients treated equally. No distinction between "Excel" vs "DB" ingredients during enrichment. Single unified approach.

### 7.2 Enrichment in Claude, Not Server
All research and data compilation happens in Claude. SQL generated last. User executes on server. This prevents partial/broken database states.

### 7.3 Prioritization by Usage Frequency
HIGH (10+), MEDIUM (5-9), LOW (1-4), DB_ONLY (0). Do in this order to maximize impact.

### 7.4 Usage Rates Are Critical
Even for ingredients not used in formulations yet. Required for safety and regulatory compliance.

### 7.5 Multiple Data Sources Required
Cross-reference SpecialChem, INCIDecoder, manufacturer datasheets. If sources conflict, note and use most conservative values.

### 7.6 Tags Are Functional, Not Decorative
Tags should reflect ingredient function (humectant, emollient, active) not marketing (premium, luxury). Makes searching/filtering useful.

---

## 8. TROUBLESHOOTING

### 8.1 If Web Search Doesn't Find Ingredient

**Try variations:**
- Common name vs chemical name
- Trade name vs generic (e.g., "Olivum 300" vs "Olive Oil PEG-7 Esters")
- Add manufacturer (e.g., "BASF Tinoguard TT")
- Search for related ingredients in same category

**If still not found:**
- Mark as "needs_manual_research"
- Use category/function inference from similar ingredients
- Flag for user review

### 8.2 If CAS Number Has Multiple Variants

Example: Tea Tree Oil has 3 CAS numbers (85085-48-9, 8022-72-8, 68647-73-4)

**Solution:** List all CAS numbers in notes. Use primary/most common in cas_number field.

### 8.3 If Usage Rate Varies Widely

Example: Olivum 300 (0.5-10% depending on function)

**Solution:** Use widest safe range. Note specific ranges in formulation_notes field.

### 8.4 Categories Don't Match Database

**Solution:** 
1. Query current categories first
2. Map enriched category to closest existing
3. If no match, create new category in SQL
4. Document mapping in notes

---

## 9. SUCCESS CRITERIA

**Project is complete when:**

✅ All 55 ingredients have:
- INCI name
- CAS number  
- Category assigned
- Usage rate min/max
- Storage conditions
- Shelf life

✅ SQL statements generated and validated

✅ User executes SQL successfully

✅ Database queries show:
```sql
SELECT COUNT(*) FROM ingredients WHERE inci_name IS NOT NULL;  -- Should be 55
SELECT COUNT(*) FROM ingredients WHERE cas_number IS NOT NULL; -- Should be 55
SELECT COUNT(*) FROM ingredients WHERE usage_rate_min IS NOT NULL; -- Should be 55
```

✅ Formulations can be created using enriched ingredients

---

## 10. FILES TO COMMIT TO GIT

**Before SQL execution:**
- `ENRICHMENT_PROGRESS.md` (status tracking)
- `HANDOVER_INGREDIENT_ENRICHMENT.md` (this document)
- Any helper scripts created

**After SQL execution:**
- `enrichment_complete_[date].sql` (the executed SQL)
- `ENRICHMENT_COMPLETE.md` (final summary)

**Commit message template:**
```bash
git commit -m "Ingredient enrichment: [PRIORITY] priority complete ([X]/55 ingredients)"
git push origin main
```

---

## 11. CONTACT & QUESTIONS

**User Preferences:**
- Rajiv prefers detailed, comprehensive solutions
- Likes building complex software systematically  
- Values complete documentation
- Working on production system (deployed at http://165.22.222.87)

**If Stuck:**
- Document the issue clearly
- Show what's been tried
- Ask specific questions
- User will provide guidance

---

## APPENDIX A: MEDIUM PRIORITY INGREDIENT LIST

**Ready for enrichment (10 ingredients):**

1. **Glutathione** - Usage: 8 formulations
2. **Arbutin** - Usage: 8 formulations
3. **Niacinamide** - Usage: 7 formulations
4. **SOAP base** - Usage: 6 formulations
5. **Vitamin C (SAP)** - Usage: 5 formulations
6. **TiO2** - Usage: 5 formulations
7. **Mushroom extract** - Usage: 5 formulations
8. **Golden beauty** - Usage: 5 formulations
9. **SOAP NOODLES** - Usage: 5 formulations
10. **Songi mushroom** - Usage: 5 formulations

---

## APPENDIX B: EXAMPLE ENRICHMENT (KAD)

**Full example showing all required fields:**
```json
{
  "name": "KAD",
  "full_name": "Kojic Acid Dipalmitate",
  "inci_name": "Kojic Dipalmitate",
  "cas_number": "79725-98-7",
  "einecs": "207-922-4",
  "cosing_ref": "34802",
  "chemical_formula": "C37H64O6",
  "category": "Active Ingredients - Skin Brightening",
  "function": "Emollient, Skin Lightening, Tyrosinase Inhibitor",
  "description": "Stable derivative of kojic acid used for skin brightening and hyperpigmentation treatment. Inhibits melanin formation by blocking tyrosinase activity.",
  "usage_rate_min": 1.0,
  "usage_rate_max": 5.0,
  "storage_conditions": "Cool, dry place. Protect from light and heat. Store at 15-25°C.",
  "shelf_life_months": 24,
  "appearance": "White to almost white crystalline powder",
  "solubility": "Oil-soluble. Insoluble in water. Requires isopropyl palmitate or isopropyl myristate for formulation.",
  "formulation_notes": "Add to oil phase at 80-85°C. Can precipitate; add isopropyl palmitate/myristate to prevent crystallization.",
  "safety": "Non-toxic when used at 1-5%. Higher concentrations may cause irritation. Patch test recommended.",
  "applications": "Skin whitening creams, serums, lotions, anti-aging products, melasma treatment",
  "benefits": "Lightens dark spots, evens skin tone, reduces hyperpigmentation, anti-aging",
  "tags": ["skin_brightening", "anti-aging", "active_ingredient", "oil_soluble"],
  "source_urls": ["https://www.specialchem.com/cosmetics/inci-ingredients/kojic-dipalmitate"]
}
```

**Use this as template for all enrichments.**

---

## END OF HANDOVER DOCUMENT

**Next chat should:**
1. Read this document
2. Read ENRICHMENT_PROGRESS.md
3. Recreate data files (Section 5)
4. Continue with MEDIUM priority enrichment (Section 5.5)
5. Generate SQL when complete (Section 5.6)

**Good luck! The methodology is proven and the HIGH priority results are excellent.** 🚀

---
**Document Version:** 1.0  
**Last Updated:** 2025-11-30  
**Created By:** Claude (Sonnet 4.5) in conversation with Rajiv
