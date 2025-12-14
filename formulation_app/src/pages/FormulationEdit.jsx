/**
 * Formulation Edit Page
 * 
 * Edits an existing formulation using FormulationBuilder component
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../components/common/Toast';
import { PageLoading } from '../components/common/LoadingSpinner';
import FormulationBuilder from '../components/FormulationBuilder';

const FormulationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFormulation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/formulations/${id}`);
      setFormulation(response.data.formulation);
    } catch (err) {
      console.error('Error loading formulation:', err);
      const message = getErrorMessage(err);
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    loadFormulation();
  }, [loadFormulation]);

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/formulations/${id}`, formData);
      showSuccess('Formulation updated successfully');
      navigate(`/formulations/${id}`);
    } catch (error) {
      const message = getErrorMessage(error);
      showError(message);
      throw new Error(message);
    }
  };

  const handleCancel = () => {
    navigate(`/formulations/${id}`);
  };

  if (loading) {
    return <PageLoading message="Loading formulation..." />;
  }

  if (error || !formulation) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error || 'Formulation not found'}</p>
            <button
              onClick={() => navigate('/formulations')}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Back to Formulations
            </button>
          </div>
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
            {formulation.product_name}
          </p>
        </div>
      </div>

      {/* Builder */}
      <FormulationBuilder
        initialData={formulation}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
      />
    </div>
  );
};

export default FormulationEdit;
