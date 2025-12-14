/**
 * Ingredient Edit Modal
 * 
 * Modal form for editing existing ingredients
 */

import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const IngredientEditModal = ({ isOpen, onClose, onSuccess, ingredientId }) => {
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    inci_name: '',
    cas_number: '',
    category_id: '',
    subcategory_id: '',
    supplier_id: '',
    landed_cost_net_gst: '',
    stock_status: 'in_stock',
    unit_of_measure: 'kg',
    minimum_order_qty: '1',
    storage_conditions: '',
    shelf_life_months: '',
    tags: [],
    cosing_ref: '',
    einecs: '',
    eu_approved: true,
    us_approved: true,
    safety_notes: ''
  });

  // Reference data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // State
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && ingredientId) {
      loadData();
    }
  }, [isOpen, ingredientId]);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category_id) {
      loadSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
    }
  }, [formData.category_id]);

  const loadData = async () => {
    setDataLoading(true);
    setError(null);

    try {
      const [categoriesRes, suppliersRes, ingredientRes, tagsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/suppliers'),
        api.get(`/ingredients/${ingredientId}`),
        api.get('/tags').catch(() => ({ data: { tags: [] } }))
      ]);

      setCategories(categoriesRes.data.categories || []);
      setSuppliers(suppliersRes.data.suppliers || []);
      setAvailableTags((tagsRes.data.tags || []).map(t => t.name));

      const ing = ingredientRes.data.ingredient || ingredientRes.data;
      const reg = ing.regulatory || {};

      setFormData({
        name: ing.name || '',
        inci_name: ing.inci_name || '',
        cas_number: ing.cas_number || '',
        category_id: ing.category_id?.toString() || '',
        subcategory_id: ing.subcategory_id?.toString() || '',
        supplier_id: ing.supplier_id?.toString() || '',
        landed_cost_net_gst: ing.landed_cost_net_gst?.toString() || '',
        stock_status: ing.stock_status || 'in_stock',
        unit_of_measure: ing.unit_of_measure || 'kg',
        minimum_order_qty: ing.minimum_order_qty?.toString() || '1',
        storage_conditions: ing.storage_conditions || '',
        shelf_life_months: ing.shelf_life_months?.toString() || '',
        tags: ing.tags || [],
        cosing_ref: reg.cosing_ref || '',
        einecs: reg.einecs || '',
        eu_approved: reg.eu_approved !== false,
        us_approved: reg.us_approved !== false,
        safety_notes: reg.safety_notes || ''
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setError(getErrorMessage(err));
    } finally {
      setDataLoading(false);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const response = await api.get(`/subcategories/${categoryId}`);
      setSubcategories(response.data.subcategories || []);
    } catch (err) {
      setSubcategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validation[name]) {
      setValidation(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Ingredient name is required';
    if (!formData.category_id) errors.category_id = 'Category is required';
    if (!formData.landed_cost_net_gst) errors.landed_cost_net_gst = 'Cost is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        inci_name: formData.inci_name.trim() || null,
        cas_number: formData.cas_number.trim() || null,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null,
        landed_cost_net_gst: parseFloat(formData.landed_cost_net_gst),
        stock_status: formData.stock_status,
        unit_of_measure: formData.unit_of_measure,
        minimum_order_qty: parseFloat(formData.minimum_order_qty) || 1,
        storage_conditions: formData.storage_conditions.trim() || null,
        shelf_life_months: formData.shelf_life_months ? parseInt(formData.shelf_life_months) : null,
        tags: formData.tags,
        regulatory: {
          cosing_ref: formData.cosing_ref.trim() || null,
          einecs: formData.einecs.trim() || null,
          eu_approved: formData.eu_approved,
          us_approved: formData.us_approved,
          safety_notes: formData.safety_notes.trim() || null
        }
      };

      await api.put(`/ingredients/${ingredientId}`, submitData);
      onSuccess();
    } catch (err) {
      console.error('Error updating ingredient:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Ingredient</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validation.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {validation.name && <p className="mt-1 text-sm text-red-600">{validation.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">INCI Name</label>
                  <input
                    type="text"
                    name="inci_name"
                    value={formData.inci_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CAS Number</label>
                  <input
                    type="text"
                    name="cas_number"
                    value={formData.cas_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validation.category_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost (₹/kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="landed_cost_net_gst"
                    value={formData.landed_cost_net_gst}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validation.landed_cost_net_gst ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                  <select
                    name="stock_status"
                    value={formData.stock_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    name="supplier_id"
                    value={formData.supplier_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map(sup => (
                      <option key={sup.id} value={sup.id}>{sup.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              {availableTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          formData.tags.includes(tag)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || dataLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientEditModal;
