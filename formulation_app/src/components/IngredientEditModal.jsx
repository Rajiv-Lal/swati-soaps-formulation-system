import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const IngredientEditModal = ({ isOpen, onClose, onSuccess, ingredientId }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    subcategory_id: '',
    landed_cost_net_gst: '',
    stock_status: 'in_stock',
    supplier_id: '',
    hsn_code: '',
    cas_number: '',
    inci_name: '',
    minimum_order_qty: '1',
    unit_of_measure: 'kg',
    storage_conditions: '',
    shelf_life_months: '',
    tags: []
  });
  
  const [validation, setValidation] = useState({});

  // Load ingredient data and reference data
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
    setInitialLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Load reference data and ingredient in parallel
      const [categoriesRes, suppliersRes, ingredientRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`, { headers }),
        axios.get(`${API_BASE_URL}/suppliers`, { headers }),
        axios.get(`${API_BASE_URL}/ingredients/${ingredientId}`, { headers })
      ]);

      setCategories(categoriesRes.data.categories || []);
      setSuppliers(suppliersRes.data.suppliers || []);

      // Populate form with ingredient data
      const ing = ingredientRes.data.ingredient;
      setFormData({
        name: ing.name || '',
        category_id: ing.category_id?.toString() || '',
        subcategory_id: ing.subcategory_id?.toString() || '',
        landed_cost_net_gst: ing.landed_cost_net_gst?.toString() || '',
        stock_status: ing.stock_status || 'in_stock',
        supplier_id: ing.supplier_id?.toString() || '',
        hsn_code: ing.hsn_code || '',
        cas_number: ing.cas_number || '',
        inci_name: ing.inci_name || '',
        minimum_order_qty: ing.minimum_order_qty?.toString() || '1',
        unit_of_measure: ing.unit_of_measure || 'kg',
        storage_conditions: ing.storage_conditions || '',
        shelf_life_months: ing.shelf_life_months?.toString() || '',
        tags: ing.tags || []
      });

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load ingredient data');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/subcategories/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubcategories(response.data.subcategories || []);
    } catch (err) {
      console.error('Error loading subcategories:', err);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = 'Ingredient name is required';
    } else if (formData.name.trim().length > 200) {
      errors.name = 'Name must be less than 200 characters';
    }

    if (!formData.landed_cost_net_gst || formData.landed_cost_net_gst === '') {
      errors.landed_cost_net_gst = 'Cost is required';
    } else if (parseFloat(formData.landed_cost_net_gst) < 0) {
      errors.landed_cost_net_gst = 'Cost must be positive';
    } else if (parseFloat(formData.landed_cost_net_gst) > 1000000) {
      errors.landed_cost_net_gst = 'Cost seems unreasonably high';
    }

    if (!formData.category_id) {
      errors.category_id = 'Category is required';
    }

    if (formData.hsn_code && !/^\d{4,8}$/.test(formData.hsn_code)) {
      errors.hsn_code = 'HSN code must be 4-8 digits';
    }

    if (formData.minimum_order_qty && parseFloat(formData.minimum_order_qty) <= 0) {
      errors.minimum_order_qty = 'Minimum order quantity must be positive';
    }

    if (formData.shelf_life_months && (
      parseInt(formData.shelf_life_months) < 0 || 
      parseInt(formData.shelf_life_months) > 120
    )) {
      errors.shelf_life_months = 'Shelf life must be between 0 and 120 months';
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validation[name]) {
      setValidation(prev => {
        const newValidation = { ...prev };
        delete newValidation[name];
        return newValidation;
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const submitData = {
        ...formData,
        landed_cost_net_gst: parseFloat(formData.landed_cost_net_gst),
        minimum_order_qty: parseFloat(formData.minimum_order_qty),
        shelf_life_months: formData.shelf_life_months ? parseInt(formData.shelf_life_months) : null,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null
      };

      await axios.put(
        `${API_BASE_URL}/ingredients/${ingredientId}`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Error updating ingredient:', err);
      setError(
        err.response?.data?.error || 
        'Failed to update ingredient. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValidation({});
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Ingredient</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading || initialLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {initialLoading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading ingredient data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
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
                        validation.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {validation.name && (
                      <p className="mt-1 text-sm text-red-600">{validation.name}</p>
                    )}
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
                        validation.category_id ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    >
                      <option value="">Select category...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {validation.category_id && (
                      <p className="mt-1 text-sm text-red-600">{validation.category_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      name="subcategory_id"
                      value={formData.subcategory_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading || !formData.category_id || subcategories.length === 0}
                    >
                      <option value="">Select subcategory...</option>
                      {subcategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Landed Cost (₹/kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="landed_cost_net_gst"
                      value={formData.landed_cost_net_gst}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validation.landed_cost_net_gst ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {validation.landed_cost_net_gst && (
                      <p className="mt-1 text-sm text-red-600">{validation.landed_cost_net_gst}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Status
                    </label>
                    <select
                      name="stock_status"
                      value={formData.stock_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier
                    </label>
                    <select
                      name="supplier_id"
                      value={formData.supplier_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="">Select supplier...</option>
                      {suppliers.map(sup => (
                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit of Measure
                    </label>
                    <select
                      name="unit_of_measure"
                      value={formData.unit_of_measure}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="l">Liters (l)</option>
                      <option value="ml">Milliliters (ml)</option>
                      <option value="pieces">Pieces</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order Quantity
                    </label>
                    <input
                      type="number"
                      name="minimum_order_qty"
                      value={formData.minimum_order_qty}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validation.minimum_order_qty ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {validation.minimum_order_qty && (
                      <p className="mt-1 text-sm text-red-600">{validation.minimum_order_qty}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelf Life (months)
                    </label>
                    <input
                      type="number"
                      name="shelf_life_months"
                      value={formData.shelf_life_months}
                      onChange={handleChange}
                      min="0"
                      max="120"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validation.shelf_life_months ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {validation.shelf_life_months && (
                      <p className="mt-1 text-sm text-red-600">{validation.shelf_life_months}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Chemical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chemical Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      name="hsn_code"
                      value={formData.hsn_code}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validation.hsn_code ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {validation.hsn_code && (
                      <p className="mt-1 text-sm text-red-600">{validation.hsn_code}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CAS Number
                    </label>
                    <input
                      type="text"
                      name="cas_number"
                      value={formData.cas_number}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      INCI Name
                    </label>
                    <input
                      type="text"
                      name="inci_name"
                      value={formData.inci_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Storage & Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage & Usage</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Conditions
                  </label>
                  <textarea
                    name="storage_conditions"
                    value={formData.storage_conditions}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['soaps', 'cosmetics', 'both'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          formData.tags.includes(tag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={loading}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Updating...' : 'Update Ingredient'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientEditModal;
