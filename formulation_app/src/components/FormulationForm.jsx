import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Calculator } from 'lucide-react';
import axios from 'axios';
import IngredientSelector from './IngredientSelector';

const API_BASE_URL = '/api';

const FormulationForm = ({ initialData = null, onSubmit, onCancel, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Reference data
  const [ingredients, setIngredients] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [benefits, setBenefits] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    product_name: '',
    product_type_id: '',
    grammage: '75',
    pack_count: '1',
    status: 'draft',
    notes: '',
    ingredients: [],
    tags: [],
    benefits: []
  });

  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientPercentage, setIngredientPercentage] = useState('');

  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        product_name: initialData.product_name || '',
        product_type_id: initialData.product_type_id?.toString() || '',
        grammage: initialData.grammage?.toString() || '75',
        pack_count: initialData.pack_count?.toString() || '1',
        status: initialData.status || 'draft',
        notes: initialData.notes || '',
        ingredients: initialData.ingredients || [],
        tags: initialData.tags || [],
        benefits: initialData.benefits || []
      });
    }
  }, [initialData]);

  const loadReferenceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [ingredientsRes, productTypesRes, tagsRes, benefitsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/ingredients`, { headers }),
        axios.get(`${API_BASE_URL}/product-types`, { headers }),
        axios.get(`${API_BASE_URL}/tags`, { headers }),
        axios.get(`${API_BASE_URL}/benefits`, { headers })
      ]);

      setIngredients(ingredientsRes.data.ingredients || []);
      setProductTypes(productTypesRes.data.product_types || []);
      setTags(tagsRes.data.tags || []);
      setBenefits(benefitsRes.data.benefits || []);
    } catch (err) {
      console.error('Error loading reference data:', err);
      setError('Failed to load form data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient || !ingredientPercentage) {
      alert('Please select an ingredient and enter a percentage');
      return;
    }

    const percentage = parseFloat(ingredientPercentage);
    if (percentage <= 0 || percentage > 100) {
      alert('Percentage must be between 0 and 100');
      return;
    }

    // Check if ingredient already added
    if (formData.ingredients.find(ing => ing.ingredient_id === parseInt(selectedIngredient))) {
      alert('This ingredient is already in the formulation');
      return;
    }

    const ingredient = ingredients.find(ing => ing.id === parseInt(selectedIngredient));
    if (!ingredient) return;

    const grammage = parseFloat(formData.grammage) || 75;
    const quantity_grams = (percentage / 100) * grammage;
    const cost_per_piece = (quantity_grams / 1000) * ingredient.landed_cost_net_gst;

    setFormData(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          ingredient_id: ingredient.id,
          ingredient_name: ingredient.name,
          percentage: percentage,
          quantity_grams: quantity_grams,
          cost_per_piece: cost_per_piece,
          unit_cost: ingredient.landed_cost_net_gst
        }
      ]
    }));

    setSelectedIngredient('');
    setIngredientPercentage('');
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleBenefitToggle = (benefitId) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefitId)
        ? prev.benefits.filter(id => id !== benefitId)
        : [...prev.benefits, benefitId]
    }));
  };

  // Recalculate costs when grammage changes
  useEffect(() => {
    if (formData.grammage && formData.ingredients.length > 0) {
      const grammage = parseFloat(formData.grammage) || 75;
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing => {
          const quantity_grams = (ing.percentage / 100) * grammage;
          const cost_per_piece = (quantity_grams / 1000) * ing.unit_cost;
          return {
            ...ing,
            quantity_grams,
            cost_per_piece
          };
        })
      }));
    }
  }, [formData.grammage]);

  const getTotalPercentage = () => {
    return formData.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  };

  const getTotalCost = () => {
    return formData.ingredients.reduce((sum, ing) => sum + ing.cost_per_piece, 0);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.product_name.trim()) {
      errors.push('Product name is required');
    }

    if (!formData.product_type_id) {
      errors.push('Product type is required');
    }

    if (!formData.grammage || parseFloat(formData.grammage) <= 0) {
      errors.push('Grammage must be greater than 0');
    }

    if (formData.ingredients.length === 0) {
      errors.push('At least one ingredient is required');
    }

    const totalPercentage = getTotalPercentage();
    if (Math.abs(totalPercentage - 100) > 0.01) {
      errors.push(`Ingredients must total 100% (currently ${totalPercentage.toFixed(2)}%)`);
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save formulation');
    } finally {
      setLoading(false);
    }
  };

  const totalPercentage = getTotalPercentage();
  const totalCost = getTotalCost();
  const percentageValid = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type *
            </label>
            <select
              name="product_type_id"
              value={formData.product_type_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Select product type...</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grammage (g) *
            </label>
            <input
              type="number"
              name="grammage"
              value={formData.grammage}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients *</h3>
        
        {/* Add Ingredient */}
        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Ingredient
              </label>
              <IngredientSelector
                ingredients={ingredients}
                onSelect={(ing) => {
                  setSelectedIngredient(ing.id.toString());
                  // Auto-focus percentage input
                  setTimeout(() => {
                    document.getElementById('ingredient-percentage')?.focus();
                  }, 100);
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add to Formulation
              </label>
              {selectedIngredient && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {ingredients.find(i => i.id === parseInt(selectedIngredient))?.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    Cost: ₹{ingredients.find(i => i.id === parseInt(selectedIngredient))?.landed_cost_net_gst}/kg
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        id="ingredient-percentage"
                        type="number"
                        value={ingredientPercentage}
                        onChange={(e) => setIngredientPercentage(e.target.value)}
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Percentage (%)"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddIngredient();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              )}
              {!selectedIngredient && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 text-center">
                  Select an ingredient from the list →
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        {formData.ingredients.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity (g)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/Piece</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.ingredients.map((ing, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">{ing.ingredient_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ing.percentage.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{ing.quantity_grams.toFixed(3)}g</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{ing.cost_per_piece.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${percentageValid ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPercentage.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formData.grammage}g
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ₹{totalCost.toFixed(4)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No ingredients added yet. Add ingredients above.
          </div>
        )}

        {!percentageValid && formData.ingredients.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Total percentage must equal 100% (currently {totalPercentage.toFixed(2)}%)</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.tags.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={loading}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skin Benefits</h3>
          <div className="flex flex-wrap gap-2">
            {benefits.map(benefit => (
              <button
                key={benefit.id}
                type="button"
                onClick={() => handleBenefitToggle(benefit.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  formData.benefits.includes(benefit.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={loading}
              >
                {benefit.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Cost Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Cost/Piece</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalCost.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pack Count</p>
            <p className="text-2xl font-bold text-gray-900">{formData.pack_count}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cost/Pack</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{(totalCost * parseInt(formData.pack_count || 1)).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ingredients</p>
            <p className="text-2xl font-bold text-gray-900">{formData.ingredients.length}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading || !percentageValid}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Formulation' : 'Create Formulation')}
        </button>
      </div>
    </form>
  );
};

export default FormulationForm;
