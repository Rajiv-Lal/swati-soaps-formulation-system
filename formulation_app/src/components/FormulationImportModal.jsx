import React, { useState } from 'react';
import { X, Upload, Download, FileText, CheckCircle, AlertCircle, Loader, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const FormulationImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!(selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
      alert('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/formulations/template`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'formulations_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/formulations/import-excel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResult({
        success: true,
        ...response.data
      });

      if (response.data.formulations_created > 0 && onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: false,
        error: error.response?.data?.error || 'Import failed'
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Import Formulations from Excel</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Smart Excel Import</p>
                <p className="mb-2">Upload your multi-sheet Excel file. The system will:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Process each sheet as a separate formulation</li>
                  <li>Auto-match ingredient names to your database</li>
                  <li>Extract grammage, pack count, and percentages</li>
                  <li>Support unlimited ingredients per formulation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 1: Download Template */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Optional: Download CSV Template</h3>
                <p className="text-sm text-gray-600 mb-3">
                  For simple formulations, you can use the CSV template (supports 3 ingredients max)
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
                >
                  Download CSV Template
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Upload File */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Upload Excel File</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select your Excel file (.xlsx or .xls) with multiple formulation sheets
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700"
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Import Completed!' : 'Import Failed'}
                  </h4>
                  
                  {result.success && (
                    <div className="text-sm space-y-2">
                      <div className="text-green-800">
                        <p className="font-medium">✓ {result.formulations_created} formulations created</p>
                        <p>✓ {result.sheets_processed} sheets processed</p>
                        <p>✓ {result.ingredients_matched} ingredients matched</p>
                      </div>

                      {result.ingredients_not_found && result.ingredients_not_found.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-yellow-900 mb-1">
                                {result.ingredients_not_found.length} ingredients not found in database:
                              </p>
                              <div className="max-h-32 overflow-y-auto">
                                <ul className="text-xs text-yellow-800 space-y-1">
                                  {result.ingredients_not_found.map((item, idx) => (
                                    <li key={idx}>• {item.sheet}: <span className="font-medium">{item.ingredient}</span></li>
                                  ))}
                                </ul>
                              </div>
                              <p className="text-xs text-yellow-700 mt-2">Add these ingredients first, then re-import those formulations.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.errors && result.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs font-medium text-red-900 mb-1">Errors:</p>
                          <ul className="text-xs text-red-800 space-y-1 max-h-32 overflow-y-auto">
                            {result.errors.map((error, idx) => (
                              <li key={idx}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!result.success && (
                    <p className="text-sm text-red-800">{result.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={importing}
          >
            {result && result.success ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Formulations
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormulationImportModal;
