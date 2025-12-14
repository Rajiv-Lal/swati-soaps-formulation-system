/**
 * Version Timeline Component
 * 
 * Displays version history for formulations with:
 * - Timeline view
 * - Version comparison
 * - Restore functionality
 */

import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, ChevronDown, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const VersionTimeline = ({ formulation, onVersionSelect, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedVersion, setExpandedVersion] = useState(null);
  const [restoring, setRestoring] = useState(false);

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
      setVersions(response.data.versions || []);
    } catch (err) {
      console.error('Error loading versions:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId) => {
    if (!window.confirm('Restore this version? This will create a new version with the restored content.')) {
      return;
    }

    setRestoring(true);

    try {
      await api.post(`/formulations/${formulation.id}/versions/${versionId}/restore`);
      await loadVersions();
      if (onRestore) onRestore();
    } catch (err) {
      console.error('Error restoring version:', err);
      alert(getErrorMessage(err));
    } finally {
      setRestoring(false);
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
    setExpandedVersion(expandedVersion === versionId ? null : versionId);
    if (onVersionSelect && expandedVersion !== versionId) {
      const version = versions.find(v => v.id === versionId);
      onVersionSelect(version);
    }
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
          const isExpanded = expandedVersion === version.id;
          const isCurrent = index === 0;

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
                        {version.created_by && ` by ${version.created_by}`}
                      </div>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(version.id);
                      }}
                      disabled={restoring}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-1 disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 ml-7 p-4 bg-gray-50 rounded-lg">
                    {version.change_notes && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Change Notes</div>
                        <p className="text-sm text-gray-600">{version.change_notes}</p>
                      </div>
                    )}

                    {version.ingredients && version.ingredients.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Ingredients ({version.ingredients.length})
                        </div>
                        <div className="space-y-1">
                          {version.ingredients.map((ing, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{ing.name}</span>
                              <span className="text-gray-900 font-medium">{ing.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {version.total_cost !== undefined && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Cost per piece</span>
                          <span className="font-medium text-gray-900">
                            ₹{parseFloat(version.total_cost).toFixed(2)}
                          </span>
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
