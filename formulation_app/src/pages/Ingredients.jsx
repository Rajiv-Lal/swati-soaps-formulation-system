/**
 * Ingredients Page
 * 
 * Displays and manages the ingredient library with:
 * - Search and filtering
 * - Category grouping
 * - Add/Edit/Delete operations
 * - Import functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Filter, Edit2, Trash2, AlertCircle, 
  RefreshCw, ChevronDown, ChevronRight, Upload, Package 
} from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../components/common/Toast';
import LoadingSpinner, { PageLoading } from '../components/common/LoadingSpinner';
import IngredientAddModal from '../components/IngredientAddModal';
import IngredientEditModal from '../components/IngredientEditModal';
import IngredientImportModal from '../components/IngredientImportModal';

const Ingredients = () => {
  // Data state
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingIngredientId, setEditingIngredientId] = useState(null);
  
  // Filter and view states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'list'
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toast notifications
  const { showSuccess, showError } = useToast();

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [ingredientsRes, categoriesRes] = await Promise.all([
        api.get('/ingredients'),
        api.get('/categories')
      ]);

      const ingredientsList = ingredientsRes.data.ingredients || [];
      const categoriesList = categoriesRes.data.categories || [];

      setIngredients(ingredientsList);
      setCategories(categoriesList);
      
      // Expand all categories by default
      const expanded = {};
      categoriesList.forEach(cat => {
        expanded[cat.id] = true;
      });
      setExpandedCategories(expanded);

    } catch (err) {
      console.error('Error loading data:', err);
      const message = getErrorMessage(err);
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const loadIngredients = useCallback(async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category_id = selectedCategory;

      const response = await api.get('/ingredients', { params });
      setIngredients(response.data.ingredients || []);
    } catch (err) {
      console.error('Error loading ingredients:', err);
    }
  }, [searchTerm, selectedCategory]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload ingredients when filters change
  useEffect(() => {
    if (!loading) {
      loadIngredients();
    }
  }, [searchTerm, selectedCategory]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/ingredients/${id}`);
      setIngredients(prev => prev.filter(ing => ing.id !== id));
      showSuccess(`"${name}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      showError(getErrorMessage(err));
    }
  };

  const handleEdit = (id) => {
    setEditingIngredientId(id);
    setShowEditModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    loadIngredients();
    showSuccess('Ingredient added successfully');
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingIngredientId(null);
    loadIngredients();
    showSuccess('Ingredient updated successfully');
  };

  const handleImportSuccess = (result) => {
    setShowImportModal(false);
    loadIngredients();
    showSuccess(`Imported ${result.imported || 0} ingredients`);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  // ---------------------------------------------------------------------------
  // DATA PROCESSING
  // ---------------------------------------------------------------------------

  // Group ingredients by category
  const groupedIngredients = ingredients.reduce((acc, ing) => {
    const catId = ing.category_id || 'uncategorized';
    if (!acc[catId]) {
      acc[catId] = [];
    }
    acc[catId].push(ing);
    return acc;
  }, {});

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const renderIngredientCard = (ingredient) => (
    <div
      key={ingredient.id}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{ingredient.name}</h3>
          {ingredient.inci_name && (
            <p className="text-sm text-gray-500 truncate">{ingredient.inci_name}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => handleEdit(ingredient.id)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(ingredient.id, ingredient.name)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          ${ingredient.stock_status === 'in_stock' 
            ? 'bg-green-100 text-green-700' 
            : ingredient.stock_status === 'low_stock'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700'
          }
        `}>
          {ingredient.stock_status === 'in_stock' ? 'In Stock' : 
           ingredient.stock_status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
        </span>
        {ingredient.landed_cost_net_gst && (
          <span className="text-gray-600 font-medium">
            ₹{parseFloat(ingredient.landed_cost_net_gst).toFixed(2)}/{ingredient.unit_of_measure || 'kg'}
          </span>
        )}
      </div>
    </div>
  );

  const renderGroupedView = () => (
    <div className="space-y-4">
      {Object.entries(groupedIngredients).map(([categoryId, categoryIngredients]) => (
        <div key={categoryId} className="bg-white rounded-lg shadow-sm border">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(categoryId)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
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
            </div>
          </button>

          {/* Category Ingredients */}
          {expandedCategories[categoryId] && (
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryIngredients.map(renderIngredientCard)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {ingredients.map((ing) => (
            <tr key={ing.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">{ing.name}</div>
                  {ing.inci_name && (
                    <div className="text-sm text-gray-500">{ing.inci_name}</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {getCategoryName(ing.category_id)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {ing.landed_cost_net_gst 
                  ? `₹${parseFloat(ing.landed_cost_net_gst).toFixed(2)}/${ing.unit_of_measure || 'kg'}`
                  : '-'
                }
              </td>
              <td className="px-4 py-3">
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${ing.stock_status === 'in_stock' 
                    ? 'bg-green-100 text-green-700' 
                    : ing.stock_status === 'low_stock'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }
                `}>
                  {ing.stock_status === 'in_stock' ? 'In Stock' : 
                   ing.stock_status === 'low_stock' ? 'Low Stock' : 'Out'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleEdit(ing.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ing.id, ing.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  if (loading && ingredients.length === 0) {
    return <PageLoading message="Loading ingredients..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingredient Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your ingredient inventory and specifications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Import Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Ingredient
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ingredients by name, INCI, or CAS number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              px-4 py-2 border rounded-md flex items-center gap-2 transition-colors
              ${showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          {/* View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'grouped' ? 'list' : 'grouped')}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            {viewMode === 'grouped' ? 'List View' : 'Grouped View'}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}
          {(searchTerm || selectedCategory) && ' (filtered)'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={loadData}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {ingredients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory ? 'No ingredients found' : 'No ingredients yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory
              ? 'Try adjusting your filters or search terms'
              : 'Get started by adding your first ingredient'
            }
          </p>
          {!(searchTerm || selectedCategory) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add First Ingredient
            </button>
          )}
        </div>
      ) : (
        viewMode === 'grouped' ? renderGroupedView() : renderListView()
      )}

      {/* Modals */}
      <IngredientAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      <IngredientEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingIngredientId(null);
        }}
        onSuccess={handleEditSuccess}
        ingredientId={editingIngredientId}
      />

      <IngredientImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default Ingredients;
