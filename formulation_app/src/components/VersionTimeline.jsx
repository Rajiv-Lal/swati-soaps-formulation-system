/**
 * Version Timeline Component v2.3
 * 
 * FIXES:
 * - Separate expand/collapse from version selection
 * - Explicit "Select" button for each version
 * - Visual indicator for selected version
 * - Version number prominently displayed
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, ChevronDown, ChevronRight, AlertCircle, Loader2, 
  Package, DollarSign, CheckCircle, RefreshCw 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const VersionTimeline = ({ formulation, onVersionSelect, selectedVersionId }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVersions, setExpandedVersions] = useState(new Set());

  useEffect(() => {
    if (formulation?.id) {
      loadVersions();
    }
  }, [formulation?.id]);

  const loadVersions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/formulations/${formulation.id}/versions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to load versions');
      
      const data = await response.json();
      const versionsData = data.versions || [];
      setVersions(versionsData);
      
      // Expand all versions by default
      const allIds = new Set(versionsData.map(v => v.id));
      setExpandedVersions(allIds);
    } catch (err) {
      console.error('Error loading versions:', err);
      setError(err.message || 'Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₹0.00';
    return '₹' + parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  // Toggle expand/collapse - SEPARATE from selection
  const toggleExpand = (versionId) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  // Select version - SEPARATE action
  const handleSelectVersion = (version) => {
    if (onVersionSelect) {
      // If already selected, deselect
      if (selectedVersionId === version.id) {
        onVersionSelect(null);
      } else {
        onVersionSelect(version);
      }
    }
  };

  // Parse ingredients from snapshot
  const getIngredients = (version) => {
    if (!version.ingredients_snapshot) return [];
    
    try {
      const snapshot = typeof version.ingredients_snapshot === 'string' 
        ? JSON.parse(version.ingredients_snapshot) 
        : version.ingredients_snapshot;
      
      const ingredients = snapshot.ingredients || snapshot || [];
      
      return ingredients.map(ing => ({
        id: ing.ingredient_id,
        name: ing.name || ing.ingredient_name || `Ingredient #${ing.ingredient_id}`,
        percentage: ing.percentage,
        quantity_grams: ing.quantity_grams,
        cost_per_piece: ing.cost_per_piece
      }));
    } catch (e) {
      console.error('Error parsing ingredients:', e);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-red-800">Error Loading Versions</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button
            onClick={loadVersions}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="font-medium text-gray-900 mb-2">No Version History</h3>
        <p>Version history will appear here after you make changes to the formulation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Version History ({versions.length} version{versions.length !== 1 ? 's' : ''})
        </h3>
        <button
          onClick={loadVersions}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="Refresh versions"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Selection Info */}
      {selectedVersionId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Version selected - BOM and Tests will use this version
            </span>
          </div>
          <button
            onClick={() => onVersionSelect && onVersionSelect(null)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Version List */}
      <div className="space-y-3">
        {versions.map((version, index) => {
          const isExpanded = expandedVersions.has(version.id);
          const isSelected = selectedVersionId === version.id;
          const isCurrent = version.version_number === formulation.current_version;
          const ingredients = getIngredients(version);

          return (
            <div 
              key={version.id} 
              className={`bg-white rounded-lg border overflow-hidden transition-all ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {/* Version Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleExpand(version.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {/* Version Number - PROMINENT */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-lg font-bold rounded ${
                        isCurrent 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {version.version_number}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                          CURRENT
                        </span>
                      )}
                      {isSelected && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                          SELECTED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectVersion(version)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Select Version'}
                  </button>
                </div>

                {/* Meta Info */}
                <div className="mt-2 ml-9 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(version.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(version.cost_snapshot)}
                  </span>
                  {version.created_by_name && (
                    <span>by {version.created_by_name}</span>
                  )}
                </div>

                {/* Change Notes */}
                {version.change_notes && (
                  <div className="mt-2 ml-9 text-sm text-gray-600 italic">
                    "{version.change_notes}"
                  </div>
                )}
              </div>

              {/* Expanded Content - Ingredients Table */}
              {isExpanded && ingredients.length > 0 && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Ingredients ({ingredients.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-2 font-medium">Name</th>
                          <th className="pb-2 font-medium text-right">%</th>
                          <th className="pb-2 font-medium text-right">Qty (g)</th>
                          <th className="pb-2 font-medium text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {ingredients.map((ing, idx) => (
                          <tr key={idx}>
                            <td className="py-2 text-gray-900">{ing.name}</td>
                            <td className="py-2 text-right text-gray-600">
                              {parseFloat(ing.percentage).toFixed(2)}%
                            </td>
                            <td className="py-2 text-right text-gray-600">
                              {ing.quantity_grams ? parseFloat(ing.quantity_grams).toFixed(2) : '-'}
                            </td>
                            <td className="py-2 text-right text-gray-900">
                              {ing.cost_per_piece ? formatCurrency(ing.cost_per_piece) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t font-medium">
                        <tr>
                          <td className="pt-2">Total</td>
                          <td className="pt-2 text-right">
                            {ingredients.reduce((sum, ing) => sum + parseFloat(ing.percentage || 0), 0).toFixed(2)}%
                          </td>
                          <td className="pt-2 text-right">-</td>
                          <td className="pt-2 text-right text-blue-600">
                            {formatCurrency(version.cost_snapshot)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionTimeline;
