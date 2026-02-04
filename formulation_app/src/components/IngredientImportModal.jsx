/**
 * Ingredient Import Modal v2.0
 *
 * Two-step import process:
 * 1. Upload file → Preview changes
 * 2. Review & select → Confirm updates
 */

import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const IngredientImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmResult, setConfirmResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];

      if (!validTypes.includes(selectedFile.type) &&
          !selectedFile.name.endsWith('.xlsx') &&
          !selectedFile.name.endsWith('.xls') &&
          !selectedFile.name.endsWith('.csv')) {
        setError('Please select an Excel (.xlsx, .xls) or CSV file');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setPreview(null);
      setConfirmResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Step 1: Upload and get preview
  const handlePreview = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/ingredients/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      setPreview(data);

      // Select all changes by default
      if (data.changes) {
        setSelectedIds(new Set(data.changes.map(c => c.id)));
      }
    } catch (err) {
      console.error('Preview error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm selected updates
  const handleConfirm = async () => {
    if (selectedIds.size === 0) {
      setError('Please select at least one item to update');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('confirm', 'true');

      // Add selected IDs
      selectedIds.forEach(id => {
        formData.append('selected_ids', id.toString());
      });

      const response = await api.post('/ingredients/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setConfirmResult(response.data);

      // Notify parent after delay
      setTimeout(() => {
        onSuccess(response.data);
      }, 2000);
    } catch (err) {
      console.error('Confirm error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (preview?.changes) {
      setSelectedIds(new Set(preview.changes.map(c => c.id)));
    }
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setPreview(null);
    setConfirmResult(null);
    setSelectedIds(new Set());
    onClose();
  };

  const handleBack = () => {
    setPreview(null);
    setError(null);
    setSelectedIds(new Set());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {confirmResult ? 'Import Complete' : preview ? 'Review Price Changes' : 'Import Ingredients'}
          </h2>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* STEP 3: Confirm Result */}
          {confirmResult && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Successful</h3>
              <p className="text-gray-600 mb-4">
                Updated {confirmResult.updated} ingredient{confirmResult.updated !== 1 ? 's' : ''}
                {confirmResult.imported > 0 && `, added ${confirmResult.imported} new`}
              </p>
            </div>
          )}

          {/* STEP 2: Preview Changes */}
          {preview && !confirmResult && (
            <div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">{preview.summary?.total_changes || 0}</div>
                  <div className="text-xs text-blue-600">Price Changes</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{preview.summary?.price_decreases || 0}</div>
                  <div className="text-xs text-green-600">Decreases</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">{preview.summary?.price_increases || 0}</div>
                  <div className="text-xs text-red-600">Increases</div>
                </div>
              </div>

              {/* Selection controls */}
              {preview.changes && preview.changes.length > 0 && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    {selectedIds.size} of {preview.changes.length} selected
                  </span>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-xs text-blue-600 hover:text-blue-800">
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={selectNone} className="text-xs text-gray-600 hover:text-gray-800">
                      Select None
                    </button>
                  </div>
                </div>
              )}

              {/* Changes list */}
              {preview.changes && preview.changes.length > 0 ? (
                <div className="border rounded-lg overflow-hidden max-h-72 overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="w-10 px-3 py-2"></th>
                        <th className="text-left px-3 py-2 font-medium text-gray-700">Ingredient</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-700">Current</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-700">New</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-700">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {preview.changes.map((change) => (
                        <tr
                          key={change.id}
                          className={`hover:bg-gray-50 cursor-pointer ${selectedIds.has(change.id) ? 'bg-blue-50' : ''}`}
                          onClick={() => toggleSelection(change.id)}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(change.id)}
                              onChange={() => toggleSelection(change.id)}
                              className="rounded text-blue-600"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-900">{change.name}</td>
                          <td className="px-3 py-2 text-right text-gray-600">₹{change.current_price}</td>
                          <td className="px-3 py-2 text-right font-medium">₹{change.new_price}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={`inline-flex items-center gap-1 ${
                              change.change > 0 ? 'text-red-600' : change.change < 0 ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {change.change > 0 ? <TrendingUp className="w-3 h-3" /> :
                               change.change < 0 ? <TrendingDown className="w-3 h-3" /> :
                               <Minus className="w-3 h-3" />}
                              {change.change > 0 ? '+' : ''}{change.change_percent}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No price changes found in the file.</p>
                  {preview.skipped > 0 && (
                    <p className="text-sm mt-2">{preview.skipped} rows skipped (no changes or not found)</p>
                  )}
                </div>
              )}

              {/* Errors */}
              {preview.error_details && preview.error_details.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    {preview.errors} row(s) had issues:
                  </p>
                  <ul className="text-xs text-yellow-700 list-disc list-inside">
                    {preview.error_details.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: File Upload */}
          {!preview && !confirmResult && (
            <>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors
                  ${file
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <FileSpreadsheet className="w-12 h-12 text-blue-600 mb-3" />
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="font-medium text-gray-900">Drop your file here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">Supports .xlsx, .xls, .csv</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tally Price Update Format</h4>
                <code className="text-xs bg-white px-2 py-1 rounded border block mb-2">
                  name, price
                </code>
                <p className="text-xs text-gray-500">
                  Extra columns are ignored. Column name variations accepted: name/item/material, price/cost/rate
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <div>
            {preview && !confirmResult && (
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {confirmResult ? 'Close' : 'Cancel'}
            </button>

            {!preview && !confirmResult && (
              <button
                onClick={handlePreview}
                disabled={!file || loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Processing...' : 'Preview Changes'}
              </button>
            )}

            {preview && !confirmResult && preview.changes && preview.changes.length > 0 && (
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0 || loading}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Updating...' : `Update ${selectedIds.size} Price${selectedIds.size !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientImportModal;
