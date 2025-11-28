import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import FormulationForm from '../components/FormulationForm';

const API_BASE_URL = '/api';

const FormulationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFormulation();
  }, [id]);

  const loadFormulation = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/formulations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormulation(response.data.formulation);
    } catch (err) {
      console.error('Error loading formulation:', err);
      setError('Failed to load formulation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/formulations/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success - navigate back to detail view
      navigate(`/formulations/${id}`);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update formulation');
    }
  };

  const handleCancel = () => {
    navigate(`/formulations/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => navigate('/formulations')}
            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Back to Formulations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Formulation
        </button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Formulation</h1>
          <p className="text-gray-600 mt-1">
            {formulation?.product_name}
          </p>
        </div>
      </div>

      {/* Form */}
      <FormulationForm
        initialData={formulation}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
};

export default FormulationEdit;
