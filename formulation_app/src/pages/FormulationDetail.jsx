/**
 * Formulation Detail Page v2.3
 * 
 * FIXES:
 * - Back button on all views
 * - Version number displayed prominently
 * - Tab-specific action buttons (no bleeding)
 * - Proper version selection handling
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles,
  ArrowLeft, Edit2, Trash2, Copy, AlertCircle, RefreshCw,
  FileText, Clock, TestTube, Package, DollarSign, Loader2,
  CheckCircle, Tag, List, BarChart3
} from 'lucide-react';
import BOMGenerator from '../components/BOMGenerator';
import VersionTimeline from '../components/VersionTimeline';
import VersionGraphs from '../components/VersionGraphs';
import TestResults from '../components/TestResults';

const API_BASE = 'http://localhost:5000/api';

const FormulationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedVersion, setSelectedVersion] = useState(null); // Store full version object
  const [benefits, setBenefits] = useState(null);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [refreshingPrices, setRefreshingPrices] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [versionViewMode, setVersionViewMode] = useState('timeline'); // 'timeline' or 'graph'

  const tabs = [
    { id: 'details', name: 'Details', icon: FileText },
    { id: 'versions', name: 'Version History', icon: Clock },
    { id: 'bom', name: 'Bill of Materials', icon: Package },
    { id: 'tests', name: 'Test Results', icon: TestTube },
    { id: 'benefits', name: 'Benefits', icon: Sparkles }
  ];

  const getToken = () => localStorage.getItem('token');

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadFormulation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/formulations/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to load formulation');
      
      const data = await response.json();
      setFormulation(data.formulation);
    } catch (err) {
      console.error('Error loading formulation:', err);
      setError(err.message);
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
      const response = await fetch(`${API_BASE}/formulations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete formulation');
      
      navigate('/formulations');
    } catch (err) {
      console.error('Error deleting formulation:', err);
      alert(err.message);
    }
  };

  const handleDuplicate = async () => {
    const suggestedName = `${formulation.product_name} (Copy)`;
    const newName = window.prompt(
      'Enter a name for the duplicate formulation:\n\n(The duplicate will start as a new formulation at v1.0 in Draft status)',
      suggestedName
    );
    
    if (!newName || !newName.trim()) return;
    
    if (newName.trim() === formulation.product_name) {
      alert('Please choose a different name for the duplicate.');
      return;
    }

    setDuplicating(true);
    
    try {
      const response = await fetch(`${API_BASE}/formulations/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ new_name: newName.trim() })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to duplicate formulation');
      }
      
      const data = await response.json();
      navigate(`/formulations/${data.formulation_id}`);
    } catch (err) {
      console.error('Error duplicating formulation:', err);
      alert(err.message);
    } finally {
      setDuplicating(false);
    }
  };

  const handleRefreshPrices = async () => {
    if (!window.confirm('Refresh all ingredient costs from current prices?\n\nThis will update the formulation cost calculations based on the latest ingredient prices.')) {
      return;
    }

    setRefreshingPrices(true);
    
    try {
      const response = await fetch(`${API_BASE}/formulations/${id}/refresh-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to refresh prices');
      }
      
      const data = await response.json();
      await loadFormulation();
      
      alert(`Prices refreshed!\n\nNew total cost: ₹${data.new_total_cost.toFixed(4)} per piece`);
    } catch (err) {
      console.error('Error refreshing prices:', err);
      alert(err.message);
    } finally {
      setRefreshingPrices(false);
    }
  };

  const handleVersionSelect = (version) => {
    if (version) {
      setSelectedVersion(version);
    } else {
      setSelectedVersion(null);
    }
  };

  const handleClearVersionSelection = () => {
    setSelectedVersion(null);
  };

  const handleEditFormulation = () => {
    if (selectedVersion) {
      navigate(`/formulations/${id}/edit?version=${selectedVersion.id}`);
    } else {
      navigate(`/formulations/${id}/edit`);
    }
  };

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

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

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₹0.00';
    return '₹' + parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  // ---------------------------------------------------------------------------
  // RENDER TAB-SPECIFIC ACTIONS
  // ---------------------------------------------------------------------------

  const renderTabActions = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleRefreshPrices}
              disabled={refreshingPrices}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
              title="Refresh costs from current ingredient prices"
            >
              <RefreshCw className={`w-4 h-4 ${refreshingPrices ? 'animate-spin' : ''}`} />
              {refreshingPrices ? 'Refreshing...' : 'Refresh Prices'}
            </button>
            
            <button
              onClick={handleDuplicate}
              disabled={duplicating}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              {duplicating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {duplicating ? 'Duplicating...' : 'Duplicate'}
            </button>
            
            <button
              onClick={handleEditFormulation}
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
        );
      
      case 'versions':
        return selectedVersion ? (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-blue-600 font-medium">
              Selected: {selectedVersion.version_number}
            </span>
            <button
              onClick={handleClearVersionSelection}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Selection
            </button>
            <button
              onClick={handleEditFormulation}
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Edit This Version
            </button>
          </div>
        ) : null;
      
      case 'bom':
        return selectedVersion ? (
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">
              Showing BOM for: {selectedVersion.version_number}
            </span>
            <button
              onClick={handleClearVersionSelection}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Use Latest
            </button>
          </div>
        ) : null;
      
      case 'tests':
        return null; // No actions for tests tab
      
      default:
        return null;
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER TABS
  // ---------------------------------------------------------------------------

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Cost per Piece</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(formulation.total_cost_per_piece)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Ingredients</div>
              <div className="text-2xl font-bold text-gray-900">
                {formulation.ingredients?.length || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Percentage</div>
              <div className="text-2xl font-bold text-gray-900">
                {formulation.ingredients?.reduce((sum, ing) => sum + parseFloat(ing.percentage || 0), 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Ingredients</h3>
        </div>
        
        {formulation.ingredients?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost/kg</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost in Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formulation.ingredients.map((ing, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{ing.ingredient_name || ing.name}</div>
                      {ing.inci_name && (
                        <div className="text-sm text-gray-500">{ing.inci_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ing.category_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium">
                      {parseFloat(ing.percentage).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">
                      {ing.landed_cost_net_gst 
                        ? formatCurrency(ing.landed_cost_net_gst)
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                      {ing.cost_per_piece 
                        ? formatCurrency(ing.cost_per_piece)
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="2" className="px-6 py-3 text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-bold text-gray-900">
                    {formulation.ingredients.reduce((sum, ing) => sum + parseFloat(ing.percentage || 0), 0).toFixed(2)}%
                  </td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3 text-sm text-right font-bold text-blue-600">
                    {formatCurrency(formulation.total_cost_per_piece)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No ingredients added yet.
          </div>
        )}
      </div>

      {/* Notes */}
      {formulation.notes && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{formulation.notes}</p>
        </div>
      )}
    </div>
  );

  const renderVersionsTab = () => (
    <div className="space-y-4">
      {/* Sub-tab toggle */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setVersionViewMode('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            versionViewMode === 'timeline'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <List className="w-4 h-4" />
          Timeline View
        </button>
        <button
          onClick={() => setVersionViewMode('graph')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            versionViewMode === 'graph'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Graph View
        </button>
      </div>

      {/* Content based on view mode */}
      {versionViewMode === 'timeline' ? (
        <VersionTimeline
          formulation={formulation}
          onVersionSelect={handleVersionSelect}
          selectedVersionId={selectedVersion?.id}
        />
      ) : (
        <VersionGraphs formulation={formulation} />
      )}
    </div>
  );

  const renderBOMTab = () => (
    <BOMGenerator 
      formulation={formulation} 
      selectedVersion={selectedVersion}
    />
  );

  const renderTestsTab = () => (
    <TestResults 
      formulation={formulation}
      selectedVersion={selectedVersion}
    />
  );

  // Load benefits when tab is selected
  const loadBenefits = async () => {
    if (benefits) return; // Already loaded
    setBenefitsLoading(true);
    try {
      // Load both endpoints in parallel
      const [marketingRes, rawRes] = await Promise.all([
        fetch(`${API_BASE}/formulations/${id}/marketing-benefits`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }),
        fetch(`${API_BASE}/formulations/${id}/benefits`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
      ]);

      const marketingData = marketingRes.ok ? await marketingRes.json() : {};
      const rawData = rawRes.ok ? await rawRes.json() : {};

      setBenefits({
        marketing_statements: marketingData.marketing_statements || [],
        raw_benefits: marketingData.raw_benefits || rawData.consolidated_benefits || [],
        ingredients_benefits: rawData.ingredients_benefits || [],
        total_ingredients: marketingData.total_ingredients || rawData.total_ingredients || 0,
        message: marketingData.message
      });
    } catch (err) {
      console.error('Error loading benefits:', err);
    } finally {
      setBenefitsLoading(false);
    }
  };

  // Load benefits when tab changes to benefits
  useEffect(() => {
    if (activeTab === 'benefits') {
      loadBenefits();
    }
  }, [activeTab]);

  const renderBenefitsTab = () => {
    if (benefitsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      );
    }

    if (!benefits) {
      return (
        <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
          No benefits data available
        </div>
      );
    }

    const totalIngredients = benefits.total_ingredients || benefits.ingredients_benefits?.length || 0;

    return (
      <div className="space-y-6">
        {/* Marketing Benefit Statements */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Product Benefits
          </h3>
          {benefits.message && (
            <p className="text-sm text-amber-600 mb-3">{benefits.message}</p>
          )}

          {benefits.marketing_statements?.length > 0 ? (
            <ul className="space-y-3">
              {benefits.marketing_statements.map((statement, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  <span className="text-gray-800 leading-relaxed">{statement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No benefit statements available</p>
          )}
        </div>

        {/* Raw Benefits - Collapsed by default */}
        {benefits.raw_benefits?.length > 0 && (
          <details className="bg-white rounded-lg border overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
              View Raw Ingredient Benefits ({benefits.raw_benefits.length} unique benefits from {totalIngredients} ingredients)
            </summary>
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2 mt-2">
                {benefits.raw_benefits.map((item, idx) => {
                  const benefit = typeof item === 'string' ? item : item.benefit;
                  const frequency = typeof item === 'object' ? item.frequency : 1;
                  const isHighFreq = frequency >= Math.ceil(totalIngredients / 2);
                  const isMedFreq = frequency >= 2;

                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${
                        isHighFreq
                          ? 'bg-purple-600 text-white font-medium'
                          : isMedFreq
                            ? 'bg-purple-200 text-purple-900'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {benefit}
                      {frequency > 1 && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isHighFreq ? 'bg-purple-500' : 'bg-purple-300'
                        }`}>
                          {frequency}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </details>
        )}

        {/* Per-Ingredient Benefits */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Benefits by Ingredient</h3>
          </div>
          <div className="divide-y">
            {benefits.ingredients_benefits?.map((ing) => (
              <div key={ing.ingredient_id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{ing.ingredient_name}</span>
                    {ing.inci_name && (
                      <span className="ml-2 text-sm text-gray-500">({ing.inci_name})</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{ing.percentage}%</span>
                </div>
                {ing.benefits ? (
                  <p className="text-sm text-gray-600">{ing.benefits}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No benefits data available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // LOADING/ERROR STATES
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !formulation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/formulations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Formulations
        </button>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Error Loading Formulation</h3>
            <p className="text-sm text-red-700 mt-1">{error || 'Formulation not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button - Always visible */}
      <button
        onClick={() => navigate('/formulations')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Formulations
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {/* Product Name and Status */}
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {formulation.product_name}
              </h1>
              {getStatusBadge(formulation.status)}
            </div>
            
            {/* Version Number - PROMINENT */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-lg font-bold rounded-md">
                {formulation.current_version}
              </span>
              {selectedVersion && selectedVersion.version_number !== formulation.current_version && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                  Viewing: {selectedVersion.version_number}
                </span>
              )}
            </div>
            
            {/* Meta info */}
            <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
              <span>{formulation.product_type_name || 'Unknown Type'}</span>
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

          {/* Tab-specific Action Buttons */}
          {renderTabActions()}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap
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
        {activeTab === 'benefits' && renderBenefitsTab()}
      </div>
    </div>
  );
};

export default FormulationDetail;
