/**
 * Version Graphs Component v1.0
 *
 * Two side-by-side visualizations:
 * - Left: Comments timeline showing change notes by date
 * - Right: Cost trend chart showing price evolution
 *
 * Designed for large screens with clear readability
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock, DollarSign, AlertCircle, Loader2, RefreshCw,
  MessageSquare, TrendingUp, TrendingDown, Minus
} from 'lucide-react';

const API_BASE = '/api';

const VersionGraphs = ({ formulation }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredVersion, setHoveredVersion] = useState(null);

  const loadVersions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/formulations/${formulation.id}/versions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to load versions');

      const data = await response.json();
      // Sort by date ascending for the graph
      const versionsData = (data.versions || []).sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
      );
      setVersions(versionsData);
    } catch (err) {
      console.error('Error loading versions:', err);
      setError(err.message || 'Failed to load versions');
    } finally {
      setLoading(false);
    }
  }, [formulation?.id]);

  useEffect(() => {
    if (formulation?.id) {
      loadVersions();
    }
  }, [formulation?.id, loadVersions]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₹0.00';
    return '₹' + parseFloat(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
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

  // Calculate cost statistics for the chart
  const costs = versions.map(v => parseFloat(v.cost_snapshot) || 0);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const costRange = maxCost - minCost || 1;
  const costPadding = costRange * 0.1;

  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 300;
  const chartPadding = { top: 30, right: 30, bottom: 50, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Calculate points for the cost line
  const points = versions.map((v, index) => {
    // Center single point, otherwise distribute evenly
    const x = versions.length === 1
      ? chartPadding.left + plotWidth / 2
      : chartPadding.left + (index / (versions.length - 1)) * plotWidth;
    const cost = parseFloat(v.cost_snapshot) || 0;
    const y = chartPadding.top + plotHeight - ((cost - minCost + costPadding) / (costRange + 2 * costPadding)) * plotHeight;
    return { x, y, version: v, cost };
  });

  // Create SVG path for the line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Calculate Y-axis labels
  const yAxisSteps = 5;
  const yAxisLabels = [];
  for (let i = 0; i <= yAxisSteps; i++) {
    const value = minCost - costPadding + ((costRange + 2 * costPadding) * i / yAxisSteps);
    const y = chartPadding.top + plotHeight - (i / yAxisSteps) * plotHeight;
    yAxisLabels.push({ value, y });
  }

  // Overall trend
  const firstCost = costs[0] || 0;
  const lastCost = costs[costs.length - 1] || 0;
  const costChange = lastCost - firstCost;
  const costChangePercent = firstCost > 0 ? ((costChange / firstCost) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Version Evolution ({versions.length} version{versions.length !== 1 ? 's' : ''})
        </h3>
        <button
          onClick={loadVersions}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* LEFT: Comments Timeline */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Change Notes Timeline</h4>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Timeline items */}
            <div className="space-y-6">
              {[...versions].reverse().map((version, index) => {
                const isCurrent = version.version_number === formulation.current_version;
                const isHovered = hoveredVersion?.id === version.id;

                return (
                  <div
                    key={version.id}
                    className={`relative pl-10 transition-all ${isHovered ? 'scale-[1.02]' : ''}`}
                    onMouseEnter={() => setHoveredVersion(version)}
                    onMouseLeave={() => setHoveredVersion(null)}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-green-500 border-green-600'
                        : isHovered
                          ? 'bg-blue-500 border-blue-600'
                          : 'bg-white border-gray-300'
                    }`}>
                      {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>

                    {/* Content card */}
                    <div className={`bg-gray-50 rounded-lg p-4 border transition-all ${
                      isHovered ? 'border-blue-300 shadow-md' : 'border-gray-200'
                    }`}>
                      {/* Version header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-sm font-bold rounded ${
                            isCurrent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            v{version.version_number}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(version.cost_snapshot)}
                        </span>
                      </div>

                      {/* Date and time */}
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(version.created_at)}</span>
                        <span className="text-gray-400">at</span>
                        <span>{formatTime(version.created_at)}</span>
                        {version.created_by_name && (
                          <>
                            <span className="text-gray-400 mx-1">by</span>
                            <span className="font-medium text-gray-700">{version.created_by_name}</span>
                          </>
                        )}
                      </div>

                      {/* Change notes */}
                      {version.change_notes ? (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-gray-800 text-base leading-relaxed">
                            "{version.change_notes}"
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white rounded p-3 border border-gray-200 border-dashed">
                          <p className="text-gray-400 italic text-sm">No change notes recorded</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Cost Trend Chart */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h4 className="text-lg font-semibold text-gray-900">Cost Trend</h4>
            </div>

            {/* Trend indicator */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              costChange > 0
                ? 'bg-red-100 text-red-700'
                : costChange < 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
            }`}>
              {costChange > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : costChange < 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>
                {costChange > 0 ? '+' : ''}{costChangePercent}%
              </span>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide">First Version</div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(firstCost)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Current</div>
              <div className="text-lg font-semibold text-blue-600">{formatCurrency(lastCost)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Change</div>
              <div className={`text-lg font-semibold ${
                costChange > 0 ? 'text-red-600' : costChange < 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {costChange > 0 ? '+' : ''}{formatCurrency(costChange)}
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto"
              style={{ minHeight: '300px' }}
            >
              {/* Grid lines */}
              {yAxisLabels.map((label, i) => (
                <line
                  key={`grid-${i}`}
                  x1={chartPadding.left}
                  y1={label.y}
                  x2={chartWidth - chartPadding.right}
                  y2={label.y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "0" : "4,4"}
                />
              ))}

              {/* Y-axis labels */}
              {yAxisLabels.map((label, i) => (
                <text
                  key={`y-label-${i}`}
                  x={chartPadding.left - 10}
                  y={label.y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  style={{ fontSize: '11px' }}
                >
                  ₹{label.value.toFixed(2)}
                </text>
              ))}

              {/* X-axis labels (version numbers) */}
              {points.map((p, i) => (
                <text
                  key={`x-version-${i}`}
                  x={p.x}
                  y={chartHeight - chartPadding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                  style={{ fontSize: '11px' }}
                >
                  v{p.version.version_number}
                </text>
              ))}

              {/* Date labels below version */}
              {points.map((p, i) => (
                <text
                  key={`date-${i}`}
                  x={p.x}
                  y={chartHeight - chartPadding.bottom + 35}
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                  style={{ fontSize: '9px' }}
                >
                  {formatDate(p.version.created_at)}
                </text>
              ))}

              {/* Area fill under the line */}
              <path
                d={`${linePath} L ${points[points.length - 1]?.x || 0} ${chartPadding.top + plotHeight} L ${points[0]?.x || 0} ${chartPadding.top + plotHeight} Z`}
                fill="url(#costGradient)"
                opacity="0.3"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="costGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, i) => {
                const isHovered = hoveredVersion?.id === p.version.id;
                const isCurrent = p.version.version_number === formulation.current_version;

                return (
                  <g key={`point-${i}`}>
                    {/* Hover ring */}
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="12"
                        fill="#3b82f6"
                        opacity="0.2"
                      />
                    )}
                    {/* Point */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 8 : isCurrent ? 7 : 5}
                      fill={isCurrent ? '#22c55e' : '#3b82f6'}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredVersion(p.version)}
                      onMouseLeave={() => setHoveredVersion(null)}
                    />
                    {/* Cost label on hover */}
                    {isHovered && (
                      <g>
                        <rect
                          x={p.x - 40}
                          y={p.y - 35}
                          width="80"
                          height="24"
                          rx="4"
                          fill="#1f2937"
                        />
                        <text
                          x={p.x}
                          y={p.y - 18}
                          textAnchor="middle"
                          fill="white"
                          style={{ fontSize: '12px', fontWeight: '600' }}
                        >
                          {formatCurrency(p.cost)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Axes */}
              <line
                x1={chartPadding.left}
                y1={chartPadding.top}
                x2={chartPadding.left}
                y2={chartPadding.top + plotHeight}
                stroke="#9ca3af"
                strokeWidth="1"
              />
              <line
                x1={chartPadding.left}
                y1={chartPadding.top + plotHeight}
                x2={chartWidth - chartPadding.right}
                y2={chartPadding.top + plotHeight}
                stroke="#9ca3af"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Version</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Current Version</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover info panel */}
      {hoveredVersion && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border p-4 max-w-sm z-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-sm font-bold bg-blue-100 text-blue-800 rounded">
              v{hoveredVersion.version_number}
            </span>
            <span className="text-sm text-gray-500">{formatDate(hoveredVersion.created_at)}</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {formatCurrency(hoveredVersion.cost_snapshot)}
          </div>
          {hoveredVersion.change_notes && (
            <p className="text-sm text-gray-600 italic">"{hoveredVersion.change_notes}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VersionGraphs;
