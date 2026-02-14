/**
 * Formulation Editor v2.6
 *
 * FEATURES:
 * - localStorage cache for unsaved work
 * - Auto-save on every change
 * - Restore draft on page load
 * - Clear cache only after successful save at 100%
 * - Version notes input
 * - Role-based UI (submit for approval, make active)
 * - Navigate to Ingredients without losing work
 * - Change reason checkboxes (Price, Hardness, Perfume, Colour, Lather, Other)
 * - Auto-generated ingredient diff in version notes
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  Plus, Trash2, Save, X, AlertCircle, Check, AlertTriangle, 
  Package, ArrowLeft, Send, CheckCircle, Clock
} from 'lucide-react';

const API_BASE = '/api';
const CACHE_KEY = 'formulation_draft';

const FormulationEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const versionId = searchParams.get('version');
  const isEditMode = Boolean(id);

  // User role from localStorage
  const [userRole, setUserRole] = useState('viewer');

  const [formData, setFormData] = useState({
    product_name: '',
    product_type_id: 1,
    grammage: 75,
    pack_count: 1,
    status: 'draft',
    notes: ''
  });

  const [formulaIngredients, setFormulaIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [saveAsNewVersion, setSaveAsNewVersion] = useState(true);
  const [submitForApproval, setSubmitForApproval] = useState(false);

  // Change reason checkboxes for version control
  const [changeReasons, setChangeReasons] = useState({
    price: false,
    hardness: false,
    perfume: false,
    colour: false,
    lather: false,
    other: false
  });

  const CHANGE_REASON_OPTIONS = [
    { key: 'price', label: 'Price Optimization' },
    { key: 'hardness', label: 'Hardness Adjustment' },
    { key: 'perfume', label: 'Perfume/Fragrance' },
    { key: 'colour', label: 'Colour Change' },
    { key: 'lather', label: 'Lather Improvement' },
    { key: 'other', label: 'Other' }
  ];
  
  // Regulatory warning state
  const [regulatoryWarnings, setRegulatoryWarnings] = useState([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [savedFormulationId, setSavedFormulationId] = useState(null);
  
  // Draft restoration state
  const [hasCachedDraft, setHasCachedDraft] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [cachedDraftInfo, setCachedDraftInfo] = useState(null);

  const getToken = () => localStorage.getItem('token');

  // ============================================================================
  // LOCALSTORAGE CACHE FUNCTIONS
  // ============================================================================

  const getCacheKey = () => {
    // Unique key per formulation (edit) or generic for new
    return isEditMode ? `${CACHE_KEY}_${id}` : `${CACHE_KEY}_new`;
  };

  const saveDraftToCache = useCallback(() => {
    const draft = {
      formData,
      formulaIngredients,
      versionNotes,
      savedAt: new Date().toISOString(),
      formulationId: id || null
    };
    try {
      localStorage.setItem(getCacheKey(), JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save draft to localStorage:', e);
    }
  }, [formData, formulaIngredients, versionNotes, id]);

  const loadDraftFromCache = () => {
    try {
      const cached = localStorage.getItem(getCacheKey());
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to load draft from localStorage:', e);
    }
    return null;
  };

  const clearDraftCache = () => {
    try {
      localStorage.removeItem(getCacheKey());
      // Also clear new formulation cache if we're editing
      if (isEditMode) {
        localStorage.removeItem(`${CACHE_KEY}_new`);
      }
    } catch (e) {
      console.warn('Failed to clear draft cache:', e);
    }
  };

  // Auto-save to cache on changes
  useEffect(() => {
    if (!loading && (formData.product_name || formulaIngredients.length > 0)) {
      const timer = setTimeout(() => {
        saveDraftToCache();
      }, 500); // Debounce 500ms
      return () => clearTimeout(timer);
    }
  }, [formData, formulaIngredients, versionNotes, loading, saveDraftToCache]);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    // Get user role
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'viewer');
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        const [catRes, ingRes, ptRes] = await Promise.all([
          fetch(`${API_BASE}/categories`, { headers }),
          fetch(`${API_BASE}/ingredients`, { headers }),
          fetch(`${API_BASE}/product-types`, { headers })
        ]);

        const [catData, ingData, ptData] = await Promise.all([
          catRes.json(),
          ingRes.json(),
          ptRes.json()
        ]);

        setCategories(catData.categories || []);
        setAllIngredients(ingData.ingredients || []);
        setProductTypes(ptData.product_types || []);

        // Check for cached draft BEFORE loading from server
        const cachedDraft = loadDraftFromCache();
        
        if (isEditMode) {
          const formRes = await fetch(`${API_BASE}/formulations/${id}`, { headers });
          const formResult = await formRes.json();
          
          if (formResult.formulation) {
            const f = formResult.formulation;
            
            // Check if we have a more recent cached draft
            if (cachedDraft && cachedDraft.savedAt) {
              const serverUpdated = new Date(f.updated_at || 0);
              const cacheUpdated = new Date(cachedDraft.savedAt);
              
              if (cacheUpdated > serverUpdated) {
                setCachedDraftInfo({
                  savedAt: cachedDraft.savedAt,
                  productName: cachedDraft.formData?.product_name || 'Untitled',
                  ingredientCount: cachedDraft.formulaIngredients?.length || 0
                });
                setHasCachedDraft(true);
                setShowRestoreDialog(true);
              }
            }
            
            // Load from server by default
            setFormData({
              product_name: f.product_name || '',
              product_type_id: f.product_type_id || 1,
              grammage: f.grammage || 75,
              pack_count: f.pack_count || 1,
              status: f.status || 'draft',
              notes: f.notes || ''
            });

            if (f.ingredients && f.ingredients.length > 0) {
              const mappedIngredients = f.ingredients.map(ing => {
                const fullIng = (ingData.ingredients || []).find(i => i.id === ing.ingredient_id);
                return {
                  id: ing.ingredient_id,
                  category_id: fullIng?.category_id || ing.category_id,
                  name: ing.ingredient_name,
                  percentage: ing.percentage,
                  cost_per_kg: ing.landed_cost_net_gst || 0
                };
              });
              setFormulaIngredients(mappedIngredients);
            }
          }
        } else {
          // New formulation - check for cached draft
          if (cachedDraft && cachedDraft.formData) {
            setCachedDraftInfo({
              savedAt: cachedDraft.savedAt,
              productName: cachedDraft.formData?.product_name || 'Untitled',
              ingredientCount: cachedDraft.formulaIngredients?.length || 0
            });
            setHasCachedDraft(true);
            setShowRestoreDialog(true);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  // Restore cached draft
  const restoreCachedDraft = () => {
    const cachedDraft = loadDraftFromCache();
    if (cachedDraft) {
      if (cachedDraft.formData) {
        setFormData(cachedDraft.formData);
      }
      if (cachedDraft.formulaIngredients) {
        setFormulaIngredients(cachedDraft.formulaIngredients);
      }
      if (cachedDraft.versionNotes) {
        setVersionNotes(cachedDraft.versionNotes);
      }
    }
    setShowRestoreDialog(false);
    setHasCachedDraft(false);
  };

  const discardCachedDraft = () => {
    clearDraftCache();
    setShowRestoreDialog(false);
    setHasCachedDraft(false);
  };

  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  const ingredientsByCategory = useMemo(() => {
    const grouped = {};
    allIngredients.forEach(ing => {
      const catId = ing.category_id || 0;
      if (!grouped[catId]) grouped[catId] = [];
      grouped[catId].push(ing);
    });
    Object.keys(grouped).forEach(catId => {
      grouped[catId].sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [allIngredients]);

  const totals = useMemo(() => {
    const totalPercentage = formulaIngredients.reduce((sum, ing) => sum + (parseFloat(ing.percentage) || 0), 0);
    const totalCostPerKg = formulaIngredients.reduce((sum, ing) => {
      const pct = parseFloat(ing.percentage) || 0;
      const costKg = parseFloat(ing.cost_per_kg) || 0;
      return sum + (pct / 100 * costKg);
    }, 0);
    const grammage = parseFloat(formData.grammage) || 75;
    const totalCostPerPiece = totalCostPerKg * grammage / 1000;
    return { percentage: totalPercentage, costPerKg: totalCostPerKg, costPerPiece: totalCostPerPiece };
  }, [formulaIngredients, formData.grammage]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addIngredientRow = () => {
    setFormulaIngredients(prev => [...prev, {
      id: null,
      category_id: categories[0]?.id || 1,
      name: '',
      percentage: 0,
      cost_per_kg: 0
    }]);
  };

  const removeIngredientRow = (index) => {
    setFormulaIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index, categoryId) => {
    setFormulaIngredients(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], category_id: parseInt(categoryId), id: null, name: '', cost_per_kg: 0 };
      return updated;
    });
  };

  const handleIngredientChange = (index, ingredientId) => {
    const ingredient = allIngredients.find(i => i.id === parseInt(ingredientId));
    if (ingredient) {
      setFormulaIngredients(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], id: ingredient.id, name: ingredient.name, cost_per_kg: ingredient.landed_cost_net_gst || 0 };
        return updated;
      });
    }
  };

  const handlePercentageChange = (index, value) => {
    const percentage = parseFloat(value) || 0;
    setFormulaIngredients(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], percentage };
      return updated;
    });
  };

  const calculateRowCost = (ing) => {
    const pct = parseFloat(ing.percentage) || 0;
    const costKg = parseFloat(ing.cost_per_kg) || 0;
    const grammage = parseFloat(formData.grammage) || 75;
    return (pct / 100) * costKg * (grammage / 1000);
  };

  // Navigate to ingredients without losing work (cache is auto-saved)
  const goToIngredients = () => {
    saveDraftToCache(); // Ensure latest is saved
    navigate('/ingredients');
  };

  // ============================================================================
  // VALIDATION & SAVE
  // ============================================================================

  const validate = () => {
    if (!formData.product_name.trim()) { setError('Product name is required'); return false; }
    if (formulaIngredients.length === 0) { setError('At least one ingredient is required'); return false; }
    if (formulaIngredients.some(ing => !ing.id)) { setError('Please select an ingredient for each row'); return false; }
    const totalPct = formulaIngredients.reduce((sum, ing) => sum + (parseFloat(ing.percentage) || 0), 0);
    if (Math.abs(totalPct - 100) > 0.01) { setError(`Percentages must sum to 100% (currently ${totalPct.toFixed(2)}%)`); return false; }
    setError(null);
    return true;
  };

  const handleSaveClick = () => {
    if (!validate()) return;
    if (isEditMode) { 
      setShowVersionDialog(true); 
    } else { 
      saveFormulation(); 
    }
  };

  const saveFormulation = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      const grammage = parseFloat(formData.grammage) || 75;
      const payload = {
        ...formData,
        grammage,
        ingredients: formulaIngredients.map(ing => ({ ingredient_id: ing.id, percentage: parseFloat(ing.percentage) || 0 }))
      };
      
      if (isEditMode && saveAsNewVersion) {
        payload.version_notes = versionNotes || 'Updated formulation';
        payload.create_new_version = true;
        // Add selected change reasons
        const selectedReasons = Object.entries(changeReasons)
          .filter(([_, selected]) => selected)
          .map(([key, _]) => CHANGE_REASON_OPTIONS.find(opt => opt.key === key)?.label || key);
        if (selectedReasons.length > 0) {
          payload.change_reasons = selectedReasons;
        }
      }
      
      // Add submit for approval flag
      if (submitForApproval) {
        payload.submit_for_approval = true;
      }
      
      const url = isEditMode ? `${API_BASE}/formulations/${id}` : `${API_BASE}/formulations`;
      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch(url, { 
        method, 
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      const data = await response.json();
      
      if (!response.ok) { 
        throw new Error(data.error || 'Failed to save formulation'); 
      }
      
      // SUCCESS - Clear the cache!
      clearDraftCache();
      
      const formId = data.formulation_id || data.id || id;
      
      if (data.warnings && data.warnings.length > 0) {
        setRegulatoryWarnings(data.warnings);
        setSavedFormulationId(formId);
        setShowWarningDialog(true);
        setSaving(false);
      } else {
        navigate(`/formulations/${formId}`);
      }
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleWarningAcknowledge = () => {
    setShowWarningDialog(false);
    setRegulatoryWarnings([]);
    if (savedFormulationId) {
      navigate(`/formulations/${savedFormulationId}`);
    }
  };

  // ============================================================================
  // PERMISSION HELPERS
  // ============================================================================

  const canEdit = () => {
    return ['qc', 'owner', 'admin'].includes(userRole);
  };

  const canMakeActive = () => {
    return ['owner', 'admin'].includes(userRole);
  };

  const canSubmitForApproval = () => {
    return ['qc', 'accountant'].includes(userRole);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Check edit permission
  if (!canEdit()) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">View Only</h2>
          <p className="text-yellow-700">You don't have permission to edit formulations.</p>
          <button
            onClick={() => navigate('/formulations')}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Back to Formulations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Restore Draft Dialog */}
      {showRestoreDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Unsaved Draft Found</h3>
            </div>
            <p className="text-gray-600 mb-2">
              You have an unsaved draft from a previous session:
            </p>
            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <div className="text-sm text-gray-700">
                <strong>{cachedDraftInfo?.productName || 'Untitled'}</strong>
              </div>
              <div className="text-xs text-gray-500">
                {cachedDraftInfo?.ingredientCount || 0} ingredients • 
                Saved {cachedDraftInfo?.savedAt ? new Date(cachedDraftInfo.savedAt).toLocaleString() : 'recently'}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={restoreCachedDraft}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Restore Draft
              </button>
              <button
                onClick={discardCachedDraft}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/formulations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Formulations
        </button>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Formulation' : 'Create Formulation'}
          </h1>
          <button
            onClick={goToIngredients}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Browse Ingredients
          </button>
        </div>
        
        {/* Draft indicator */}
        {(formData.product_name || formulaIngredients.length > 0) && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Draft auto-saved
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Form Details */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Formulation Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => handleFormChange('product_name', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
            <select
              value={formData.product_type_id}
              onChange={(e) => handleFormChange('product_type_id', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {productTypes.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grammage (g)</label>
            <input
              type="number"
              value={formData.grammage}
              onChange={(e) => handleFormChange('grammage', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pack Count</label>
            <select
              value={formData.pack_count}
              onChange={(e) => handleFormChange('pack_count', parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 (single)</option>
              <option value={3}>3-pack</option>
              <option value={6}>6-pack</option>
              <option value={12}>12-pack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleFormChange('status', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!canMakeActive() && formData.status !== 'draft'}
            >
              <option value="draft">Draft</option>
              <option value="under_review">Under Review</option>
              {canMakeActive() && <option value="active">Active</option>}
              <option value="archived">Archived</option>
            </select>
            {!canMakeActive() && (
              <p className="text-xs text-gray-500 mt-1">Only owner can make active</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Optional notes..."
            />
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <button
            onClick={addIngredientRow}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase w-24">%</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost/kg</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cost/piece</th>
                <th className="px-3 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {formulaIngredients.map((ing, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <select
                      value={ing.category_id}
                      onChange={(e) => handleCategoryChange(index, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={ing.id || ''}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="">-- Select --</option>
                      {(ingredientsByCategory[ing.category_id] || []).map(i => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={ing.percentage}
                      onChange={(e) => handlePercentageChange(index, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm text-right"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-gray-600">
                    ₹{(ing.cost_per_kg || 0).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium">
                    ₹{calculateRowCost(ing).toFixed(4)}
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeIngredientRow(index)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-medium">
              <tr>
                <td colSpan="2" className="px-3 py-2 text-right">Totals:</td>
                <td className={`px-3 py-2 text-right ${Math.abs(totals.percentage - 100) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                  {totals.percentage.toFixed(2)}%
                </td>
                <td className="px-3 py-2 text-right">₹{totals.costPerKg.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-blue-600">₹{totals.costPerPiece.toFixed(4)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {Math.abs(totals.percentage - 100) > 0.01 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Total must equal 100%. Currently: {totals.percentage.toFixed(2)}%
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={() => navigate('/formulations')}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>

        <div className="flex gap-3">
          {canSubmitForApproval() && (
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={submitForApproval}
                onChange={(e) => setSubmitForApproval(e.target.checked)}
                className="rounded border-gray-300"
              />
              Submit for owner approval
            </label>
          )}
          
          <button
            onClick={handleSaveClick}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {submitForApproval ? 'Save & Submit' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Version Dialog */}
      {showVersionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Changes</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={saveAsNewVersion}
                    onChange={() => setSaveAsNewVersion(true)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Create new version</span>
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    checked={!saveAsNewVersion}
                    onChange={() => setSaveAsNewVersion(false)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Update current version</span>
                </label>
              </div>

              {saveAsNewVersion && (
                <>
                  {/* Change Reason Checkboxes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Change
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHANGE_REASON_OPTIONS.map(option => (
                        <label key={option.key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={changeReasons[option.key]}
                            onChange={(e) => setChangeReasons(prev => ({
                              ...prev,
                              [option.key]: e.target.checked
                            }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Version Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes (optional)
                    </label>
                    <textarea
                      value={versionNotes}
                      onChange={(e) => setVersionNotes(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Any additional details..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ingredient changes are auto-detected
                    </p>
                  </div>
                </>
              )}
              
              {canSubmitForApproval() && (
                <label className="flex items-center gap-2 text-sm text-gray-600 border-t pt-4">
                  <input
                    type="checkbox"
                    checked={submitForApproval}
                    onChange={(e) => setSubmitForApproval(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Send className="w-4 h-4 text-orange-500" />
                  Submit to owner for approval
                </label>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowVersionDialog(false);
                  setChangeReasons({ price: false, hardness: false, perfume: false, colour: false, lather: false, other: false });
                  setVersionNotes('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowVersionDialog(false);
                  saveFormulation();
                }}
                disabled={saveAsNewVersion && !versionNotes.trim() && !Object.values(changeReasons).some(v => v)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Warning Dialog */}
      {showWarningDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Regulatory Warnings</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your formulation has been saved, but please note the following regulatory concerns:
            </p>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {regulatoryWarnings.map((warning, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  {typeof warning === 'object' ? warning.message : warning}
                </div>
              ))}
            </div>
            <button
              onClick={handleWarningAcknowledge}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              I Understand, Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulationEditor;
