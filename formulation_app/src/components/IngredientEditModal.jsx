import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

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
    tags: [],
    cosing_ref: '',
    einecs: '',
    eu_approved: true,
    us_approved: true,
    safety_notes: ''
  });
  
  const [validation, setValidation] = useState({});
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    if (isOpen && ingredientId) { loadData(); }
  }, [isOpen, ingredientId]);

  useEffect(() => {
    if (formData.category_id) { loadSubcategories(formData.category_id); }
    else { setSubcategories([]); }
  }, [formData.category_id]);

  const loadData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [categoriesRes, suppliersRes, ingredientRes, tagsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/categories`, { headers }),
        axios.get(`${API_BASE_URL}/suppliers`, { headers }),
        axios.get(`${API_BASE_URL}/ingredients/${ingredientId}`, { headers }),
        axios.get(`${API_BASE_URL}/tags`, { headers })
      ]);
      setCategories(categoriesRes.data.categories || []);
      setSuppliers(suppliersRes.data.suppliers || []);
      setAvailableTags((tagsRes.data.tags || []).map(t => t.name));
      const ing = ingredientRes.data.ingredient || ingredientRes.data;
      const reg = ing.regulatory || {};
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
        tags: ing.tags || [],
        cosing_ref: reg.cosing_ref || '',
        einecs: reg.einecs || '',
        eu_approved: reg.eu_approved !== false,
        us_approved: reg.us_approved !== false,
        safety_notes: reg.safety_notes || ''
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
      const response = await axios.get(`${API_BASE_URL}/subcategories/${categoryId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSubcategories(response.data.subcategories || []);
    } catch (err) { console.error('Error loading subcategories:', err); }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name || formData.name.trim().length === 0) errors.name = 'Ingredient name is required';
    if (!formData.landed_cost_net_gst || formData.landed_cost_net_gst === '') errors.landed_cost_net_gst = 'Cost is required';
    if (!formData.category_id) errors.category_id = 'Category is required';
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        name: formData.name, inci_name: formData.inci_name, cas_number: formData.cas_number,
        landed_cost_net_gst: parseFloat(formData.landed_cost_net_gst),
        minimum_order_qty: parseFloat(formData.minimum_order_qty),
        shelf_life_months: formData.shelf_life_months ? parseInt(formData.shelf_life_months) : null,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null,
        hsn_code: formData.hsn_code, stock_status: formData.stock_status,
        unit_of_measure: formData.unit_of_measure, storage_conditions: formData.storage_conditions, tags: formData.tags,
        regulatory: { cosing_ref: formData.cosing_ref, einecs: formData.einecs, eu_approved: formData.eu_approved, us_approved: formData.us_approved, safety_notes: formData.safety_notes }
      };
      await axios.put(`${API_BASE_URL}/ingredients/${ingredientId}`, submitData, { headers: { Authorization: `Bearer ${token}` } });
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ingredient.');
    } finally { setLoading(false); }
  };

  const handleClose = () => { setValidation({}); setError(null); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Ingredient</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
          </div>
          {initialLoading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-600" /><div className="text-sm text-red-800">{error}</div></div>}
              
              <div><h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label><select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="">Select...</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label><select name="subcategory_id" value={formData.subcategory_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={!formData.category_id}><option value="">Select...</option>{subcategories.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                </div>
              </div>

              <div><h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost (Rs/kg) *</label><input type="number" name="landed_cost_net_gst" value={formData.landed_cost_net_gst} onChange={handleChange} step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label><select name="stock_status" value={formData.stock_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="in_stock">In Stock</option><option value="low_stock">Low Stock</option><option value="out_of_stock">Out of Stock</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label><select name="supplier_id" value={formData.supplier_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="">Select...</option>{suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit</label><select name="unit_of_measure" value={formData.unit_of_measure} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"><option value="kg">kg</option><option value="g">g</option><option value="l">l</option><option value="ml">ml</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Order Qty</label><input type="number" name="minimum_order_qty" value={formData.minimum_order_qty} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life (months)</label><input type="number" name="shelf_life_months" value={formData.shelf_life_months} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                </div>
              </div>

              <div><h3 className="text-lg font-semibold text-gray-900 mb-4">Chemical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label><input type="text" name="hsn_code" value={formData.hsn_code} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">CAS Number</label><input type="text" name="cas_number" value={formData.cas_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">INCI Name</label><input type="text" name="inci_name" value={formData.inci_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                </div>
              </div>

              <div><h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">COSING Ref</label><input type="text" name="cosing_ref" value={formData.cosing_ref} onChange={handleChange} placeholder="e.g., 75159" className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">EINECS</label><input type="text" name="einecs" value={formData.einecs} onChange={handleChange} placeholder="e.g., 282-280-1" className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2"><input type="checkbox" name="eu_approved" checked={formData.eu_approved} onChange={handleChange} className="w-4 h-4" /><span className="text-sm text-gray-700">EU Approved</span></label>
                    <label className="flex items-center gap-2"><input type="checkbox" name="us_approved" checked={formData.us_approved} onChange={handleChange} className="w-4 h-4" /><span className="text-sm text-gray-700">US Approved</span></label>
                  </div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Safety Notes</label><textarea name="safety_notes" value={formData.safety_notes} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md" /></div>
                </div>
              </div>

              <div><h3 className="text-lg font-semibold text-gray-900 mb-4">Storage</h3>
                <textarea name="storage_conditions" value={formData.storage_conditions} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Storage conditions..." />
              </div>

              <div className="sticky bottom-0 bg-white border-t -mx-6 -mb-6 px-6 py-4 flex justify-end gap-3">
                <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"><Save className="w-4 h-4" />{loading ? 'Updating...' : 'Update'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientEditModal;
