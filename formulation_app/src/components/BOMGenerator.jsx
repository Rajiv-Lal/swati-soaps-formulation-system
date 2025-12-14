/**
 * BOM Generator Component
 * 
 * Generates Bill of Materials for formulations with:
 * - Batch size input
 * - Calculated quantities
 * - Export options
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Download, Printer } from 'lucide-react';

const BOMGenerator = ({ formulation }) => {
  const [batchSize, setBatchSize] = useState(1000); // Default 1kg batch
  const [batchUnit, setBatchUnit] = useState('g'); // 'g' or 'kg'

  // Calculate BOM based on batch size
  const bomData = useMemo(() => {
    if (!formulation?.ingredients?.length) return [];

    const batchGrams = batchUnit === 'kg' ? batchSize * 1000 : batchSize;

    return formulation.ingredients.map(ing => {
      const percentage = parseFloat(ing.percentage) || 0;
      const quantityG = (percentage / 100) * batchGrams;
      const costPerKg = parseFloat(ing.cost_per_kg || ing.landed_cost_net_gst) || 0;
      const totalCost = (quantityG / 1000) * costPerKg;

      return {
        name: ing.name,
        inci_name: ing.inci_name,
        percentage,
        quantityG,
        quantityKg: quantityG / 1000,
        costPerKg,
        totalCost
      };
    });
  }, [formulation, batchSize, batchUnit]);

  // Calculate totals
  const totals = useMemo(() => {
    return bomData.reduce(
      (acc, item) => ({
        quantityG: acc.quantityG + item.quantityG,
        totalCost: acc.totalCost + item.totalCost
      }),
      { quantityG: 0, totalCost: 0 }
    );
  }, [bomData]);

  // Calculate pieces from batch
  const piecesFromBatch = useMemo(() => {
    if (!formulation?.grammage || formulation.grammage <= 0) return 0;
    return Math.floor(totals.quantityG / formulation.grammage);
  }, [totals.quantityG, formulation?.grammage]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Ingredient', 'INCI Name', 'Percentage', 'Quantity (g)', 'Quantity (kg)', 'Cost/kg', 'Total Cost'];
    const rows = bomData.map(item => [
      item.name,
      item.inci_name || '',
      item.percentage.toFixed(2),
      item.quantityG.toFixed(2),
      item.quantityKg.toFixed(4),
      item.costPerKg.toFixed(2),
      item.totalCost.toFixed(2)
    ]);

    // Add totals row
    rows.push(['TOTAL', '', '100.00', totals.quantityG.toFixed(2), (totals.quantityG / 1000).toFixed(4), '', totals.totalCost.toFixed(2)]);

    const csvContent = [
      `Bill of Materials - ${formulation?.product_name}`,
      `Batch Size: ${batchSize} ${batchUnit}`,
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_${formulation?.product_name?.replace(/\s+/g, '_')}_${batchSize}${batchUnit}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div className="space-y-6">
      {/* Batch Size Input */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-medium text-gray-900 mb-4">Batch Size</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Unit</label>
            <select
              value={batchUnit}
              onChange={(e) => setBatchUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="g">Grams (g)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Batch Weight</div>
          <div className="text-xl font-bold text-gray-900">
            {totals.quantityG >= 1000
              ? `${(totals.quantityG / 1000).toFixed(2)} kg`
              : `${totals.quantityG.toFixed(2)} g`}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Pieces from Batch</div>
          <div className="text-xl font-bold text-gray-900">
            {piecesFromBatch.toLocaleString()} pcs
          </div>
          <div className="text-xs text-gray-400">
            @ {formulation.grammage}g each
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Total Raw Material Cost</div>
          <div className="text-xl font-bold text-gray-900">
            ₹{totals.totalCost.toFixed(2)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-1">Cost per Piece</div>
          <div className="text-xl font-bold text-gray-900">
            ₹{piecesFromBatch > 0 ? (totals.totalCost / piecesFromBatch).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      {/* BOM Table */}
      <div className="bg-white rounded-lg border overflow-hidden print:shadow-none">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="font-medium text-gray-900">
            Bill of Materials - {formulation.product_name}
          </h3>
          <p className="text-sm text-gray-500">
            Batch: {batchSize} {batchUnit}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">%</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty (g)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty (kg)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate/kg</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bomData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.inci_name && (
                      <div className="text-sm text-gray-500">{item.inci_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {item.percentage.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {item.quantityG.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {item.quantityKg.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ₹{item.costPerKg.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">
                    ₹{item.totalCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={2} className="px-4 py-3 font-medium text-gray-900">
                  TOTAL
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">100%</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {totals.quantityG.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-600">
                  {(totals.quantityG / 1000).toFixed(4)}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  ₹{totals.totalCost.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BOMGenerator;
