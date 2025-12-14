/**
 * Formulation Detail Page
 * 
 * Shows detailed formulation information with tabs:
 * - Details: Ingredients and properties
 * - Version History: Timeline and restore
 * - BOM: Bill of materials generator
 * - Test Results: Quality testing data
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Trash2, Copy, AlertCircle,
  FileText, Clock, TestTube, Package
} from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../components/common/Toast';
import { PageLoading } from '../components/common/LoadingSpinner';
import BOMGenerator from '../components/BOMGenerator';
import VersionTimeline from '../components/VersionTimeline';

const FormulationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  // State
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadFormulation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/formulations/${id}`);
      setFormulation(response.data.formulation);
    } catch (err) {
      console.error('Error loading formulation:', err);
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadFormulation();
  }, [loadFormulation]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${formulation.product_name}"?\n\nThis will also delete all versions and test results. This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/formulations/${id}`);
      showSuccess('Formulation deleted successfully');
      navigate('/formulations');
    } catch (err) {
      console.error('Error deleting formulation:', err);
      showError(getErrorMessage(err));
    }
  };

  const handleDuplicate = async () => {
    try {
      const response = await api.post(`/formulations/${id}/duplicate`);
      showSuccess('Formulation duplicated successfully');
      navigate(`/formulations/${response.data.formulation_id}`);
    } catch (err) {
      console.error('Error duplicating formulation:', err);
      showError(getErrorMessage(err));
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
      archived: { bg: 'bg-red-100', text: 'text-red-700', label: 'Archived' },
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Cost per Piece</div>
          <div className="text-2xl font-bold text-gray-900">
            {formulation.total_cost_per_piece 
              ? `₹${parseFloat(formulation.total_cost_per_piece).toFixed(2)}`
              : '-'
            }
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Ingredients</div>
          <div className="text-2xl font-bold text-gray-900">
            {formulation.ingredients?.length || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Percentage</div>
          <div className="text-2xl font-bold text-gray-900">
            {formulation.ingredients?.reduce((sum, ing) => sum + (parseFloat(ing.percentage) || 0), 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b">
          <h3 className="font-medium text-gray-900">Ingredients</h3>
        </div>
        {formulation.ingredients && formulation.ingredients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/kg</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost in Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formulation.ingredients.map((ing, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{ing.ingredient_name}</div>
                      {ing.category_name && (
                        <div className="text-sm text-gray-500">{ing.category_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {parseFloat(ing.percentage).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {ing.landed_cost_net_gst ? `₹${parseFloat(ing.landed_cost_net_gst).toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      {ing.cost_per_piece ? `₹${parseFloat(ing.cost_per_piece).toFixed(4)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No ingredients added yet
          </div>
        )}
      </div>

      {/* Notes */}
      {formulation.notes && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{formulation.notes}</p>
        </div>
      )}
    </div>
  );

  const renderVersionsTab = () => (
    <VersionTimeline 
      formulation={formulation} 
      onVersionSelect={(version) => {
        // Could implement version preview here
        console.log('Selected version:', version);
      }}
      onRestore={() => {
        loadFormulation();
        showSuccess('Version restored successfully');
      }}
    />
  );

  const renderBOMTab = () => (
    <BOMGenerator formulation={formulation} />
  );

  const renderTestsTab = () => (
    <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
      <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <h3 className="font-medium text-gray-900 mb-2">Test Results</h3>
      <p>Test results functionality coming soon</p>
    </div>
  );

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  if (loading) {
    return <PageLoading message="Loading formulation..." />;
  }

  if (error || !formulation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error || 'Formulation not found'}</p>
            <button
              onClick={() => navigate('/formulations')}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Back to Formulations
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', name: 'Details', icon: FileText },
    { id: 'versions', name: 'Version History', icon: Clock },
    { id: 'bom', name: 'Bill of Materials', icon: Package },
    { id: 'tests', name: 'Test Results', icon: TestTube }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/formulations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Formulations
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {formulation.product_name}
              </h1>
              {getStatusBadge(formulation.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Version: {formulation.current_version || 'v1.0'}</span>
              <span>•</span>
              <span>{formulation.product_type_name || 'Unknown Type'}</span>
              <span>•</span>
              <span>{formulation.grammage || 0}g per piece</span>
              {formulation.pack_count > 1 && (
                <>
                  <span>•</span>
                  <span>{formulation.pack_count}-pack</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              {formulation.created_at && (
                <span>
                  Created: {new Date(formulation.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              )}
              {formulation.updated_at && formulation.updated_at !== formulation.created_at && (
                <>
                  <span>•</span>
                  <span>
                    Updated: {new Date(formulation.updated_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            <button
              onClick={() => navigate(`/formulations/${id}/edit`)}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'versions' && renderVersionsTab()}
        {activeTab === 'bom' && renderBOMTab()}
        {activeTab === 'tests' && renderTestsTab()}
      </div>
    </div>
  );
};

export default FormulationDetail;
