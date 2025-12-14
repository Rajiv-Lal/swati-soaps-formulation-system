# SOFTWARE REQUIREMENTS SPECIFICATION
## Swati Soaps Formulation Management System
**Version:** 2.1  
**Date:** December 14, 2025  
**Status:** 97-100% Complete

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Swati Soaps Formulation Management System, a web-based application designed to manage soap and cosmetic formulations, track ingredients, calculate costs, and ensure regulatory compliance.

### 1.2 Scope
The system enables Swati Soaps' manufacturing operations to:
- Manage ingredient inventory with regulatory and technical data
- Create and version formulations
- Calculate production costs automatically
- Track regulatory compliance for multiple markets
- Generate Bills of Materials for production

### 1.3 Definitions
| Term | Definition |
|------|------------|
| Formulation | A recipe containing ingredients with specific percentages |
| INCI | International Nomenclature of Cosmetic Ingredients |
| EINECS | European Inventory of Existing Chemical Substances |
| COSING | EU Cosmetic Ingredient Database |
| SAP Value | Saponification value (mg KOH/g oil) |
| Grammage | Weight of finished product in grams |

---

## 2. Functional Requirements

### 2.1 User Authentication (FR-AUTH)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-AUTH-01 | System shall authenticate users via email/password | ✅ Complete |
| FR-AUTH-02 | System shall issue JWT tokens with 24-hour expiry | ✅ Complete |
| FR-AUTH-03 | System shall support roles: admin, formulator, viewer | ✅ Complete |
| FR-AUTH-04 | System shall track last login timestamp | ✅ Complete |

### 2.2 Ingredient Management (FR-ING)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-ING-01 | System shall store ingredient basic info (name, INCI, CAS) | ✅ Complete |
| FR-ING-02 | System shall store regulatory data (EINECS, COSING, approvals) | ✅ Complete |
| FR-ING-03 | System shall store properties (SAP, hardness, lather coefficients) | ✅ Complete |
| FR-ING-04 | System shall store marketing data (benefits, applications) | ✅ Complete |
| FR-ING-05 | System shall track supplier and cost information | ✅ Complete |
| FR-ING-06 | System shall enforce usage_rate_min and usage_rate_max | ✅ Complete |
| FR-ING-07 | System shall support category/subcategory organization | ✅ Complete |
| FR-ING-08 | System shall prevent deletion of ingredients used in formulations | ✅ Complete |

### 2.3 Formulation Management (FR-FORM)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-FORM-01 | System shall create formulations with product name, type, grammage | ✅ Complete |
| FR-FORM-02 | System shall validate ingredient percentages sum to 100% | ✅ Complete |
| FR-FORM-03 | System shall validate against ingredient usage rate limits | ✅ Complete |
| FR-FORM-04 | System shall warn (not block) for non-EU/US approved ingredients | ✅ Complete |
| FR-FORM-05 | System shall auto-calculate total cost from ingredient prices | ✅ Complete |
| FR-FORM-06 | System shall recalculate costs when formulation is re-saved | ✅ Complete |
| FR-FORM-07 | System shall support formulation duplication | ✅ Complete |
| FR-FORM-08 | System shall support formulation deletion | ✅ Complete |
| FR-FORM-09 | System shall track formulation status (draft, active, archived) | ✅ Complete |

### 2.4 Version Control (FR-VER)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-VER-01 | System shall create new version when ingredients change | ✅ Complete |
| FR-VER-02 | System shall store JSON snapshot of each version | ✅ Complete |
| FR-VER-03 | System shall allow viewing version history | ✅ Complete |
| FR-VER-04 | System shall allow comparing two versions | ✅ Complete |
| FR-VER-05 | System shall allow restoring previous version | ✅ Complete |
| FR-VER-06 | System shall link ingredients to version_id | ✅ Complete |

### 2.5 Cost Calculation (FR-COST)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-COST-01 | System shall calculate cost per piece based on grammage | ✅ Complete |
| FR-COST-02 | System shall use current ingredient prices (not cached) | ✅ Complete |
| FR-COST-03 | System shall display cost per kg and cost per piece | ✅ Complete |
| FR-COST-04 | Formula: cost = (percentage/100) × (grammage/1000) × cost_per_kg | ✅ Complete |

### 2.6 Bill of Materials (FR-BOM)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-BOM-01 | System shall generate BOM for specified quantity | ✅ Complete |
| FR-BOM-02 | System shall apply wastage percentage | ✅ Complete |
| FR-BOM-03 | System shall calculate total material requirements | ✅ Complete |
| FR-BOM-04 | System shall show cost breakdown by ingredient | ✅ Complete |

### 2.7 Search & Filtering (FR-SEARCH)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-SEARCH-01 | System shall search ingredients by name, INCI, CAS | ✅ Complete |
| FR-SEARCH-02 | System shall filter ingredients by category | ✅ Complete |
| FR-SEARCH-03 | System shall search formulations by name | ✅ Complete |
| FR-SEARCH-04 | System shall filter formulations by status | ✅ Complete |
| FR-SEARCH-05 | System shall support advanced multi-criteria search | ✅ Complete |

### 2.8 Data Import (FR-IMPORT)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-IMPORT-01 | System shall import formulations from Excel | ✅ Complete |
| FR-IMPORT-02 | System shall auto-create missing ingredients on import | ✅ Complete |
| FR-IMPORT-03 | System shall report import results (success/errors) | ✅ Complete |

---

## 3. Non-Functional Requirements

### 3.1 Performance (NFR-PERF)

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-PERF-01 | API response time < 500ms for single record operations | ✅ Complete |
| NFR-PERF-02 | Database shall use WAL mode for concurrent access | ✅ Complete |
| NFR-PERF-03 | Database shall have 30-second busy timeout | ✅ Complete |

### 3.2 Security (NFR-SEC)

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-SEC-01 | All API endpoints (except health) require authentication | ✅ Complete |
| NFR-SEC-02 | Passwords shall be hashed (bcrypt ready) | ⚠️ Placeholder |
| NFR-SEC-03 | JWT tokens shall be validated on each request | ✅ Complete |
| NFR-SEC-04 | CORS shall be configured for allowed origins | ✅ Complete |

### 3.3 Reliability (NFR-REL)

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-REL-01 | System shall handle database lock gracefully | ✅ Complete |
| NFR-REL-02 | System shall return meaningful error messages | ✅ Complete |
| NFR-REL-03 | System shall validate input before database operations | ✅ Complete |

### 3.4 Usability (NFR-USE)

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-USE-01 | Frontend shall show real-time percentage totals | ✅ Complete |
| NFR-USE-02 | Frontend shall indicate when total = 100% (green checkmark) | ✅ Complete |
| NFR-USE-03 | Frontend shall show cost calculations inline | ✅ Complete |
| NFR-USE-04 | Frontend shall use cascading dropdowns (category → ingredient) | ✅ Complete |

---

## 4. Data Requirements

### 4.1 Ingredient Data Model
```
ingredients
├── id (PK)
├── name (required, unique)
├── inci_name
├── cas_number
├── category_id (FK)
├── supplier_id (FK)
├── landed_cost_net_gst
├── usage_rate_min
├── usage_rate_max
├── stock_status
└── timestamps

ingredient_regulatory
├── ingredient_id (PK, FK)
├── einecs
├── cosing_ref
├── eu_approved (0/1)
├── us_approved (0/1)
└── safety_notes

ingredient_properties
├── ingredient_id (PK, FK)
├── sap_value
├── iodine_value
├── hardness_coefficient
└── lather_coefficient

ingredient_marketing
├── ingredient_id (PK, FK)
├── benefits
└── applications
```

### 4.2 Formulation Data Model
```
formulations
├── id (PK)
├── product_name (required, unique)
├── product_type_id (FK)
├── current_version
├── grammage
├── pack_count
├── total_cost_per_piece
├── status
├── created_by (FK)
└── timestamps

formulation_ingredients
├── id (PK)
├── formulation_id (FK)
├── version_id (FK)
├── ingredient_id (FK)
├── percentage
├── quantity_grams
└── cost_per_piece

formulation_versions
├── id (PK)
├── formulation_id (FK)
├── version_number
├── ingredients_snapshot (JSON)
├── cost_snapshot
├── change_notes
└── created_by (FK)
```

---

## 5. API Endpoints

### 5.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |

### 5.2 Ingredients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/ingredients | List all ingredients |
| GET | /api/ingredients/:id | Get single ingredient |
| POST | /api/ingredients | Create ingredient |
| PUT | /api/ingredients/:id | Update ingredient |
| DELETE | /api/ingredients/:id | Delete ingredient |

### 5.3 Formulations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/formulations | List all formulations |
| GET | /api/formulations/:id | Get single formulation |
| POST | /api/formulations | Create formulation |
| PUT | /api/formulations/:id | Update formulation |
| DELETE | /api/formulations/:id | Delete formulation |
| POST | /api/formulations/:id/duplicate | Duplicate formulation |

### 5.4 Versions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/formulations/:id/versions | List versions |
| GET | /api/formulations/:id/versions/compare | Compare versions |
| POST | /api/formulations/:id/versions/:vid/restore | Restore version |

### 5.5 Supporting
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List categories |
| GET | /api/product-types | List product types |
| GET | /api/suppliers | List suppliers |
| GET | /api/benefits | List benefits |
| POST | /api/formulations/:id/bom/generate | Generate BOM |

---

## 6. Completion Summary

| Category | Total | Complete | Percentage |
|----------|-------|----------|------------|
| Authentication | 4 | 4 | 100% |
| Ingredients | 8 | 8 | 100% |
| Formulations | 9 | 9 | 100% |
| Version Control | 6 | 6 | 100% |
| Cost Calculation | 4 | 4 | 100% |
| BOM | 4 | 4 | 100% |
| Search | 5 | 5 | 100% |
| Import | 3 | 3 | 100% |
| **TOTAL** | **43** | **43** | **100%** |

---

## 7. Future Enhancements (Roadmap)

### Phase 2 (Planned)
- [ ] Dashboard analytics and charts
- [ ] Ingredient compatibility checking
- [ ] Automatic quality score calculation
- [ ] Batch tracking integration

### Phase 3 (Future)
- [ ] Multi-user collaboration features
- [ ] Audit trail logging
- [ ] PDF export for formulations
- [ ] API for external integrations

---

*Document last updated: December 14, 2025*
