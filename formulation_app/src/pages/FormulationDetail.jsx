import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit2, Trash2, Copy, RefreshCw, AlertCircle,
  FileText, Clock, TestTube, Package
} from 'lucide-react';
import axios from 'axios';
import BOMGenerator from '../components/BOMGenerator';
import VersionTimeline from '../components/VersionTimeline';

const API_BASE_URL = 'http://localhost:5000/api';

const FormulationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    loadFormulation();
  }, [id]);

  const loadFormulation = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/formulations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormulation(response.data.formulation);
    } catch (err) {
      console.error('Error loading formulation:', err);
      setError('Failed to load formulation details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${formulation.product_name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/formulations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/formulations');
    } catch (err) {
      console.error('Error deleting formulation:', err);
      alert(err.response?.data?.error || 'Failed to delete formulation');
    }
  };

  const handleDuplicate = async () => {
    const newName = prompt('Enter name for the duplicate:', `${formulation.product_name} (Copy)`);
    
    if (!newName) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/formulations/${id}/duplicate`,
        { new_name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/formulations/${response.data.formulation_id}`);
    } catch (err) {
      console.error('Error duplicating formulation:', err);
      alert(err.response?.data?.error || 'Failed to duplicate formulation');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
      under_review: 'bg-yellow-100 text-yellow-800'
    };

    const labels = {
      draft: 'Draft',
      active: 'Active',
      archived: 'Archived',
      under_review: 'Under Review'
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
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
              <span>Version: {formulation.current_version}</span>
              <span>•</span>
              <span>{formulation.product_type_name}</span>
              <span>•</span>
              <span>{formulation.grammage}g per piece</span>
              {formulation.pack_count > 1 && (
                <>
                  <span>•</span>
                  <span>{formulation.pack_count}-pack</span>
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
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <>
            {/* Cost Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cost per Piece</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{formulation.total_cost_per_piece?.toFixed(4) || '0.0000'}
                  </div>
                </div>
                {formulation.pack_count > 1 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Cost per {formulation.pack_count}-Pack
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{(formulation.total_cost_per_piece * formulation.pack_count).toFixed(2)}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cost per Kg</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{((formulation.total_cost_per_piece * 1000) / formulation.grammage).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ingredient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Quantity (g)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Cost/Piece
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formulation.ingredients?.map((ing, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {ing.ingredient_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {ing.category_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          {parseFloat(ing.percentage).toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          {parseFloat(ing.quantity_grams).toFixed(2)}g
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          ₹{parseFloat(ing.cost_per_piece).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan="2" className="px-6 py-3 text-sm font-bold text-gray-900 uppercase">
                        TOTAL
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                        100.00%
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                        {formulation.grammage}g
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-bold text-blue-600">
                        ₹{formulation.total_cost_per_piece?.toFixed(4) || '0.0000'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Benefits & Tags */}
            {(formulation.benefits?.length > 0 || formulation.tags?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benefits */}
                {formulation.benefits?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {formulation.benefits.map((benefit) => (
                        <span
                          key={benefit.id}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {benefit.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {formulation.tags?.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {formulation.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 text-sm rounded-full"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {formulation.notes && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formulation.notes}</p>
              </div>
            )}
          </>
        )}

        {/* Version History Tab */}
        {activeTab === 'versions' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <VersionTimeline 
              formulation={formulation}
              onVersionSelect={() => loadFormulation()}
            />
          </div>
        )}

        {/* BOM Tab */}
        {activeTab === 'bom' && (
          <BOMGenerator formulation={formulation} />
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <TestTube className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Test Results Coming Soon
            </h3>
            <p className="text-gray-600">
              Test results functionality will be available in the next update
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulationDetail;
