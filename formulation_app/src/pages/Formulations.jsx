import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Search, Filter, Edit2, Trash2, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import axios from 'axios';
import FormulationImportModal from '../components/FormulationImportModal';

const API_BASE_URL = '/api';

const Formulations = () => {
  const navigate = useNavigate();
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadFormulations();
  }, []);

  useEffect(() => {
    loadFormulations();
  }, [searchTerm, selectedStatus]);

  const loadFormulations = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedStatus) params.status = selectedStatus;

      const response = await axios.get(`${API_BASE_URL}/formulations`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setFormulations(response.data.formulations || []);
    } catch (err) {
      console.error('Error loading formulations:', err);
      setError('Failed to load formulations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/formulations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormulations(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error deleting formulation:', err);
      alert(err.response?.data?.error || 'Failed to delete formulation');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      draft: 'Draft',
      active: 'Active',
      under_review: 'Under Review',
      archived: 'Archived'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
  };

  if (loading && formulations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Formulations</h1>
            <p className="text-gray-600 mt-1">
              Manage your soap and cosmetic formulations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Import Excel
            </button>
            <button
              onClick={() => navigate('/formulations/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Formulation
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search formulations by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
                showFilters 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="under_review">Under Review</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-end md:col-span-2">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {formulations.length} formulation{formulations.length !== 1 ? 's' : ''}
          {(searchTerm || selectedStatus) && ' (filtered)'}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={loadFormulations}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Formulations Table */}
      {formulations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedStatus ? 'No formulations found' : 'No formulations yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedStatus
              ? 'Try adjusting your filters or search terms'
              : 'Get started by creating your first formulation'
            }
          </p>
          {!(searchTerm || selectedStatus) && (
            <button
              onClick={() => navigate('/formulations/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Create First Formulation
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grammage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost/Piece</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formulations.map((formulation) => (
                  <tr key={formulation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formulation.product_name}</div>
                      {formulation.ingredient_count > 0 && (
                        <div className="text-xs text-gray-500">{formulation.ingredient_count} ingredients</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formulation.product_type_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formulation.grammage}g</div>
                      {formulation.pack_count > 1 && (
                        <div className="text-xs text-gray-500">Pack of {formulation.pack_count}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(formulation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formulation.total_cost_per_piece 
                          ? `₹${parseFloat(formulation.total_cost_per_piece).toFixed(2)}`
                          : '-'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formulation.current_version || 'v1.0'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/formulations/${formulation.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/formulations/${formulation.id}/edit`);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit formulation"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(formulation.id, formulation.product_name);
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete formulation"
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
        </div>
      )}
      
      {/* Import Modal */}
      <FormulationImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={loadFormulations}
      />
    </div>
  );
};

export default Formulations;
