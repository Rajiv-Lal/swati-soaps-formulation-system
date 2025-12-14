/**
 * Formulation Form Component
 * 
 * Reusable form for creating and editing formulations with:
 * - Basic info (name, type, grammage)
 * - Ingredient selection with percentages
 * - Cost calculations
 * - Validation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Search, Loader2, AlertCircle } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const FormulationForm = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
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
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [showIngredientDropdown, setShowIngredientDropdown] = useState(false);

  // State
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});

  // Load reference data
  useEffect(() => {
    loadReferenceData();
  }, []);

  // Initialize form with existing data
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
          cost_per_kg: ing.cost_per_kg || ing.landed_cost_net_gst
        }))
      });
    }
  }, [initialData]);

  const loadReferenceData = async () => {
    setDataLoading(true);
    try {
      const [typesRes, ingredientsRes] = await Promise.all([
        api.get('/product-types'),
        api.get('/ingredients')
      ]);

      setProductTypes(typesRes.data.product_types || []);
      setAvailableIngredients(ingredientsRes.data.ingredients || []);
    } catch (err) {
      console.error('Error loading reference data:', err);
      setError('Failed to load form data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  // Filter ingredients based on search
  const filteredIngredients = availableIngredients.filter(ing => {
    // Exclude already added ingredients
    const isAdded = formData.ingredients.some(fi => fi.ingredient_id === ing.id);
    if (isAdded) return false;

    // Filter by search term
    if (!ingredientSearch) return true;
    const search = ingredientSearch.toLowerCase();
    return (
      ing.name?.toLowerCase().includes(search) ||
      ing.inci_name?.toLowerCase().includes(search)
    );
  });

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

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validation[name]) {
      setValidation(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddIngredient = (ingredient) => {
    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          ingredient_id: ingredient.id,
          name: ingredient.name,
          inci_name: ingredient.inci_name,
          percentage: '',
          cost_per_kg: ingredient.landed_cost_net_gst
        }
      ]
    }));
    setIngredientSearch('');
    setShowIngredientDropdown(false);
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientPercentageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, percentage: value } : ing
      )
    }));
  };

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

    // Check if total percentage is close to 100%
    if (formData.ingredients.length > 0) {
      if (totalPercentage < 99 || totalPercentage > 101) {
        errors.total_percentage = `Total percentage is ${totalPercentage.toFixed(2)}%. Should be 100%.`;
      }
    }

    // Check for missing percentages
    const missingPercentages = formData.ingredients.some(
      ing => !ing.percentage || parseFloat(ing.percentage) <= 0
    );
    if (missingPercentages) {
      errors.ingredient_percentages = 'All ingredients must have a valid percentage';
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

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
      // Error handling is done in parent
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                validation.product_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., Lavender Moisturizing Soap"
            />
            {validation.product_name && (
              <p className="mt-1 text-sm text-red-600">{validation.product_name}</p>
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
                validation.product_type_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select type</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {validation.product_type_id && (
              <p className="mt-1 text-sm text-red-600">{validation.product_type_id}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
              <option value="archived">Archived</option>
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
              step="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validation.grammage ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 100"
            />
            {validation.grammage && (
              <p className="mt-1 text-sm text-red-600">{validation.grammage}</p>
            )}
          </div>

          {/* Pack Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pack Count
            </label>
            <input
              type="number"
              name="pack_count"
              value={formData.pack_count}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes about this formulation..."
            />
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Ingredients <span className="text-red-500">*</span>
          </h2>
          <div className="text-sm">
            <span className={totalPercentage >= 99 && totalPercentage <= 101 ? 'text-green-600' : 'text-amber-600'}>
              Total: {totalPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Validation errors */}
        {(validation.ingredients || validation.total_percentage || validation.ingredient_percentages) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            {validation.ingredients && <p className="text-sm text-red-600">{validation.ingredients}</p>}
            {validation.total_percentage && <p className="text-sm text-red-600">{validation.total_percentage}</p>}
            {validation.ingredient_percentages && <p className="text-sm text-red-600">{validation.ingredient_percentages}</p>}
          </div>
        )}

        {/* Add Ingredient Search */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={ingredientSearch}
              onChange={(e) => {
                setIngredientSearch(e.target.value);
                setShowIngredientDropdown(true);
              }}
              onFocus={() => setShowIngredientDropdown(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search ingredients to add..."
            />
          </div>

          {/* Dropdown */}
          {showIngredientDropdown && filteredIngredients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredIngredients.slice(0, 20).map(ing => (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => handleAddIngredient(ing)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{ing.name}</div>
                    {ing.inci_name && (
                      <div className="text-sm text-gray-500">{ing.inci_name}</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    ₹{parseFloat(ing.landed_cost_net_gst || 0).toFixed(2)}/kg
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {showIngredientDropdown && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowIngredientDropdown(false)}
          />
        )}

        {/* Ingredients Table */}
        {formData.ingredients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Percentage</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Cost/kg</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Cost Contribution</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formData.ingredients.map((ing, index) => {
                  const pct = parseFloat(ing.percentage) || 0;
                  const cost = parseFloat(ing.cost_per_kg) || 0;
                  const contribution = (pct / 100) * cost;

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{ing.name}</div>
                        {ing.inci_name && (
                          <div className="text-sm text-gray-500">{ing.inci_name}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={ing.percentage}
                            onChange={(e) => handleIngredientPercentageChange(index, e.target.value)}
                            min="0"
                            max="100"
                            step="0.01"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        ₹{cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">
                        ₹{contribution.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No ingredients added yet. Use the search box above to add ingredients.
          </div>
        )}
      </div>

      {/* Cost Summary */}
      {formData.ingredients.length > 0 && grammageValue > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-4">Cost Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-blue-600">Cost per kg</div>
              <div className="text-2xl font-bold text-blue-900">₹{totalCostPerKg.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-blue-600">Cost per piece ({grammageValue}g)</div>
              <div className="text-2xl font-bold text-blue-900">₹{costPerPiece.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-blue-600">Cost per pack ({formData.pack_count} pcs)</div>
              <div className="text-2xl font-bold text-blue-900">
                ₹{(costPerPiece * parseInt(formData.pack_count || 1)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default FormulationForm;
