/**
 * BOM Generator Component v2.4
 * 
 * FIXES:
 * - Wastage shown in kg (not just percentage)
 * - Selected version info displayed
 * - Proper version number display
 * - Cleaner UI without bleeding actions
 * - Pack size LOCKED to version (read-only)
 * - Fixed UI overlap issues
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, Download, Printer, RefreshCw, AlertCircle, 
  Loader2, Package, TrendingUp, Tag, Lock
} from 'lucide-react';

const API_BASE = '/api';

// Format number with Indian comma system (₹1,23,456.78)
const formatCurrency = (num) => {
  if (num === null || num === undefined) return '₹0.00';
  return '₹' + parseFloat(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format number with commas
const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '0';
  return parseFloat(num).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

const BOMGenerator = ({ formulation, selectedVersion = null }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bom, setBom] = useState(null);
  
  const [params, setParams] = useState({
    batch_size: '100',
    batch_unit: 'kg',  // 'kg' or 'tonnes'
    wastage_percent: '2.0',
    wastage_type: 'aggregate'  // 'aggregate' or 'per_ingredient'
  });

  // Get pack_count from version snapshot OR formulation (LOCKED - not editable)
  const packCount = useMemo(() => {
    if (selectedVersion?.ingredients_snapshot) {
      const snapshot = typeof selectedVersion.ingredients_snapshot === 'string'
        ? JSON.parse(selectedVersion.ingredients_snapshot)
        : selectedVersion.ingredients_snapshot;
      return snapshot.pack_count || formulation?.pack_count || 1;
    }
    return formulation?.pack_count || 1;
  }, [selectedVersion, formulation]);

  // Get grammage from version snapshot OR formulation
  const grammage = useMemo(() => {
    if (selectedVersion?.ingredients_snapshot) {
      const snapshot = typeof selectedVersion.ingredients_snapshot === 'string'
        ? JSON.parse(selectedVersion.ingredients_snapshot)
        : selectedVersion.ingredients_snapshot;
      return snapshot.grammage || formulation?.grammage || 100;
    }
    return formulation?.grammage || 100;
  }, [selectedVersion, formulation]);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  // Calculate BOM locally for immediate feedback
  const calculatedBOM = useMemo(() => {
    if (!formulation?.ingredients?.length) return null;

    const batchSizeKg = params.batch_unit === 'tonnes' 
      ? parseFloat(params.batch_size) * 1000 
      : parseFloat(params.batch_size);
    
    const wastagePercent = parseFloat(params.wastage_percent) || 0;
    
    // Calculate pieces from batch using version-locked grammage
    const piecesFromBatch = Math.floor((batchSizeKg * 1000) / grammage);
    const packsFromBatch = Math.floor(piecesFromBatch / packCount);
    
    let totalRawCost = 0;
    let totalWeightKg = 0;
    
    const items = formulation.ingredients.map(ing => {
      const percentage = parseFloat(ing.percentage) || 0;
      const costPerKg = parseFloat(ing.landed_cost_net_gst || ing.cost_per_kg) || 0;
      
      // Calculate quantities
      const quantityKg = (percentage / 100) * batchSizeKg;
      
      // Per-ingredient wastage
      const wastageKg = params.wastage_type === 'per_ingredient' 
        ? quantityKg * (wastagePercent / 100)
        : 0;
      
      const orderQtyKg = quantityKg + wastageKg;
      const lineCost = orderQtyKg * costPerKg;
      
      totalWeightKg += quantityKg;
      totalRawCost += lineCost;
      
      return {
        id: ing.ingredient_id || ing.id,
        name: ing.name || ing.ingredient_name,
        inci_name: ing.inci_name || '',
        cas_number: ing.cas_number || '',
        category: ing.category_name || 'N/A',
        percentage,
        quantityKg,
        wastageKg,
        orderQtyKg,
        costPerKg,
        lineCost
      };
    });
    
    // Apply aggregate wastage if selected
    let totalWastageKg = 0;
    if (params.wastage_type === 'aggregate') {
      totalWastageKg = totalWeightKg * (wastagePercent / 100);
      // Recalculate total cost with wastage
      totalRawCost = items.reduce((sum, item) => {
        const wastageForItem = item.quantityKg * (wastagePercent / 100);
        return sum + ((item.quantityKg + wastageForItem) * item.costPerKg);
      }, 0);
    } else {
      totalWastageKg = items.reduce((sum, item) => sum + item.wastageKg, 0);
    }
    
    const totalOrderKg = totalWeightKg + totalWastageKg;
    const costPerPiece = piecesFromBatch > 0 ? totalRawCost / piecesFromBatch : 0;
    const costPerPack = costPerPiece * packCount;
    const aggregateCost = costPerPack * packsFromBatch;
    
    return {
      formulation: {
        name: formulation.product_name,
        grammage,
        version: selectedVersion?.version_number || formulation.current_version,
        packCount
      },
      params: {
        batchSizeKg,
        batchDisplay: `${params.batch_size} ${params.batch_unit}`,
        packCount,
        wastagePercent,
        wastageType: params.wastage_type
      },
      production: {
        piecesFromBatch,
        packsFromBatch
      },
      items,
      totals: {
        weightKg: totalWeightKg,
        wastageKg: totalWastageKg,
        orderKg: totalOrderKg,
        rawCost: totalRawCost,
        costPerPiece,
        costPerPack,
        aggregateCost
      }
    };
  }, [formulation, params, selectedVersion, grammage, packCount]);

  const generateBOM = async () => {
    if (!formulation?.id) return;
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Convert batch size to pieces for API
      const batchSizeKg = params.batch_unit === 'tonnes' 
        ? parseFloat(params.batch_size) * 1000 
        : parseFloat(params.batch_size);
      const piecesFromBatch = Math.floor((batchSizeKg * 1000) / grammage);
      
      const response = await fetch(`${API_BASE}/formulations/${formulation.id}/bom/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: piecesFromBatch,
          pack_count: packCount,  // Use locked pack count
          wastage_percent: parseFloat(params.wastage_percent),
          version_id: selectedVersion?.id,
          batch_unit: params.batch_unit
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate BOM');
      }

      const data = await response.json();
      setBom(data);
    } catch (err) {
      console.error('Error generating BOM:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!calculatedBOM) return;

    const headers = [
      'Ingredient',
      'INCI Name',
      'CAS Number',
      'Category',
      'Percentage (%)',
      'Quantity (kg)',
      'Wastage (kg)',
      'Order Qty (kg)',
      'Cost/kg (₹)',
      'Line Cost (₹)'
    ];

    const rows = calculatedBOM.items.map(item => [
      item.name,
      item.inci_name || '',
      item.cas_number || '',
      item.category,
      item.percentage.toFixed(2),
      item.quantityKg.toFixed(3),
      params.wastage_type === 'aggregate' 
        ? (item.quantityKg * parseFloat(params.wastage_percent) / 100).toFixed(3)
        : item.wastageKg.toFixed(3),
      params.wastage_type === 'aggregate'
        ? (item.quantityKg * (1 + parseFloat(params.wastage_percent) / 100)).toFixed(3)
        : item.orderQtyKg.toFixed(3),
      item.costPerKg.toFixed(2),
      item.lineCost.toFixed(2)
    ]);

    // Add summary rows
    const summaryRows = [
      [],
      ['SUMMARY'],
      ['Batch Size', calculatedBOM.params.batchDisplay],
      ['Version', calculatedBOM.formulation.version],
      ['Pieces from Batch', calculatedBOM.production.piecesFromBatch],
      ['Packs from Batch', calculatedBOM.production.packsFromBatch],
      ['Total Weight (kg)', calculatedBOM.totals.weightKg.toFixed(3)],
      ['Total Wastage (kg)', calculatedBOM.totals.wastageKg.toFixed(3)],
      ['Total Order Qty (kg)', calculatedBOM.totals.orderKg.toFixed(3)],
      ['Total Raw Material Cost', calculatedBOM.totals.rawCost.toFixed(2)],
      ['Cost per Piece', calculatedBOM.totals.costPerPiece.toFixed(4)],
      ['Cost per Pack', calculatedBOM.totals.costPerPack.toFixed(2)],
      ['Aggregate Cost (all packs)', calculatedBOM.totals.aggregateCost.toFixed(2)]
    ];

    const csvContent = [
      `Bill of Materials - ${formulation.product_name}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Version: ${calculatedBOM.formulation.version}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(',')),
      ...summaryRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_${formulation.product_name.replace(/\s+/g, '_')}_${calculatedBOM.formulation.version}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!formulation?.ingredients?.length) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
        <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="font-medium text-gray-900 mb-2">No Ingredients</h3>
        <p>Add ingredients to the formulation to generate a Bill of Materials.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Version Info Banner */}
      {selectedVersion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Tag className="w-5 h-5 text-blue-600" />
          <div>
            <span className="font-medium text-blue-800">
              Generating BOM for Version: {selectedVersion.version_number}
            </span>
            <span className="text-blue-600 text-sm ml-2">
              (Select a different version from Version History tab)
            </span>
          </div>
        </div>
      )}

      {/* Parameters Card */}
      <div className="bg-white rounded-lg border p-6 print:hidden">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          BOM Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Batch Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Size
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="batch_size"
                value={params.batch_size}
                onChange={handleParamChange}
                min="1"
                step="1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="batch_unit"
                value={params.batch_unit}
                onChange={handleParamChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">kgs</option>
                <option value="tonnes">tonnes</option>
              </select>
            </div>
          </div>

          {/* Pack Count - LOCKED TO VERSION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              Pack Size
              <Lock className="w-3 h-3 text-gray-400" />
            </label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 flex items-center justify-between">
              <span className="font-medium">{packCount}-pack</span>
              <span className="text-xs text-gray-500">
                {selectedVersion ? 'From version' : 'From formulation'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Pack size is locked to the formulation version
            </p>
          </div>

          {/* Wastage % */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wastage (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="wastage_percent"
                value={params.wastage_percent}
                onChange={handleParamChange}
                min="0"
                max="20"
                step="0.5"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>

          {/* Wastage Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wastage Application
            </label>
            <select
              name="wastage_type"
              value={params.wastage_type}
              onChange={handleParamChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="aggregate">Aggregate (on total)</option>
              <option value="per_ingredient">Per Ingredient</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handlePrint}
            disabled={!calculatedBOM}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={exportCSV}
            disabled={!calculatedBOM}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* BOM Results */}
      {calculatedBOM && (
        <div className="bg-white rounded-lg border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Bill of Materials
                </h3>
                <p className="text-sm text-gray-500">
                  {formulation.product_name} • <span className="font-medium">{calculatedBOM.formulation.version}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Batch Size</div>
                <div className="text-lg font-semibold text-gray-900">
                  {calculatedBOM.params.batchDisplay}
                </div>
              </div>
            </div>
          </div>

          {/* Production Summary */}
          <div className="px-6 py-4 bg-blue-50 border-b grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 uppercase">Pieces</div>
              <div className="text-xl font-bold text-gray-900">
                {formatNumber(calculatedBOM.production.piecesFromBatch, 0)}
              </div>
              <div className="text-xs text-gray-500">@ {grammage}g each</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Packs</div>
              <div className="text-xl font-bold text-gray-900">
                {formatNumber(calculatedBOM.production.packsFromBatch, 0)}
              </div>
              <div className="text-xs text-gray-500">{packCount}-pack</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Wastage</div>
              <div className="text-xl font-bold text-gray-900">
                {formatNumber(calculatedBOM.totals.wastageKg, 2)} kg
              </div>
              <div className="text-xs text-gray-500">({params.wastage_percent}% {params.wastage_type})</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Total Order Qty</div>
              <div className="text-xl font-bold text-gray-900">
                {formatNumber(calculatedBOM.totals.orderKg, 2)} kg
              </div>
              <div className="text-xs text-gray-500">incl. wastage</div>
            </div>
          </div>

          {/* Ingredients Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ingredient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    %
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Qty (kg)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Wastage (kg)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Order Qty (kg)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Cost/kg
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Line Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calculatedBOM.items.map((item, idx) => {
                  // Calculate per-row wastage for display
                  const rowWastageKg = params.wastage_type === 'aggregate'
                    ? item.quantityKg * (parseFloat(params.wastage_percent) / 100)
                    : item.wastageKg;
                  const rowOrderKg = item.quantityKg + rowWastageKg;
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {item.percentage.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatNumber(item.quantityKg, 3)}
                      </td>
                      <td className="px-4 py-3 text-sm text-orange-600 text-right font-medium">
                        {formatNumber(rowWastageKg, 3)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {formatNumber(rowOrderKg, 3)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.costPerKg)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(rowOrderKg * item.costPerKg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-sm text-gray-900">
                    TOTALS
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatNumber(calculatedBOM.totals.weightKg, 3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-600 text-right">
                    {formatNumber(calculatedBOM.totals.wastageKg, 3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatNumber(calculatedBOM.totals.orderKg, 3)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    -
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 text-right font-bold">
                    {formatCurrency(calculatedBOM.totals.rawCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cost Summary Cards */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">Cost per Piece</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculatedBOM.totals.costPerPiece)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">
                  Cost per {packCount}-Pack
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculatedBOM.totals.costPerPack)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center">
                <div className="text-xs text-gray-500 uppercase mb-1">Total Raw Material</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(calculatedBOM.totals.rawCost)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border text-center border-green-200 bg-green-50">
                <div className="text-xs text-gray-500 uppercase mb-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Aggregate ({formatNumber(calculatedBOM.production.packsFromBatch, 0)} packs)
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculatedBOM.totals.aggregateCost)}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-6 py-4 bg-gray-100 border-t text-xs text-gray-600">
            <p className="mb-1"><strong>Notes:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Wastage ({params.wastage_percent}%) shown in kg for each ingredient</li>
              <li>Wastage applied as: {params.wastage_type === 'aggregate' ? 'aggregate on total' : 'per ingredient'}</li>
              <li>Costs calculated at current ingredient prices</li>
              <li>Version: {calculatedBOM.formulation.version}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMGenerator;
