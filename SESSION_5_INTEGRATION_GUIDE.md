# SESSION 5 - INTEGRATION GUIDE
## Updates to Existing Components

---

## 1. UPDATE: IngredientAddModal.jsx

**Add after Storage Conditions section, before Notes:**

```javascript
{/* Regulatory Approvals */}
<div className="border rounded-lg p-4">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">
    Regulatory Approvals
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* US Approval */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        US (FDA) Approval
      </label>
      <select
        name="us_approved"
        value={formData.us_approved || ''}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        <option value="">Unknown</option>
        <option value="1">Yes - Approved</option>
        <option value="0">No - Not Approved</option>
      </select>
    </div>
    
    {/* EU Approval */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        EU Cosmetics Regulation
      </label>
      <select
        name="eu_approved"
        value={formData.eu_approved || ''}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        <option value="">Unknown</option>
        <option value="1">Yes - Approved</option>
        <option value="0">No - Not Approved</option>
      </select>
    </div>
  </div>
  
  <p className="text-xs text-gray-500 mt-2">
    Track regulatory approval status for export markets
  </p>
</div>
```

**Add to formData state initialization:**
```javascript
const [formData, setFormData] = useState({
  // ... existing fields
  us_approved: '',
  eu_approved: ''
});
```

**Update API payload in handleSubmit:**
```javascript
const payload = {
  // ... existing fields
  us_approved: formData.us_approved ? parseInt(formData.us_approved) : null,
  eu_approved: formData.eu_approved ? parseInt(formData.eu_approved) : null
};
```

---

## 2. UPDATE: IngredientEditModal.jsx

**Same changes as IngredientAddModal above**

**Plus in useEffect when loading ingredient data:**
```javascript
setFormData({
  // ... existing fields
  us_approved: ingredient.us_approved !== null ? String(ingredient.us_approved) : '',
  eu_approved: ingredient.eu_approved !== null ? String(ingredient.eu_approved) : ''
});
```

---

## 3. UPDATE: Ingredients.jsx

**Add imports:**
```javascript
import { Plus, Search, Filter, Edit2, Trash2, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import IngredientImportModal from '../components/IngredientImportModal';
```

**Add state:**
```javascript
const [showImportModal, setShowImportModal] = useState(false);
```

**Update header buttons section:**
```javascript
<div className="flex items-center justify-between mb-4">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Ingredient Library</h1>
    <p className="text-gray-600 mt-1">
      Manage your ingredient inventory and specifications
    </p>
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => setShowImportModal(true)}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
    >
      <Upload className="w-5 h-5" />
      Import from Excel
    </button>
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      <Plus className="w-5 h-5" />
      Add Ingredient
    </button>
  </div>
</div>
```

**Add approval badge helper function:**
```javascript
const getApprovalBadges = (usApproved, euApproved) => {
  const badges = [];
  
  if (usApproved === 1) {
    badges.push(
      <span key="us" className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded" title="US FDA Approved">
        US ✓
      </span>
    );
  } else if (usApproved === 0) {
    badges.push(
      <span key="us" className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded" title="Not US Approved">
        US ✗
      </span>
    );
  }
  
  if (euApproved === 1) {
    badges.push(
      <span key="eu" className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded" title="EU Approved">
        EU ✓
      </span>
    );
  } else if (euApproved === 0) {
    badges.push(
      <span key="eu" className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded" title="Not EU Approved">
        EU ✗
      </span>
    );
  }
  
  return badges;
};
```

**Update ingredient name cell in table:**
```javascript
<td className="px-6 py-4 whitespace-nowrap">
  <div>
    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
      {ingredient.name}
      {getApprovalBadges(ingredient.us_approved, ingredient.eu_approved)}
    </div>
    {ingredient.inci_name && (
      <div className="text-sm text-gray-500">
        INCI: {ingredient.inci_name}
      </div>
    )}
    {ingredient.cas_number && (
      <div className="text-xs text-gray-400">
        CAS: {ingredient.cas_number}
      </div>
    )}
  </div>
</td>
```

**Add import modal at end:**
```javascript
<IngredientImportModal
  isOpen={showImportModal}
  onClose={() => setShowImportModal(false)}
  onSuccess={handleAddSuccess}
/>
```

---

## 4. CREATE: Formulations.jsx Integration

**If Formulations.jsx doesn't exist from previous work, add these sections:**

**Import:**
```javascript
import { Plus, Search, Filter, Upload } from 'lucide-react';
import FormulationImportModal from '../components/FormulationImportModal';
import AdvancedSearchPanel from '../components/AdvancedSearchPanel';
```

**Add states:**
```javascript
const [showImportModal, setShowImportModal] = useState(false);
const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
const [searchResults, setSearchResults] = useState(null);
```

**Header with buttons:**
```javascript
<div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold text-gray-900">Formulations</h1>
  <div className="flex gap-2">
    <button
      onClick={() => setShowAdvancedSearch(true)}
      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
    >
      <Filter className="w-5 h-5" />
      Advanced Search
    </button>
    <button
      onClick={() => setShowImportModal(true)}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      <Upload className="w-5 h-5" />
      Import from Excel
    </button>
    <button
      onClick={() => navigate('/formulations/new')}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      <Plus className="w-5 h-5" />
      New Formulation
    </button>
  </div>
</div>
```

**Handle search results:**
```javascript
const handleSearchResults = (results) => {
  setSearchResults(results);
};

const handleClearSearch = () => {
  setSearchResults(null);
};

// Use searchResults if available, otherwise use all formulations
const displayedFormulations = searchResults !== null ? searchResults : formulations;
```

**Show active search indicator:**
```javascript
{searchResults !== null && (
  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center justify-between">
    <div className="text-sm text-blue-800">
      Showing {searchResults.length} search results
    </div>
    <button
      onClick={handleClearSearch}
      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
    >
      Clear Search
    </button>
  </div>
)}
```

**Add modals at end:**
```javascript
<FormulationImportModal
  isOpen={showImportModal}
  onClose={() => setShowImportModal(false)}
  onSuccess={loadFormulations}
/>

<AdvancedSearchPanel
  isOpen={showAdvancedSearch}
  onClose={() => setShowAdvancedSearch(false)}
  onSearch={handleSearchResults}
/>
```

---

## 5. UPDATE: VersionTimeline.jsx

**Add imports:**
```javascript
import { Clock, TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw, RotateCcw, GitCompare } from 'lucide-react';
import VersionComparison from './VersionComparison';
```

**Add state:**
```javascript
const [compareMode, setCompareMode] = useState(false);
const [selectedVersions, setSelectedVersions] = useState([]);
const [showComparison, setShowComparison] = useState(false);
```

**Add compare button in header:**
```javascript
<div className="flex items-center justify-between">
  <div>
    <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
    <p className="text-sm text-gray-600">
      {versions.length} version{versions.length !== 1 ? 's' : ''} • 
      Current: {formulation.current_version}
    </p>
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => {
        setCompareMode(!compareMode);
        setSelectedVersions([]);
      }}
      className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
        compareMode 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:text-gray-900 border border-gray-300'
      }`}
    >
      <GitCompare className="w-4 h-4" />
      {compareMode ? 'Cancel Compare' : 'Compare Versions'}
    </button>
    <button
      onClick={loadVersions}
      disabled={loading}
      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
    >
      <RefreshCw className="w-4 h-4" />
      Refresh
    </button>
  </div>
</div>
```

**Update version dot rendering to add checkbox in compare mode:**
```javascript
<button
  onClick={() => {
    if (compareMode) {
      handleVersionSelect(version.version_number);
    } else {
      handleVersionClick(version);
    }
  }}
  className={`relative z-10 w-16 h-16 rounded-full border-4 transition-all ${
    compareMode && selectedVersions.includes(version.version_number)
      ? 'bg-blue-600 border-blue-700 ring-4 ring-blue-200'
      : isCurrentVersion
      ? 'bg-blue-600 border-blue-700 ring-4 ring-blue-100'
      : isSelected
      ? 'bg-white border-blue-600 ring-4 ring-blue-100'
      : 'bg-white border-gray-300 hover:border-blue-400'
  }`}
>
  {compareMode && (
    <div className="absolute -top-2 -right-2">
      <input
        type="checkbox"
        checked={selectedVersions.includes(version.version_number)}
        onChange={() => handleVersionSelect(version.version_number)}
        className="w-5 h-5"
      />
    </div>
  )}
  {/* existing content */}
</button>
```

**Add selection handler:**
```javascript
const handleVersionSelect = (versionNumber) => {
  setSelectedVersions(prev => {
    if (prev.includes(versionNumber)) {
      return prev.filter(v => v !== versionNumber);
    } else if (prev.length < 2) {
      return [...prev, versionNumber];
    } else {
      // Replace oldest selection
      return [prev[1], versionNumber];
    }
  });
};
```

**Add compare button when 2 selected:**
```javascript
{compareMode && selectedVersions.length === 2 && (
  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
    <button
      onClick={() => setShowComparison(true)}
      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
    >
      Compare {selectedVersions[0]} vs {selectedVersions[1]}
    </button>
  </div>
)}
```

**Add modal at end:**
```javascript
<VersionComparison
  isOpen={showComparison}
  onClose={() => setShowComparison(false)}
  formulation={formulation}
  version1={selectedVersions[0]}
  version2={selectedVersions[1]}
/>
```

---

## 6. REQUIRED: Install xlsx Library

**Run in formulation_app directory:**
```bash
npm install xlsx
```

---

## 7. REQUIRED: Add pandas to Backend

**Update backend/requirements.txt:**
```
Flask==3.0.0
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.3
python-dotenv==1.0.0
pandas==2.1.0
openpyxl==3.1.2
```

**Install:**
```bash
pip install pandas openpyxl --break-system-packages
```

---

## 8. RUN DATABASE MIGRATION

**In SQLite:**
```bash
cd ~/Documents/swati-soaps-formulation-system
sqlite3 backend/swati_soaps.db < database/migration_add_regulatory_approvals.sql
```

Or manually:
```sql
ALTER TABLE ingredients ADD COLUMN us_approved INTEGER DEFAULT NULL;
ALTER TABLE ingredients ADD COLUMN eu_approved INTEGER DEFAULT NULL;
CREATE INDEX idx_ingredients_us_approved ON ingredients(us_approved);
CREATE INDEX idx_ingredients_eu_approved ON ingredients(eu_approved);
```

---

## INTEGRATION COMPLETE ✅

All components updated with:
- Regulatory approval tracking
- Bulk import capabilities
- Advanced search integration
- Version comparison

Ready for testing!
