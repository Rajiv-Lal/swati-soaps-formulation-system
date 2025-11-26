import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const VersionTimeline = ({ formulation, onVersionSelect }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
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
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/formulations/${formulation.id}/versions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVersions(response.data.versions || []);
    } catch (err) {
      console.error('Error loading versions:', err);
      setError('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const handleVersionClick = (version) => {
    setSelectedVersion(selectedVersion?.id === version.id ? null : version);
    if (onVersionSelect) {
      onVersionSelect(version);
    }
  };

  const handleRestoreVersion = async (versionId, versionNumber) => {
    if (!window.confirm(`Restore version ${versionNumber}?\n\nThis will create a new version based on ${versionNumber}.`)) {
      return;
    }

    setRestoring(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/formulations/${formulation.id}/versions/${versionId}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload versions
      await loadVersions();
      setSelectedVersion(null);
      
      // Notify parent to reload formulation
      if (onVersionSelect) {
        onVersionSelect(null);
      }
    } catch (err) {
      console.error('Error restoring version:', err);
      alert(err.response?.data?.error || 'Failed to restore version');
    } finally {
      setRestoring(false);
    }
  };

  const getCostTrend = (currentCost, previousCost) => {
    if (!previousCost) return null;
    
    const diff = currentCost - previousCost;
    const percentChange = ((diff / previousCost) * 100).toFixed(1);

    if (Math.abs(diff) < 0.01) {
      return { icon: Minus, color: 'text-gray-500', text: 'No change' };
    } else if (diff > 0) {
      return { 
        icon: TrendingUp, 
        color: 'text-red-500', 
        text: `+₹${diff.toFixed(2)} (+${percentChange}%)`
      };
    } else {
      return { 
        icon: TrendingDown, 
        color: 'text-green-500', 
        text: `₹${diff.toFixed(2)} (${percentChange}%)`
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={loadVersions}
            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
          <p className="text-sm text-gray-600">
            {versions.length} version{versions.length !== 1 ? 's' : ''} • 
            Current: {formulation.current_version}
          </p>
        </div>
        <button
          onClick={loadVersions}
          disabled={loading}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-0 right-0 top-8 h-0.5 bg-gray-300" />

        {/* Cost Trend Line (optional overlay) */}
        <div className="relative pb-4">
          <div className="flex justify-between items-start gap-4 overflow-x-auto pb-2">
            {versions.map((version, index) => {
              const isCurrentVersion = version.version_number === formulation.current_version;
              const isSelected = selectedVersion?.id === version.id;
              const previousVersion = versions[index + 1];
              const trend = previousVersion ? getCostTrend(version.cost_snapshot, previousVersion.cost_snapshot) : null;

              return (
                <div
                  key={version.id}
                  className="flex-shrink-0 w-48"
                >
                  {/* Version Dot */}
                  <div className="relative flex flex-col items-center">
                    <button
                      onClick={() => handleVersionClick(version)}
                      className={`relative z-10 w-16 h-16 rounded-full border-4 transition-all ${
                        isCurrentVersion
                          ? 'bg-blue-600 border-blue-700 ring-4 ring-blue-100'
                          : isSelected
                          ? 'bg-white border-blue-600 ring-4 ring-blue-100'
                          : 'bg-white border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <div className={`text-center ${isCurrentVersion ? 'text-white' : 'text-gray-900'}`}>
                        <div className="text-xs font-semibold">
                          {version.version_number}
                        </div>
                        {isCurrentVersion && (
                          <div className="text-[10px]">Current</div>
                        )}
                      </div>
                    </button>

                    {/* Version Info Card */}
                    <div className={`mt-2 w-full ${isSelected ? 'block' : 'hidden'}`}>
                      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm">
                        {/* Version Number */}
                        <div className="font-semibold text-gray-900 mb-2">
                          {version.version_number}
                          {isCurrentVersion && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </div>

                        {/* Date */}
                        <div className="text-xs text-gray-600 mb-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(version.created_at).toLocaleDateString()}
                        </div>

                        {/* Created By */}
                        {version.created_by_name && (
                          <div className="text-xs text-gray-600 mb-2">
                            By: {version.created_by_name}
                          </div>
                        )}

                        {/* Cost */}
                        <div className="py-2 border-t border-gray-200 mb-2">
                          <div className="text-xs text-gray-600">Cost per piece</div>
                          <div className="text-lg font-bold text-gray-900">
                            ₹{version.cost_snapshot?.toFixed(4) || '0.0000'}
                          </div>
                          {trend && (
                            <div className={`flex items-center gap-1 text-xs ${trend.color} mt-1`}>
                              <trend.icon className="w-3 h-3" />
                              {trend.text}
                            </div>
                          )}
                        </div>

                        {/* Change Notes */}
                        {version.change_notes && (
                          <div className="py-2 border-t border-gray-200 mb-2">
                            <div className="text-xs text-gray-600 mb-1">Notes:</div>
                            <div className="text-xs text-gray-800">
                              {version.change_notes}
                            </div>
                          </div>
                        )}

                        {/* Restore Button */}
                        {!isCurrentVersion && (
                          <button
                            onClick={() => handleRestoreVersion(version.id, version.version_number)}
                            disabled={restoring}
                            className="w-full mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {restoring ? 'Restoring...' : 'Restore This Version'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Minimal Info (when not selected) */}
                    {!isSelected && (
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-gray-700">
                          {version.version_number}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(version.created_at).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 mt-1">
                          ₹{version.cost_snapshot?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cost Trend Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Cost Evolution</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-600">First Version</div>
            <div className="text-lg font-semibold text-gray-900">
              ₹{versions[versions.length - 1]?.cost_snapshot?.toFixed(4) || '0.0000'}
            </div>
            <div className="text-xs text-gray-500">
              {versions[versions.length - 1]?.version_number}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Current Version</div>
            <div className="text-lg font-semibold text-gray-900">
              ₹{versions[0]?.cost_snapshot?.toFixed(4) || '0.0000'}
            </div>
            <div className="text-xs text-gray-500">
              {versions[0]?.version_number}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Total Change</div>
            {(() => {
              const firstCost = versions[versions.length - 1]?.cost_snapshot || 0;
              const currentCost = versions[0]?.cost_snapshot || 0;
              const diff = currentCost - firstCost;
              const percentChange = firstCost ? ((diff / firstCost) * 100).toFixed(1) : 0;
              const TrendIcon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus;
              const color = diff > 0 ? 'text-red-600' : diff < 0 ? 'text-green-600' : 'text-gray-600';

              return (
                <>
                  <div className={`text-lg font-semibold ${color} flex items-center gap-1`}>
                    <TrendIcon className="w-4 h-4" />
                    {diff > 0 ? '+' : ''}₹{diff.toFixed(4)}
                  </div>
                  <div className={`text-xs ${color}`}>
                    {diff > 0 ? '+' : ''}{percentChange}%
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="text-xs text-gray-500 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-blue-700" />
          <span>Current Version</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300" />
          <span>Past Version</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-red-500" />
          <span>Cost Increase</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3 text-green-500" />
          <span>Cost Decrease</span>
        </div>
      </div>
    </div>
  );
};

export default VersionTimeline;
