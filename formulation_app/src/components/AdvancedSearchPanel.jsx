import React, { useState, useEffect } from 'react';
import { X, Search, Filter, XCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const AdvancedSearchPanel = ({ isOpen, onClose, onSearch }) => {
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [benefits, setBenefits] = useState([]);
  
  const [filters, setFilters] = useState({
    text: '',
    product_types: [],
    statuses: [],
    min_cost: '',
    max_cost: '',
    date_from: '',
    date_to: '',
    benefits: [],
    has_tests: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadReferenceData();
    }
  }, [isOpen]);

  const loadReferenceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [typesRes, benefitsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/product-types`, { headers }),
        axios.get(`${API_BASE_URL}/benefits`, { headers })
      ]);

      setProductTypes(typesRes.data.product_types || []);
      setBenefits(benefitsRes.data.benefits || []);
    } catch (err) {
      console.error('Error loading reference data:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectToggle = (field, value) => {
    setFilters(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSearch = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Build search payload
      const searchPayload = {};
      
      if (filters.text) searchPayload.text = filters.text;
      if (filters.product_types.length > 0) searchPayload.product_types = filters.product_types;
      if (filters.statuses.length > 0) searchPayload.statuses = filters.statuses;
      if (filters.min_cost) searchPayload.min_cost = parseFloat(filters.min_cost);
      if (filters.max_cost) searchPayload.max_cost = parseFloat(filters.max_cost);
      if (filters.date_from) searchPayload.date_from = filters.date_from;
      if (filters.date_to) searchPayload.date_to = filters.date_to;
      if (filters.benefits.length > 0) searchPayload.benefits = filters.benefits;
      if (filters.has_tests) searchPayload.has_tests = filters.has_tests === 'yes';

      const response = await axios.post(
        `${API_BASE_URL}/search/formulations`,
        searchPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSearch(response.data.formulations || []);
      onClose();
    } catch (err) {
      console.error('Error searching formulations:', err);
      alert('Failed to search formulations');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      text: '',
      product_types: [],
      statuses: [],
      min_cost: '',
      max_cost: '',
      date_from: '',
      date_to: '',
      benefits: [],
      has_tests: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.text) count++;
    if (filters.product_types.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.min_cost || filters.max_cost) count++;
    if (filters.date_from || filters.date_to) count++;
    if (filters.benefits.length > 0) count++;
    if (filters.has_tests) count++;
    return count;
  };

  const removeFilter = (field) => {
    if (field === 'cost') {
      setFilters(prev => ({ ...prev, min_cost: '', max_cost: '' }));
    } else if (field === 'date') {
      setFilters(prev => ({ ...prev, date_from: '', date_to: '' }));
    } else if (Array.isArray(filters[field])) {
      setFilters(prev => ({ ...prev, [field]: [] }));
    } else {
      setFilters(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-6 h-6" />
                Advanced Search
              </h2>
              {activeFiltersCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 space-y-6">
            {/* Text Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Text
              </label>
              <input
                type="text"
                value={filters.text}
                onChange={(e) => handleFilterChange('text', e.target.value)}
                placeholder="Search in product name or notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Types
              </label>
              <div className="flex flex-wrap gap-2">
                {productTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleMultiSelectToggle('product_types', type.id)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      filters.product_types.includes(type.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'draft', label: 'Draft' },
                  { value: 'active', label: 'Active' },
                  { value: 'under_review', label: 'Under Review' },
                  { value: 'archived', label: 'Archived' }
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleMultiSelectToggle('statuses', status.value)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      filters.statuses.includes(status.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Piece (₹)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={filters.min_cost}
                  onChange={(e) => handleFilterChange('min_cost', e.target.value)}
                  placeholder="Min cost"
                  min="0"
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={filters.max_cost}
                  onChange={(e) => handleFilterChange('max_cost', e.target.value)}
                  placeholder="Max cost"
                  min="0"
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created Date
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {benefits.map(benefit => (
                  <button
                    key={benefit.id}
                    type="button"
                    onClick={() => handleMultiSelectToggle('benefits', benefit.id)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      filters.benefits.includes(benefit.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {benefit.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Has Tests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Results
              </label>
              <select
                value={filters.has_tests}
                onChange={(e) => handleFilterChange('has_tests', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="yes">Has test results</option>
                <option value="no">No test results</option>
              </select>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Active Filters</h4>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.text && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      Text: "{filters.text}"
                      <button
                        onClick={() => removeFilter('text')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.product_types.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      Product Types: {filters.product_types.length}
                      <button
                        onClick={() => removeFilter('product_types')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.statuses.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      Statuses: {filters.statuses.length}
                      <button
                        onClick={() => removeFilter('statuses')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.min_cost || filters.max_cost) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      Cost: {filters.min_cost || '0'} - {filters.max_cost || '∞'}
                      <button
                        onClick={() => removeFilter('cost')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.date_from || filters.date_to) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      Date Range
                      <button
                        onClick={() => removeFilter('date')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.benefits.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      Benefits: {filters.benefits.length}
                      <button
                        onClick={() => removeFilter('benefits')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.has_tests && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-sm">
                      {filters.has_tests === 'yes' ? 'Has Tests' : 'No Tests'}
                      <button
                        onClick={() => removeFilter('has_tests')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All Filters
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPanel;
