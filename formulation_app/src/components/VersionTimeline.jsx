/**
 * Version Timeline Component
 * 
 * Displays version history for formulations with:
 * - All versions expanded by default with full ingredient details
 * - Timeline view showing changes over time
 * - No restore button (all versions are viewable)
 */

import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, ChevronRight, AlertCircle, Loader2, Package, DollarSign } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const VersionTimeline = ({ formulation, onVersionSelect }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVersions, setExpandedVersions] = useState(new Set()); // Track multiple expanded

  useEffect(() => {
    if (formulation?.id) {
      loadVersions();
    }
  }, [formulation?.id]);

  const loadVersions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/formulations/${formulation.id}/versions`);
      const versionsData = response.data.versions || [];
      setVersions(versionsData);
      
      // Expand all versions by default
      const allIds = new Set(versionsData.map(v => v.id));
      setExpandedVersions(allIds);
    } catch (err) {
      console.error('Error loading versions:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

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
    
    if (onVersionSelect) {
      const version = versions.find(v => v.id === versionId);
      onVersionSelect(version);
    }
  };

  // Parse ingredients from snapshot and include names
  const getIngredients = (version) => {
    if (!version.ingredients_snapshot) return [];
    
    const snapshot = typeof version.ingredients_snapshot === 'string' 
      ? JSON.parse(version.ingredients_snapshot) 
      : version.ingredients_snapshot;
    
    // If ingredients have names (from enriched API), use them
    // Otherwise fall back to ingredient_id display
    const ingredients = snapshot.ingredients || [];
    
    return ingredients.map(ing => ({
      id: ing.ingredient_id,
      name: ing.name || ing.ingredient_name || `Ingredient #${ing.ingredient_id}`,
      percentage: ing.percentage,
      quantity_grams: ing.quantity_grams,
      cost_per_piece: ing.cost_per_piece
    }));
  };

  const getSnapshotData = (version) => {
    if (!version.ingredients_snapshot) return { grammage: 0, pack_count: 1 };
    
    const snapshot = typeof version.ingredients_snapshot === 'string' 
      ? JSON.parse(version.ingredients_snapshot) 
      : version.ingredients_snapshot;
    
    return {
      grammage: snapshot.grammage || 0,
      pack_count: snapshot.pack_count || 1
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={loadVersions}
            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Try again
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
        <p>Version history will appear here as changes are made to this formulation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-4 py-3 border-b">
        <h3 className="font-medium text-gray-900">Version History</h3>
        <p className="text-sm text-gray-500">{versions.length} version{versions.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="divide-y divide-gray-100">
        {versions.map((version, index) => {
          const isExpanded = expandedVersions.has(version.id);
          const isCurrent = index === 0;
          const ingredients = getIngredients(version);
          const snapshotData = getSnapshotData(version);

          return (
            <div key={version.id} className="relative">
              {/* Timeline line */}
              {index < versions.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
              )}

              {/* Version item */}
              <div className="p-4 pl-14 relative">
                {/* Timeline dot */}
                <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 ${
                  isCurrent 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300'
                }`} />

                {/* Header */}
                <button
                  onClick={() => toggleExpand(version.id)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {version.version_number || `v${versions.length - index}`}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(version.created_at)}
                        {version.created_by_name && ` by ${version.created_by_name}`}
                      </div>
                    </div>
                  </div>

                  {/* Summary stats on the right */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {ingredients.length} ingredients
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ₹{parseFloat(version.cost_snapshot || 0).toFixed(2)}
                    </span>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 ml-7 p-4 bg-gray-50 rounded-lg">
                    {/* Change Notes */}
                    {version.change_notes && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Change Notes</div>
                        <p className="text-sm text-gray-600">{version.change_notes}</p>
                      </div>
                    )}

                    {/* Grammage and Pack Count */}
                    <div className="mb-4 flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Grammage:</span>
                        <span className="ml-2 font-medium text-gray-900">{snapshotData.grammage}g</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Pack Count:</span>
                        <span className="ml-2 font-medium text-gray-900">{snapshotData.pack_count}</span>
                      </div>
                    </div>

                    {/* Ingredients Table */}
                    {ingredients.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Ingredients ({ingredients.length})
                        </div>
                        <div className="bg-white rounded border">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-left px-3 py-2 font-medium text-gray-600">Ingredient</th>
                                <th className="text-right px-3 py-2 font-medium text-gray-600">%</th>
                                <th className="text-right px-3 py-2 font-medium text-gray-600">Qty (g)</th>
                                <th className="text-right px-3 py-2 font-medium text-gray-600">Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {ingredients.map((ing, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 text-gray-900">{ing.name}</td>
                                  <td className="px-3 py-2 text-right text-gray-600">{ing.percentage}%</td>
                                  <td className="px-3 py-2 text-right text-gray-600">
                                    {ing.quantity_grams?.toFixed(2) || '-'}
                                  </td>
                                  <td className="px-3 py-2 text-right text-gray-900 font-medium">
                                    ₹{ing.cost_per_piece?.toFixed(2) || '0.00'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-medium">
                              <tr>
                                <td className="px-3 py-2 text-gray-900">Total</td>
                                <td className="px-3 py-2 text-right text-gray-900">
                                  {ingredients.reduce((sum, ing) => sum + (ing.percentage || 0), 0).toFixed(1)}%
                                </td>
                                <td className="px-3 py-2 text-right text-gray-600">
                                  {snapshotData.grammage}g
                                </td>
                                <td className="px-3 py-2 text-right text-blue-600">
                                  ₹{parseFloat(version.cost_snapshot || 0).toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionTimeline;
