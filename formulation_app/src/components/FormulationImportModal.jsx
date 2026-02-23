/**
 * Formulation Import Modal
 *
 * Two-step import: Preview → Confirm/Cancel
 */

import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';

const FormulationImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);  // Preview data
  const [result, setResult] = useState(null);    // Final import result
  const [expandedFormulation, setExpandedFormulation] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!validTypes.includes(selectedFile.type) &&
          !selectedFile.name.endsWith('.xlsx') &&
          !selectedFile.name.endsWith('.xls')) {
        setError('Please select an Excel file (.xlsx or .xls)');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setPreview(null);
      setResult(null);
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

  // Step 1: Upload for preview
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
      // Default is preview mode, no need to add confirm=false

      const response = await api.post('/formulations/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.mode === 'preview') {
        setPreview(response.data);
      }
    } catch (err) {
      console.error('Preview error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm import
  const handleConfirmImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('confirm', 'true');

      const response = await api.post('/formulations/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data);
      setPreview(null);

      if (response.data.imported > 0 || response.data.formulations_created > 0) {
        setTimeout(() => {
          onSuccess(response.data);
        }, 2000);
      }
    } catch (err) {
      console.error('Import error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Cancel preview and go back to file selection
  const handleCancelPreview = () => {
    setPreview(null);
    setError(null);
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setPreview(null);
    setResult(null);
    onClose();
  };

  const toggleFormulationExpand = (index) => {
    setExpandedFormulation(expandedFormulation === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {preview ? 'Review Import' : result ? 'Import Complete' : 'Import Formulations'}
          </h2>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Final Result */}
          {result && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Import Complete</p>
                  <p className="text-sm text-green-700 mt-1">
                    Successfully imported {result.imported || result.formulations_created} formulation{(result.imported || result.formulations_created) !== 1 ? 's' : ''}
                    {result.skipped > 0 && `, skipped ${result.skipped}`}
                  </p>
                  {result.ingredients_created > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      {result.ingredients_created} new ingredient{result.ingredients_created !== 1 ? 's' : ''} auto-created
                    </p>
                  )}
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2 text-xs text-amber-700">
                      <p className="font-medium">Warnings:</p>
                      <ul className="list-disc list-inside">
                        {result.errors.slice(0, 3).map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                        {result.errors.length > 3 && <li>...and {result.errors.length - 3} more</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {preview && !result && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Preview: {preview.valid_count} formulations ready to import</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {preview.sheets_processed} sheets processed •
                      {preview.ingredients_matched} ingredients matched •
                      {preview.ingredients_to_create} new ingredients will be created
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulations List */}
              <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                {preview.formulations?.map((form, idx) => (
                  <div key={idx} className="p-3">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFormulationExpand(idx)}
                    >
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">{form.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {form.grammage}g • {form.ingredient_count} ingredients • ₹{form.estimated_cost.toFixed(2)}/piece
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${form.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {form.valid ? 'Valid' : 'Invalid'}
                        </span>
                        {expandedFormulation === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded ingredients */}
                    {expandedFormulation === idx && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-500">
                              <th className="text-left py-1">Ingredient</th>
                              <th className="text-right py-1">%</th>
                              <th className="text-right py-1">Cost/kg</th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.ingredients?.map((ing, i) => (
                              <tr key={i} className="text-gray-700">
                                <td className="py-1">{ing.ingredient_name}</td>
                                <td className="text-right">{ing.percentage.toFixed(2)}%</td>
                                <td className="text-right">₹{ing.unit_cost?.toFixed(2) || '0.00'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Errors/Warnings */}
              {preview.errors && preview.errors.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-xs font-medium text-amber-800">Skipped sheets ({preview.errors.length}):</p>
                  <ul className="text-xs text-amber-700 mt-1 list-disc list-inside">
                    {preview.errors.slice(0, 5).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                    {preview.errors.length > 5 && <li>...and {preview.errors.length - 5} more</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* File Selection (only when no preview and no result) */}
          {!preview && !result && (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <FileSpreadsheet className="w-12 h-12 text-blue-600 mb-3" />
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
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
                    <p className="text-xs text-gray-400 mt-2">Supports .xlsx, .xls</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Excel Format</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• <strong>Sheet name</strong> = Product name</li>
                  <li>• <strong>Grammage row</strong> (required): "Grammage" | 75</li>
                  <li>• <strong>Piece per case</strong> (optional): "Piece per case" | 3</li>
                  <li>• <strong>Ingredients table</strong> with header row:</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  Ingredient* | Supplier | %* | HSN | _ | Cost/kg
                </p>
                <p className="text-xs text-gray-400 mt-1">* Required. Percentages must add to 100%.</p>
                <p className="text-xs text-green-600 mt-1">Existing ingredients auto-fill supplier, HSN, cost from database.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          {/* When showing preview: Cancel + Confirm buttons */}
          {preview && !result && (
            <>
              <button
                onClick={handleCancelPreview}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={loading || preview.valid_count === 0}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Importing...' : `Import ${preview.valid_count} Formulations`}
              </button>
            </>
          )}

          {/* When showing result: Close button */}
          {result && (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          )}

          {/* Initial state: Cancel + Preview buttons */}
          {!preview && !result && (
            <>
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                disabled={!file || loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Analyzing...' : 'Preview Import'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulationImportModal;
