/**
 * Ingredients Page v2.3
 * 
 * FIXES:
 * - Back button to formulations
 * - Clean navigation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Edit2, Trash2, AlertCircle, RefreshCw, 
  ChevronDown, ChevronRight, Upload, ArrowLeft, Package, FlaskConical, Download
} from 'lucide-react';
import IngredientAddModal from '../components/IngredientAddModal';
import IngredientEditModal from '../components/IngredientEditModal';
import IngredientImportModal from '../components/IngredientImportModal';
import IngredientExportModal from '../components/IngredientExportModal';

const API_BASE = 'http://localhost:5000/api';

const Ingredients = () => {
  const navigate = useNavigate();
  
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Filter and view states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grouped');
  const [expandedCategories, setExpandedCategories] = useState({});

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadIngredients();
  }, [searchTerm, selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${getToken()}` };

      const [ingredientsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/ingredients`, { headers }),
        fetch(`${API_BASE}/categories`, { headers })
      ]);

      if (!ingredientsRes.ok) throw new Error('Failed to load ingredients');
      if (!categoriesRes.ok) throw new Error('Failed to load categories');

      const ingredientsData = await ingredientsRes.json();
      const categoriesData = await categoriesRes.json();

      setIngredients(ingredientsData.ingredients || []);
      setCategories(categoriesData.categories || []);
      
      // Expand all categories by default
      const expanded = {};
      (categoriesData.categories || []).forEach(cat => {
        expanded[cat.id] = true;
      });
      setExpandedCategories(expanded);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      let url = `${API_BASE}/ingredients`;
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category_id', selectedCategory);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error('Failed to load ingredients');
      
      const data = await response.json();
      setIngredients(data.ingredients || []);
    } catch (err) {
      console.error('Error loading ingredients:', err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete ingredient "${name}"?\n\nThis cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE}/ingredients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!response.ok) throw new Error('Failed to delete ingredient');
      
      loadIngredients();
    } catch (err) {
      alert(err.message);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const filteredIngredients = ingredients.filter(ing => {
    if (searchTerm && !ing.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory && ing.category_id !== parseInt(selectedCategory)) {
      return false;
    }
    return true;
  });

  const groupedIngredients = filteredIngredients.reduce((acc, ing) => {
    const catId = ing.category_id || 0;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(ing);
    return acc;
  }, {});

  const formatCurrency = (value) => {
    if (!value) return '-';
    return '₹' + parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/formulations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Formulations
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-600" />
              Ingredients Library
            </h1>
            <p className="text-gray-500 mt-1">
              {ingredients.length} ingredients in {categories.length} categories
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/formulations')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              Formulations
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Ingredient
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-2 text-sm ${viewMode === 'grouped' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
            >
              Grouped
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm border-l ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'}`}
            >
              List
            </button>
          </div>

          <button
            onClick={loadData}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Error Loading Ingredients</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Ingredients Display */}
      {filteredIngredients.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Ingredients Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first ingredient'
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Ingredient
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        // Grouped View
        <div className="space-y-4">
          {Object.entries(groupedIngredients).map(([categoryId, categoryIngredients]) => (
            <div key={categoryId} className="bg-white rounded-lg border overflow-hidden">
              <button
                onClick={() => toggleCategory(categoryId)}
                className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 text-left"
              >
                {expandedCategories[categoryId] ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-900">
                  {getCategoryName(parseInt(categoryId))}
                </span>
                <span className="text-sm text-gray-500">
                  ({categoryIngredients.length})
                </span>
              </button>

              {expandedCategories[categoryId] && (
                <div className="px-4 pb-4">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase border-b">
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">INCI</th>
                        <th className="py-2 text-right">Cost/kg</th>
                        <th className="py-2 text-center">Status</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {categoryIngredients.map(ing => (
                        <tr key={ing.id} className="hover:bg-gray-50">
                          <td className="py-2">
                            <div className="font-medium text-gray-900">{ing.name}</div>
                            {ing.cas_number && (
                              <div className="text-xs text-gray-400">CAS: {ing.cas_number}</div>
                            )}
                          </td>
                          <td className="py-2 text-sm text-gray-600">
                            {ing.inci_name || '-'}
                          </td>
                          <td className="py-2 text-sm text-right text-gray-900">
                            {formatCurrency(ing.landed_cost_net_gst)}
                          </td>
                          <td className="py-2 text-center">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs font-medium
                              ${ing.stock_status === 'in_stock' 
                                ? 'bg-green-100 text-green-700' 
                                : ing.stock_status === 'low_stock'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                              }
                            `}>
                              {ing.stock_status === 'in_stock' ? 'In Stock' 
                                : ing.stock_status === 'low_stock' ? 'Low'
                                : 'Out'}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => {
                                setEditingIngredientId(ing.id);
                                setShowEditModal(true);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 mr-1"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(ing.id, ing.name)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">INCI</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/kg</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIngredients.map(ing => (
                <tr key={ing.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{ing.name}</div>
                    {ing.cas_number && (
                      <div className="text-xs text-gray-400">CAS: {ing.cas_number}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getCategoryName(ing.category_id)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ing.inci_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatCurrency(ing.landed_cost_net_gst)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${ing.stock_status === 'in_stock' 
                        ? 'bg-green-100 text-green-700' 
                        : ing.stock_status === 'low_stock'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }
                    `}>
                      {ing.stock_status === 'in_stock' ? 'In Stock' 
                        : ing.stock_status === 'low_stock' ? 'Low'
                        : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditingIngredientId(ing.id);
                        setShowEditModal(true);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800 mr-1"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ing.id, ing.name)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Components */}
      {showAddModal && (
        <IngredientAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); loadData(); }}
          categories={categories}
        />
      )}
      {showEditModal && editingIngredientId && (
        <IngredientEditModal
          isOpen={showEditModal}
          ingredientId={editingIngredientId}
          onClose={() => { setShowEditModal(false); setEditingIngredientId(null); }}
          onSuccess={() => { setShowEditModal(false); setEditingIngredientId(null); loadData(); }}
          categories={categories}
        />
      )}
      {showImportModal && (
        <IngredientImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => { setShowImportModal(false); loadData(); }}
        />
      )}
      
      {showExportModal && (
        <IngredientExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Ingredients;
