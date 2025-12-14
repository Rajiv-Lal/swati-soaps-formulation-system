import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, X, AlertCircle, Check, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://165.22.222.87:5000/api';

const FormulationEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

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
  
  // Regulatory warning state
  const [regulatoryWarnings, setRegulatoryWarnings] = useState([]);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [savedFormulationId, setSavedFormulationId] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
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

        if (isEditMode) {
          const formRes = await fetch(`${API_BASE}/formulations/${id}`, { headers });
          const formResult = await formRes.json();
          
          if (formResult.formulation) {
            const f = formResult.formulation;
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
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

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
    if (isEditMode) { setShowVersionDialog(true); } else { saveFormulation(); }
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
      }
      const url = isEditMode ? `${API_BASE}/formulations/${id}` : `${API_BASE}/formulations`;
      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      
      if (!response.ok) { 
        throw new Error(data.error || 'Failed to save formulation'); 
      }
      
      // Get the formulation ID from response
      const formId = data.formulation_id || data.id || id;
      
      // Check for regulatory warnings
      if (data.warnings && data.warnings.length > 0) {
        setRegulatoryWarnings(data.warnings);
        setSavedFormulationId(formId);
        setShowWarningDialog(true);
        setSaving(false);
      } else {
        // No warnings - navigate directly
        navigate(`/formulations/${formId}`);
      }
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  // Handle closing warning dialog and navigating
  const handleWarningAcknowledge = () => {
    setShowWarningDialog(false);
    setRegulatoryWarnings([]);
    if (savedFormulationId) {
      navigate(`/formulations/${savedFormulationId}`);
    }
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><span className="ml-3 text-gray-600">Loading...</span></div>);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Formulation' : 'Create New Formulation'}</h1>
        <p className="text-gray-500 mt-1">{isEditMode ? 'Modify the formulation details below' : 'Enter the details for your new formulation'}</p>
      </div>

      {error && (<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"><AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />{error}</div>)}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={formData.product_name} onChange={(e) => handleFormChange('product_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Neem Soap" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select value={formData.product_type_id} onChange={(e) => handleFormChange('product_type_id', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                {productTypes.map(pt => (<option key={pt.id} value={pt.id}>{pt.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="under_review">Under Review</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grammage (g)</label>
              <input type="number" value={formData.grammage} onChange={(e) => handleFormChange('grammage', parseInt(e.target.value) || 75)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pack Count</label>
              <input type="number" value={formData.pack_count} onChange={(e) => handleFormChange('pack_count', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input type="text" value={formData.notes} onChange={(e) => handleFormChange('notes', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Optional notes..." />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
            <button onClick={addIngredientRow} className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="h-4 w-4 mr-1" />Add Ingredient</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm font-medium text-gray-600">
                  <th className="px-3 py-3 w-1/4">Category</th>
                  <th className="px-3 py-3 w-1/3">Ingredient</th>
                  <th className="px-3 py-3 w-20 text-right">%</th>
                  <th className="px-3 py-3 w-28 text-right">₹/kg</th>
                  <th className="px-3 py-3 w-28 text-right">Cost</th>
                  <th className="px-3 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formulaIngredients.map((ing, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <select value={ing.category_id || ''} onChange={(e) => handleCategoryChange(index, e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select category...</option>
                        {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select value={ing.id || ''} onChange={(e) => handleIngredientChange(index, e.target.value)} className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" disabled={!ing.category_id}>
                        <option value="">Select ingredient...</option>
                        {(ingredientsByCategory[ing.category_id] || []).map(ingOption => (<option key={ingOption.id} value={ingOption.id}>{ingOption.name}</option>))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input type="number" value={ing.percentage} onChange={(e) => handlePercentageChange(index, e.target.value)} className="w-full px-2 py-1.5 text-sm text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" step="0.01" min="0" max="100" />
                    </td>
                    <td className="px-3 py-2 text-right text-sm text-gray-600">{ing.cost_per_kg ? `₹${parseFloat(ing.cost_per_kg).toFixed(2)}` : '-'}</td>
                    <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">₹{calculateRowCost(ing).toFixed(2)}</td>
                    <td className="px-3 py-2 text-center"><button onClick={() => removeIngredientRow(index)} className="text-red-500 hover:text-red-700 p-1" title="Remove ingredient"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {formulaIngredients.length === 0 && (<div className="text-center py-8 text-gray-500"><p>No ingredients added yet.</p><button onClick={addIngredientRow} className="mt-2 text-blue-600 hover:text-blue-700 font-medium">+ Add your first ingredient</button></div>)}

          {formulaIngredients.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-end items-center space-x-8">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Percentage</div>
                  <div className={`text-xl font-bold ${Math.abs(totals.percentage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>{totals.percentage.toFixed(2)}%{Math.abs(totals.percentage - 100) < 0.01 && <Check className="inline h-5 w-5 ml-1" />}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Cost/kg</div>
                  <div className="text-xl font-bold text-gray-900">₹{totals.costPerKg.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Cost/piece ({formData.grammage}g)</div>
                  <div className="text-xl font-bold text-blue-600">₹{totals.costPerPiece.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button onClick={() => navigate('/formulations')} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"><X className="h-4 w-4 inline mr-1" />Cancel</button>
          <button onClick={handleSaveClick} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"><Save className="h-4 w-4 inline mr-1" />{saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Formulation')}</button>
        </div>
      </div>

      {/* Version Dialog */}
      {showVersionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Changes</h3>
            <p className="text-gray-600 mb-4">How would you like to save your changes?</p>
            <div className="space-y-3 mb-4">
              <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" checked={saveAsNewVersion} onChange={() => setSaveAsNewVersion(true)} className="mt-0.5 mr-3" />
                <div><div className="font-medium text-gray-900">Save as new version</div><div className="text-sm text-gray-500">Creates a new version in history</div></div>
              </label>
              <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" checked={!saveAsNewVersion} onChange={() => setSaveAsNewVersion(false)} className="mt-0.5 mr-3" />
                <div><div className="font-medium text-gray-900">Update current version</div><div className="text-sm text-gray-500">For minor corrections only</div></div>
              </label>
            </div>
            {saveAsNewVersion && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Version notes (optional)</label>
                <input type="text" value={versionNotes} onChange={(e) => setVersionNotes(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Adjusted fragrance percentage" />
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowVersionDialog(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => { setShowVersionDialog(false); saveFormulation(); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Warning Dialog */}
      {showWarningDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Regulatory Advisory</h3>
                <p className="text-sm text-gray-500 mt-1">Your formulation was saved successfully, but contains ingredients with regulatory notes.</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-yellow-800 mb-2">The following ingredients may affect export to certain markets:</p>
              <ul className="space-y-1">
                {regulatoryWarnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              This formulation is suitable for the Indian market. If you plan to export to EU or US markets, please review the regulatory requirements for these ingredients.
            </p>
            
            <div className="flex justify-end">
              <button 
                onClick={handleWarningAcknowledge} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulationEditor;
