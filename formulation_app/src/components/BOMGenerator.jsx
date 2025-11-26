import React, { useState } from 'react';
import { FileText, Download, Loader, AlertCircle, Calculator } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const BOMGenerator = ({ formulation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bom, setBom] = useState(null);
  
  const [params, setParams] = useState({
    quantity: '1000',
    pack_count: '1',
    wastage_percent: '2.0'
  });

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const generateBOM = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/formulations/${formulation.id}/bom/generate`,
        {
          quantity: parseInt(params.quantity),
          pack_count: parseInt(params.pack_count),
          wastage_percent: parseFloat(params.wastage_percent)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBom(response.data);
    } catch (err) {
      console.error('Error generating BOM:', err);
      setError(err.response?.data?.error || 'Failed to generate BOM');
    } finally {
      setLoading(false);
    }
  };

  const exportBOM = (format) => {
    if (!bom) return;

    if (format === 'csv') {
      exportCSV();
    } else if (format === 'print') {
      window.print();
    }
  };

  const exportCSV = () => {
    const headers = [
      'Ingredient',
      'Category',
      'Percentage (%)',
      'Per Piece (g)',
      'Total (kg)',
      'Wastage (kg)',
      'Order Qty (kg)',
      'Cost/kg (₹)',
      'Line Cost (₹)'
    ];

    const rows = bom.items.map(item => [
      item.ingredient_name,
      item.category,
      item.percentage,
      item.per_piece_grams,
      item.total_kg,
      item.wastage_kg,
      item.order_qty_kg,
      item.cost_per_kg,
      item.line_cost
    ]);

    const summaryRows = [
      [],
      ['SUMMARY'],
      ['Total Weight (kg)', bom.summary.total_weight_kg],
      ['Total Wastage (kg)', bom.summary.total_wastage_kg],
      ['Total Order (kg)', bom.summary.total_order_kg],
      ['Total Cost (₹)', bom.summary.total_cost],
      ['Cost per Piece (₹)', bom.summary.cost_per_piece],
      ['Cost per Pack (₹)', bom.summary.cost_per_pack]
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      ...summaryRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_${formulation.product_name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Parameters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          BOM Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Quantity (pieces)
            </label>
            <input
              type="number"
              name="quantity"
              value={params.quantity}
              onChange={handleParamChange}
              min="1"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Pack Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pack Configuration
            </label>
            <select
              name="pack_count"
              value={params.pack_count}
              onChange={handleParamChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="1">1-pack (single)</option>
              <option value="3">3-pack</option>
              <option value="6">6-pack</option>
              <option value="12">12-pack</option>
            </select>
          </div>

          {/* Wastage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wastage (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                name="wastage_percent"
                value={params.wastage_percent}
                onChange={handleParamChange}
                min="0"
                max="10"
                step="0.5"
                className="flex-1"
                disabled={loading}
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {params.wastage_percent}%
              </span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateBOM}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating BOM...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Bill of Materials
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* BOM Results */}
      {bom && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between print:bg-white">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bill of Materials
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {bom.formulation.product_name} ({bom.formulation.version}) • 
                Generated: {new Date(bom.generated_at).toLocaleString()}
              </p>
            </div>
            
            {/* Export Buttons */}
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => exportBOM('csv')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => exportBOM('print')}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          {/* Parameters Summary */}
          <div className="px-6 py-4 bg-blue-50 border-b grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-600 uppercase">Target Quantity</div>
              <div className="text-lg font-semibold text-gray-900">
                {bom.parameters.target_quantity.toLocaleString()} packs
              </div>
              <div className="text-sm text-gray-600">
                ({bom.parameters.total_pieces.toLocaleString()} pieces)
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Pack Size</div>
              <div className="text-lg font-semibold text-gray-900">
                {bom.parameters.pack_count}-pack
              </div>
              <div className="text-sm text-gray-600">
                {bom.formulation.grammage}g per piece
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase">Wastage</div>
              <div className="text-lg font-semibold text-gray-900">
                {bom.parameters.wastage_percent}%
              </div>
              <div className="text-sm text-gray-600">
                {bom.summary.total_wastage_kg} kg total
              </div>
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
                    Per Piece
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Wastage
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Order Qty
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
                {bom.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.ingredient_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {item.percentage.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {item.per_piece_grams.toFixed(2)}g
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {item.total_kg.toFixed(3)} kg
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">
                      {item.wastage_kg.toFixed(3)} kg
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      {item.order_qty_kg.toFixed(3)} kg
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      ₹{item.cost_per_kg.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      ₹{item.line_cost.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-sm font-bold text-gray-900 uppercase">
                    TOTALS
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                    {bom.summary.total_weight_kg.toFixed(3)} kg
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-orange-600">
                    {bom.summary.total_wastage_kg.toFixed(3)} kg
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                    {bom.summary.total_order_kg.toFixed(3)} kg
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                    ₹{bom.summary.total_cost.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Cost Summary */}
          <div className="bg-blue-50 px-6 py-4 border-t">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-600 uppercase mb-1">Cost per Piece</div>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{bom.summary.cost_per_piece.toFixed(4)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 uppercase mb-1">
                  Cost per {bom.parameters.pack_count}-Pack
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{bom.summary.cost_per_pack.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 uppercase mb-1">Total Order Cost</div>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{bom.summary.total_cost.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-6 py-4 bg-gray-50 border-t text-xs text-gray-600">
            <p className="mb-1">
              <strong>Notes:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Wastage percentage ({bom.parameters.wastage_percent}%) is added to account for manufacturing losses</li>
              <li>Order quantities are rounded to 3 decimal places</li>
              <li>Costs are calculated at current ingredient prices</li>
              <li>Total quantity: {bom.parameters.total_pieces.toLocaleString()} pieces = {bom.parameters.target_quantity.toLocaleString()} × {bom.parameters.pack_count}-pack</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMGenerator;
