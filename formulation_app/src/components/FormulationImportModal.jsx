import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'http://localhost:5000/api';

const FormulationImportModal = ({ isOpen, onClose, onSuccess }) => {
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
        
        // Check for required sheets
        if (!workbook.SheetNames.includes('Formulations') || !workbook.SheetNames.includes('Ingredients')) {
          alert('Excel file must contain "Formulations" and "Ingredients" sheets');
          setFile(null);
          return;
        }

        const formulationsSheet = workbook.Sheets['Formulations'];
        const ingredientsSheet = workbook.Sheets['Ingredients'];
        
        const formulationsData = XLSX.utils.sheet_to_json(formulationsSheet);
        const ingredientsData = XLSX.utils.sheet_to_json(ingredientsSheet);
        
        setPreview({
          formulations: formulationsData.slice(0, 5),
          ingredients: ingredientsData.slice(0, 10),
          totalFormulations: formulationsData.length,
          totalIngredients: ingredientsData.length
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
      const response = await axios.get(`${API_BASE_URL}/formulations/template`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'formulation_import_template.xlsx');
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
        `${API_BASE_URL}/formulations/import`,
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
      console.error('Error importing formulations:', error);
      setResult({
        success: false,
        error: error.response?.data?.error || 'Import failed',
        success_count: 0,
        error_count: preview?.totalFormulations || 0
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
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                Import Formulations
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload Excel file with 2 sheets: Formulations & Ingredients
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
            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                <li>Excel file must have exactly 2 sheets: "Formulations" and "Ingredients"</li>
                <li>All ingredients must already exist in the database (import ingredients first)</li>
                <li>Percentages for each formulation must sum to exactly 100%</li>
                <li>Product names must be unique</li>
              </ul>
            </div>

            {/* Download Template */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Step 1: Download Template</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Download the Excel template with 2 sheets and sample data
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
                Select Excel file (.xlsx, .xls) with formulation data
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
              <div className="space-y-6">
                {/* Formulations Preview */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Formulations Sheet ({preview.totalFormulations} total, showing first 5)
                  </h3>
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(preview.formulations[0] || {}).map((key) => (
                            <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.formulations.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-3 py-2 text-gray-900 whitespace-nowrap">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Ingredients Preview */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Ingredients Sheet ({preview.totalIngredients} rows total, showing first 10)
                  </h3>
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Product Name
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Ingredient Name
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.ingredients.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-900">
                              {row['Product Name']}
                            </td>
                            <td className="px-3 py-2 text-gray-900">
                              {row['Ingredient Name']}
                            </td>
                            <td className="px-3 py-2 text-gray-900 text-right">
                              {row['Percentage']}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                          <div className="text-sm text-green-800">Formulations Imported</div>
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
                        <p className="text-xs text-gray-600 mt-2">
                          Tip: Fix errors in Excel and re-import. Successfully imported formulations remain in the system.
                        </p>
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
              {preview && `${preview.totalFormulations} formulations ready to import`}
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
                    Import Formulations
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

export default FormulationImportModal;
