/**
 * Formulation Builder Component
 * 
 * Split-panel interface for creating formulations:
 * - Left: Browse ingredients by category (in formulation-logical order)
 * - Right: Selected ingredients with percentages and costs
 * 
 * Categories ordered for soap/cosmetic formulation workflow:
 * 1. Soap Base → 2. Surfactants → 3. Carrier Oils → 4. Actives → 5. Additives
 * 6. Butters → 7. Botanicals → 8. Essential Oils → 9. Fragrances → 10. Colorants → 11. Others
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ChevronDown, ChevronRight, Plus, Trash2, 
  Loader2, AlertCircle, Check, Package
} from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

// Category display order for formulation workflow
const CATEGORY_ORDER = [
  { dbName: 'Soap Bases', displayName: 'Soap Base', order: 1 },
  { dbName: 'Surfactants', displayName: 'Surfactants', order: 2 },
  { dbName: 'Carrier/Base Oils', displayName: 'Carrier Oils', order: 3 },
  { dbName: 'Active Ingredients', displayName: 'Actives', order: 4 },
  { dbName: 'Additives', displayName: 'Additives', order: 5 },
  { dbName: 'Butters', displayName: 'Butters', order: 6 },
  { dbName: 'Botanicals & Extracts', displayName: 'Botanicals', order: 7 },
  { dbName: 'Essential Oils', displayName: 'Essential Oils', order: 8 },
  { dbName: 'Fragrances', displayName: 'Perfumes', order: 9 },
  { dbName: 'Colorants', displayName: 'Colorants', order: 10 },
  { dbName: 'Miscellaneous Raw Materials', displayName: 'Others', order: 11 },
];

const FormulationBuilder = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
  // Form data
  const [formData, setFormData] = useState({
    product_name: '',
    product_type_id: '',
    grammage: '',
    pack_count: '1',
    status: 'draft',
    notes: '',
    ingredients: []
  });

  // Reference data
  const [productTypes, setProductTypes] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Load reference data
  useEffect(() => {
    loadReferenceData();
  }, []);

  // Initialize form with existing data (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        product_name: initialData.product_name || '',
        product_type_id: initialData.product_type_id?.toString() || '',
        grammage: initialData.grammage?.toString() || '',
        pack_count: initialData.pack_count?.toString() || '1',
        status: initialData.status || 'draft',
        notes: initialData.notes || '',
        ingredients: (initialData.ingredients || []).map(ing => ({
          ingredient_id: ing.ingredient_id || ing.id,
          name: ing.name,
          inci_name: ing.inci_name,
          percentage: ing.percentage?.toString() || '',
          cost_per_kg: ing.cost_per_kg || ing.landed_cost_net_gst,
          category_id: ing.category_id
        }))
      });
    }
  }, [initialData]);

  const loadReferenceData = async () => {
    setDataLoading(true);
    try {
      const [typesRes, ingredientsRes, categoriesRes] = await Promise.all([
        api.get('/product-types'),
        api.get('/ingredients'),
        api.get('/categories')
      ]);

      setProductTypes(typesRes.data.product_types || []);
      setAllIngredients(ingredientsRes.data.ingredients || []);
      setCategories(categoriesRes.data.categories || []);
      
      // Auto-expand first category
      const cats = categoriesRes.data.categories || [];
      if (cats.length > 0) {
        const firstCat = getOrderedCategories(cats)[0];
        if (firstCat) {
          setExpandedCategories({ [firstCat.id]: true });
        }
      }
    } catch (err) {
      console.error('Error loading reference data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  // Get category order index
  const getCategoryOrder = (categoryName) => {
    const found = CATEGORY_ORDER.find(c => c.dbName === categoryName);
    return found ? found.order : 99;
  };

  // Get display name for category
  const getCategoryDisplayName = (categoryName) => {
    const found = CATEGORY_ORDER.find(c => c.dbName === categoryName);
    return found ? found.displayName : categoryName;
  };

  // Sort categories by formulation order
  const getOrderedCategories = (cats) => {
    return [...cats].sort((a, b) => getCategoryOrder(a.name) - getCategoryOrder(b.name));
  };

  // Group and order ingredients by category
  const orderedCategories = useMemo(() => {
    return getOrderedCategories(categories);
  }, [categories]);

  // Filter ingredients by search term and group by category
  const filteredIngredientsByCategory = useMemo(() => {
    const result = {};
    
    orderedCategories.forEach(cat => {
      const categoryIngredients = allIngredients.filter(ing => {
        // Match category
        if (ing.category_id !== cat.id) return false;
        
        // Apply search filter
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          const nameMatch = ing.name?.toLowerCase().includes(search);
          const inciMatch = ing.inci_name?.toLowerCase().includes(search);
          return nameMatch || inciMatch;
        }
        return true;
      });
      
      if (categoryIngredients.length > 0) {
        result[cat.id] = {
          category: cat,
          displayName: getCategoryDisplayName(cat.name),
          ingredients: categoryIngredients
        };
      }
    });
    
    return result;
  }, [orderedCategories, allIngredients, searchTerm]);

  // Check if ingredient is already added
  const isIngredientAdded = (ingredientId) => {
    return formData.ingredients.some(ing => ing.ingredient_id === ingredientId);
  };

  // Calculate totals
  const totalPercentage = formData.ingredients.reduce(
    (sum, ing) => sum + (parseFloat(ing.percentage) || 0), 0
  );

  const totalCostPerKg = formData.ingredients.reduce((sum, ing) => {
    const pct = parseFloat(ing.percentage) || 0;
    const cost = parseFloat(ing.cost_per_kg) || 0;
    return sum + (pct / 100) * cost;
  }, 0);

  const grammageValue = parseFloat(formData.grammage) || 0;
  const costPerPiece = grammageValue > 0 ? (totalCostPerKg * grammageValue / 1000) : 0;

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validation[name]) {
      setValidation(prev => ({ ...prev, [name]: null }));
    }
  };

  // Add ingredient to formula
  const handleAddIngredient = (ingredient) => {
    if (isIngredientAdded(ingredient.id)) return;
    
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          ingredient_id: ingredient.id,
          name: ingredient.name,
          inci_name: ingredient.inci_name,
          percentage: '',
          cost_per_kg: ingredient.landed_cost_net_gst,
          category_id: ingredient.category_id
        }
      ]
    }));
  };

  // Remove ingredient from formula
  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  // Update ingredient percentage
  const handlePercentageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, percentage: value } : ing
      )
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.product_name.trim()) {
      errors.product_name = 'Product name is required';
    }
    if (!formData.product_type_id) {
      errors.product_type_id = 'Product type is required';
    }
    if (!formData.grammage || parseFloat(formData.grammage) <= 0) {
      errors.grammage = 'Valid grammage is required';
    }
    if (formData.ingredients.length === 0) {
      errors.ingredients = 'At least one ingredient is required';
    }

    // Check percentage total
    if (formData.ingredients.length > 0) {
      if (totalPercentage < 99 || totalPercentage > 101) {
        errors.total_percentage = `Total: ${totalPercentage.toFixed(2)}% (need 100%)`;
      }
    }

    // Check for missing percentages
    const missingPct = formData.ingredients.some(ing => !ing.percentage || parseFloat(ing.percentage) <= 0);
    if (missingPct) {
      errors.ingredient_percentages = 'All ingredients need percentages';
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        product_name: formData.product_name.trim(),
        product_type_id: parseInt(formData.product_type_id),
        grammage: parseFloat(formData.grammage),
        pack_count: parseInt(formData.pack_count) || 1,
        status: formData.status,
        notes: formData.notes.trim() || null,
        ingredients: formData.ingredients.map(ing => ({
          ingredient_id: ing.ingredient_id,
          percentage: parseFloat(ing.percentage)
        }))
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validation.product_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Neem & Turmeric Soap"
            />
            {validation.product_name && (
              <p className="text-red-500 text-sm mt-1">{validation.product_name}</p>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              name="product_type_id"
              value={formData.product_type_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validation.product_type_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select type...</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Grammage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grammage (g) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="grammage"
              value={formData.grammage}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validation.grammage ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Pack Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pack Count</label>
            <input
              type="number"
              name="pack_count"
              value={formData.pack_count}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Split Panel: Ingredients Browser + Selected Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT PANEL: Ingredient Browser */}
        <div className="bg-white rounded-lg border overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Available Ingredients</h2>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Search by name or INCI..."
              />
            </div>
          </div>

          {/* Category List */}
          <div className="flex-1 overflow-y-auto">
            {Object.keys(filteredIngredientsByCategory).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No ingredients match your search' : 'No ingredients available'}
              </div>
            ) : (
              Object.values(filteredIngredientsByCategory).map(({ category, displayName, ingredients }) => (
                <div key={category.id} className="border-b last:border-b-0">
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900">{displayName}</span>
                      <span className="text-sm text-gray-500">({ingredients.length})</span>
                    </div>
                  </button>

                  {/* Ingredients in Category */}
                  {expandedCategories[category.id] && (
                    <div className="bg-gray-50">
                      {ingredients.map(ing => {
                        const isAdded = isIngredientAdded(ing.id);
                        return (
                          <div
                            key={ing.id}
                            className={`flex items-center justify-between px-4 py-2 pl-10 border-t border-gray-100 ${
                              isAdded ? 'bg-green-50' : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {ing.name}
                              </div>
                              {ing.inci_name && (
                                <div className="text-xs text-gray-500 truncate">
                                  {ing.inci_name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 ml-2">
                              <span className="text-xs text-gray-600 whitespace-nowrap">
                                ₹{parseFloat(ing.landed_cost_net_gst || 0).toFixed(0)}/kg
                              </span>
                              {isAdded ? (
                                <span className="flex items-center gap-1 text-green-600 text-xs">
                                  <Check className="w-4 h-4" />
                                  Added
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddIngredient(ing)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                  title="Add to formula"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Your Formula */}
        <div className="bg-white rounded-lg border overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Formula</h2>
              <div className={`text-sm font-medium px-2 py-1 rounded ${
                totalPercentage >= 99 && totalPercentage <= 101 
                  ? 'bg-green-100 text-green-700' 
                  : totalPercentage > 0 
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                Total: {totalPercentage.toFixed(1)}%
              </div>
            </div>
            
            {/* Validation Errors */}
            {(validation.ingredients || validation.total_percentage || validation.ingredient_percentages) && (
              <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
                {validation.ingredients || validation.total_percentage || validation.ingredient_percentages}
              </div>
            )}
          </div>

          {/* Selected Ingredients */}
          <div className="flex-1 overflow-y-auto">
            {formData.ingredients.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No ingredients added yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Browse categories on the left and click + to add
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {formData.ingredients.map((ing, index) => {
                  const pct = parseFloat(ing.percentage) || 0;
                  const cost = parseFloat(ing.cost_per_kg) || 0;
                  const contribution = (pct / 100) * cost;

                  return (
                    <div key={index} className="p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{ing.name}</div>
                          {ing.inci_name && (
                            <div className="text-xs text-gray-500 truncate">{ing.inci_name}</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={ing.percentage}
                            onChange={(e) => handlePercentageChange(index, e.target.value)}
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                        <span className="text-xs text-gray-400">×</span>
                        <span className="text-xs text-gray-500">₹{cost.toFixed(0)}/kg</span>
                        <span className="text-xs text-gray-400">=</span>
                        <span className="text-sm font-medium text-gray-700">₹{contribution.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cost Summary Footer */}
          {formData.ingredients.length > 0 && (
            <div className="p-4 border-t bg-blue-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-blue-600">Cost/kg</div>
                  <div className="text-lg font-bold text-blue-900">₹{totalCostPerKg.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-blue-600">Cost/piece {grammageValue > 0 && `(${grammageValue}g)`}</div>
                  <div className="text-lg font-bold text-blue-900">₹{costPerPiece.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg border p-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional notes about this formulation..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Saving...' : isEdit ? 'Update Formulation' : 'Create Formulation'}
        </button>
      </div>
    </form>
  );
};

export default FormulationBuilder;
