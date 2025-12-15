/**
 * Test Results Component v2.3
 * 
 * FIXES:
 * - No bleeding UI (no refresh prices, etc.)
 * - Estimated scores calculated and displayed on load
 * - Clear separation of estimated vs actual
 * - Proper loading states
 */

import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Plus, Edit2, Trash2, Save, X, 
  TrendingUp, TrendingDown, Minus, AlertCircle, 
  Loader2, RefreshCw, Beaker, Activity, Calculator
} from 'lucide-react';

const API_BASE = 'http://165.22.222.87:5000/api';

const TestResults = ({ formulation, selectedVersion = null }) => {
  const [tests, setTests] = useState([]);
  const [estimatedScores, setEstimatedScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEstimated, setLoadingEstimated] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  
  const [formData, setFormData] = useState({
    test_date: new Date().toISOString().split('T')[0],
    hardness_value: '',
    hardness_method: 'penetrometer',
    lather_quality: '',
    lather_quantity: '',
    lather_stability: '',
    notes: ''
  });

  // Load data when formulation or version changes
  useEffect(() => {
    if (formulation?.id) {
      loadTests();
      loadEstimatedScores();
    }
  }, [formulation?.id, selectedVersion?.id]);

  const getToken = () => localStorage.getItem('token');

  const loadTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/formulations/${formulation.id}/tests`,
        { headers: { 'Authorization': `Bearer ${getToken()}` } }
      );
      
      if (!response.ok) throw new Error('Failed to load tests');
      
      const data = await response.json();
      setTests(data.tests || []);
    } catch (err) {
      console.error('Error loading tests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEstimatedScores = async () => {
    setLoadingEstimated(true);
    try {
      const versionParam = selectedVersion?.id ? `?version_id=${selectedVersion.id}` : '';
      const url = `${API_BASE}/formulations/${formulation.id}/estimated-scores${versionParam}`;
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) {
        // Don't throw - estimated scores are optional
        console.warn('Could not load estimated scores');
        setEstimatedScores(null);
        return;
      }
      
      const data = await response.json();
      setEstimatedScores(data);
    } catch (err) {
      console.error('Error loading estimated scores:', err);
      setEstimatedScores(null);
    } finally {
      setLoadingEstimated(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingTest 
        ? `${API_BASE}/tests/${editingTest.id}`
        : `${API_BASE}/formulations/${formulation.id}/tests`;
      
      const method = editingTest ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          hardness_value: formData.hardness_value ? parseFloat(formData.hardness_value) : null,
          lather_quality: formData.lather_quality ? parseInt(formData.lather_quality) : null,
          lather_quantity: formData.lather_quantity ? parseInt(formData.lather_quantity) : null,
          lather_stability: formData.lather_stability ? parseInt(formData.lather_stability) : null
        })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save test');
      }
      
      await loadTests();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      test_date: test.test_date || new Date().toISOString().split('T')[0],
      hardness_value: test.hardness_value || '',
      hardness_method: test.hardness_method || 'penetrometer',
      lather_quality: test.lather_quality || '',
      lather_quantity: test.lather_quantity || '',
      lather_stability: test.lather_stability || '',
      notes: test.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (testId) => {
    if (!confirm('Delete this test result?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/tests/${testId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to delete test');
      
      await loadTests();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingTest(null);
    setFormData({
      test_date: new Date().toISOString().split('T')[0],
      hardness_value: '',
      hardness_method: 'penetrometer',
      lather_quality: '',
      lather_quantity: '',
      lather_stability: '',
      notes: ''
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get latest actual test for comparison
  const latestTest = tests.length > 0 ? tests[0] : null;
  
  // Calculate average lather score from latest test
  const getActualLatherScore = (test) => {
    if (!test) return null;
    const scores = [test.lather_quality, test.lather_quantity, test.lather_stability].filter(s => s != null);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getRatingBadge = (rating) => {
    const colors = {
      'High': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-red-100 text-red-800'
    };
    return colors[rating] || 'bg-gray-100 text-gray-800';
  };

  const getComparisonIcon = (estimated, actual) => {
    if (estimated === null || actual === null) return null;
    const diff = actual - estimated;
    if (Math.abs(diff) < 5) return <Minus className="w-4 h-4 text-gray-400" />;
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  if (loading && loadingEstimated) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Version Info */}
      {selectedVersion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <strong>Showing scores for:</strong> {selectedVersion.version_number}
        </div>
      )}

      {/* Estimated vs Actual Comparison Card */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Quality Scores Comparison
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Estimated (calculated from ingredient coefficients) vs Actual (from lab tests)
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Hardness Comparison */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Hardness
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Estimated */}
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-blue-600 uppercase font-medium mb-1">
                    Estimated
                  </div>
                  {loadingEstimated ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-400" />
                  ) : estimatedScores?.estimated_scores?.hardness != null ? (
                    <>
                      <div className="text-3xl font-bold text-blue-700">
                        {estimatedScores.estimated_scores.hardness}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getRatingBadge(estimatedScores.estimated_scores.hardness_rating)}`}>
                        {estimatedScores.estimated_scores.hardness_rating}
                      </span>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm py-2">
                      <Calculator className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      No coefficient data
                    </div>
                  )}
                </div>

                {/* Actual */}
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-green-600 uppercase font-medium mb-1">
                    Actual
                  </div>
                  {latestTest?.hardness_value != null ? (
                    <>
                      <div className="text-3xl font-bold text-green-700">
                        {latestTest.hardness_value}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {getComparisonIcon(
                          estimatedScores?.estimated_scores?.hardness,
                          latestTest.hardness_value
                        )}
                        <span className="text-xs text-gray-500">
                          {latestTest.hardness_method}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm py-2">
                      <Beaker className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      No test yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lather Comparison */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                Lather
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Estimated */}
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-purple-600 uppercase font-medium mb-1">
                    Estimated
                  </div>
                  {loadingEstimated ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-purple-400" />
                  ) : estimatedScores?.estimated_scores?.lather != null ? (
                    <>
                      <div className="text-3xl font-bold text-purple-700">
                        {estimatedScores.estimated_scores.lather}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getRatingBadge(estimatedScores.estimated_scores.lather_rating)}`}>
                        {estimatedScores.estimated_scores.lather_rating}
                      </span>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm py-2">
                      <Calculator className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      No coefficient data
                    </div>
                  )}
                </div>

                {/* Actual */}
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-xs text-green-600 uppercase font-medium mb-1">
                    Actual (Avg)
                  </div>
                  {getActualLatherScore(latestTest) != null ? (
                    <>
                      <div className="text-3xl font-bold text-green-700">
                        {getActualLatherScore(latestTest)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {getComparisonIcon(
                          estimatedScores?.estimated_scores?.lather,
                          getActualLatherScore(latestTest)
                        )}
                        <span className="text-xs text-gray-500">
                          Q:{latestTest.lather_quality || '-'} Qty:{latestTest.lather_quantity || '-'} S:{latestTest.lather_stability || '-'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm py-2">
                      <Beaker className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      No test yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Data Coverage Note */}
          {estimatedScores?.coverage && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <strong>Note:</strong> {estimatedScores.coverage.note}
            </div>
          )}
          
          {/* No data message */}
          {!loadingEstimated && !estimatedScores?.estimated_scores?.hardness && !estimatedScores?.estimated_scores?.lather && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <strong>No estimated scores available.</strong> This formulation's ingredients don't have hardness/lather coefficients in the database. 
              Add coefficient data to ingredients in the Ingredients section to enable predictions.
            </div>
          )}
        </div>
      </div>

      {/* Ingredient Contributions (Collapsible) */}
      {estimatedScores?.ingredient_contributions?.length > 0 && (
        <details className="bg-white rounded-lg border">
          <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
            View Ingredient Contributions to Scores ({estimatedScores.ingredient_contributions.length} ingredients with data)
          </summary>
          <div className="px-6 pb-4">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ingredient</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">%</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Hardness +</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Lather +</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">SAP</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">INS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {estimatedScores.ingredient_contributions.map((ing, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">{ing.name}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{ing.percentage}%</td>
                    <td className="px-3 py-2 text-right text-blue-600 font-medium">{ing.hardness_contribution}</td>
                    <td className="px-3 py-2 text-right text-purple-600 font-medium">{ing.lather_contribution}</td>
                    <td className="px-3 py-2 text-right text-gray-500">{ing.sap_value || '-'}</td>
                    <td className="px-3 py-2 text-right text-gray-500">{ing.ins_value || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}

      {/* Test History Section */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-green-600" />
            Test Results History
          </h3>
          <div className="flex gap-2">
            <button
              onClick={loadTests}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Test Result
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">
                  {editingTest ? 'Edit Test Result' : 'New Test Result'}
                </h4>
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Date
                  </label>
                  <input
                    type="date"
                    name="test_date"
                    value={formData.test_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hardness Value (0-100)
                  </label>
                  <input
                    type="number"
                    name="hardness_value"
                    value={formData.hardness_value}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hardness Method
                  </label>
                  <select
                    name="hardness_method"
                    value={formData.hardness_method}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="penetrometer">Penetrometer</option>
                    <option value="durometer">Durometer</option>
                    <option value="subjective">Subjective</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lather Quality (1-10)
                  </label>
                  <input
                    type="number"
                    name="lather_quality"
                    value={formData.lather_quality}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    placeholder="1-10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lather Quantity (1-10)
                  </label>
                  <input
                    type="number"
                    name="lather_quantity"
                    value={formData.lather_quantity}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    placeholder="1-10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lather Stability (1-10)
                  </label>
                  <input
                    type="number"
                    name="lather_stability"
                    value={formData.lather_stability}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    placeholder="1-10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any observations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingTest ? 'Update' : 'Save'} Test
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Test Results Table */}
        {tests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Beaker className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="font-medium text-gray-900 mb-2">No Test Results</h4>
            <p>Add your first test result to track quality metrics.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hardness</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lather Quality</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lather Qty</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lather Stability</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tests.map((test, idx) => (
                  <tr key={test.id} className={idx === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(test.test_date)}
                      {idx === 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                          Latest
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {test.hardness_value != null ? (
                        <span className="font-medium">{test.hardness_value}</span>
                      ) : '-'}
                      {test.hardness_method && (
                        <div className="text-xs text-gray-400">{test.hardness_method}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-medium">
                      {test.lather_quality ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-medium">
                      {test.lather_quantity ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-medium">
                      {test.lather_stability ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {test.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleEdit(test)}
                        className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;
