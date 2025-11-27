import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_BASE_URL = '/api';

const IngredientImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    // Preview the file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        
        setPreview({
          rows: data.slice(0, 10), // Show first 10 rows
          totalRows: data.length
        });
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Failed to parse Excel file');
      }
    };
    reader.readAsBinaryString(selectedFile);
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
      link.setAttribute('download', 'ingredient_import_template.xlsx');
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
      alert('Please select a file to import');
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

      setResult(response.data);
      
      if (response.data.success_count > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error importing ingredients:', error);
      setResult({
        success: false,
        error: error.response?.data?.error || 'Import failed',
        success_count: 0,
        error_count: preview?.totalRows || 0
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                Import Ingredients
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload Excel file to bulk import ingredients
              </p>
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
            {/* Download Template */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Step 1: Download Template</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Download the Excel template with required columns and sample data
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Template
                  </button>
                </div>
              </div>
            </div>

            {/* Upload File */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Step 2: Upload Your File</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select Excel file (.xlsx, .xls) with ingredient data
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={importing}
                />
                <span className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 inline-flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Choose File
                </span>
              </label>
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Preview */}
            {preview && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Preview ({preview.totalRows} rows total, showing first 10)
                </h3>
                <div className="border rounded-lg overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(preview.rows[0] || {}).slice(0, 8).map((key) => (
                          <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.rows.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).slice(0, 8).map((value, i) => (
                            <td key={i} className="px-3 py-2 text-gray-900 whitespace-nowrap">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Note: Only showing first 8 columns for preview
                </p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className={`border rounded-lg p-4 ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      result.success ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {result.message || result.error}
                    </h3>
                    
                    {result.success && (
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {result.success_count}
                          </div>
                          <div className="text-sm text-green-800">Imported Successfully</div>
                        </div>
                        {result.error_count > 0 && (
                          <div>
                            <div className="text-2xl font-bold text-red-600">
                              {result.error_count}
                            </div>
                            <div className="text-sm text-red-800">Failed</div>
                          </div>
                        )}
                      </div>
                    )}

                    {result.errors && result.errors.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-semibold text-sm mb-2">Errors:</h4>
                        <div className="bg-white rounded border border-gray-200 p-3 max-h-40 overflow-y-auto">
                          <ul className="text-sm space-y-1">
                            {result.errors.map((error, index) => (
                              <li key={index} className="text-red-700">• {error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {preview && `${preview.totalRows} rows ready to import`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={importing}
              >
                {result ? 'Close' : 'Cancel'}
              </button>
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      </div>
    </div>
  );
};

export default IngredientImportModal;
