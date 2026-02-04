/**
 * Ingredient Export Modal
 * Filter and export ingredients to CSV
 */

import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const IngredientExportModal = ({ isOpen, onClose, categories = [] }) => {
  const [filters, setFilters] = useState({
    category_id: '',
    regulatory: true,
    properties: true,
    marketing: true,
    eu_approved: '',
    us_approved: '',
    stock_status: ''
  });
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Build query string
      const params = new URLSearchParams();
      if (filters.category_id) params.append('category_id', filters.category_id);
      params.append('regulatory', filters.regulatory);
      params.append('properties', filters.properties);
      params.append('marketing', filters.marketing);
      if (filters.eu_approved) params.append('eu_approved', filters.eu_approved);
      if (filters.us_approved) params.append('us_approved', filters.us_approved);
      if (filters.stock_status) params.append('stock_status', filters.stock_status);
      
      const response = await fetch(`${API_BASE}/ingredients/export-csv?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ingredients_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      onClose();
    } catch (err) {
      setError(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Export Ingredients</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              value={filters.stock_status}
              onChange={(e) => handleFilterChange('stock_status', e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Approval Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EU Approved
              </label>
              <select
                value={filters.eu_approved}
                onChange={(e) => handleFilterChange('eu_approved', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                US Approved
              </label>
              <select
                value={filters.us_approved}
                onChange={(e) => handleFilterChange('us_approved', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Include Data Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Data
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.regulatory}
                  onChange={(e) => handleFilterChange('regulatory', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Regulatory (EINECS, COSING, EU/US approval)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.properties}
                  onChange={(e) => handleFilterChange('properties', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Properties (SAP, Hardness, Lather)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.marketing}
                  onChange={(e) => handleFilterChange('marketing', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Marketing (Applications, Benefits)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientExportModal;
