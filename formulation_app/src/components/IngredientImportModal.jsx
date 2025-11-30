import React, { useState } from 'react';
import { X, Upload, Download, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = '/api';

const IngredientImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/ingredients/template`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ingredients_template.csv');
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
        `${API_BASE_URL}/ingredients/import`,
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
        imported: response.data.imported,
        errors: response.data.errors || [],
        total: response.data.total_rows
      });

      if (response.data.imported > 0 && onSuccess) {
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Import Ingredients</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Download Template */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Step 1: Download Template</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Download the CSV template with required columns and sample data
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Download Template
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Upload File */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Step 2: Upload Your File</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select CSV file (.csv) with ingredient data
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
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
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? 'Import Successful!' : 'Import Failed'}
                  </h4>
                  
                  {result.success && (
                    <div className="text-sm text-green-800 space-y-1">
                      <p>✓ {result.imported} ingredients imported successfully</p>
                      {result.errors.length > 0 && (
                        <p>⚠ {result.errors.length} rows had errors</p>
                      )}
                    </div>
                  )}

                  {!result.success && (
                    <p className="text-sm text-red-800">{result.error}</p>
                  )}

                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-3 max-h-40 overflow-y-auto">
                      <p className="text-xs font-medium text-gray-700 mb-1">Errors:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {result.errors.map((error, idx) => (
                          <li key={idx}>• {error}</li>
                        ))}
                      </ul>
                    </div>
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
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Ingredients
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientImportModal;
