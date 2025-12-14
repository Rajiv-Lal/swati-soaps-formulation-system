/**
 * Formulation Create Page
 * 
 * Creates a new formulation using FormulationBuilder component
 * with split-panel ingredient browser
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../components/common/Toast';
import FormulationBuilder from '../components/FormulationBuilder';

const FormulationCreate = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const response = await api.post('/formulations', formData);
      showSuccess('Formulation created successfully');

      // Navigate to the new formulation
      if (response.data.formulation_id) {
        navigate(`/formulations/${response.data.formulation_id}`);
      } else {
        navigate('/formulations');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showError(message);
      throw new Error(message);
    }
  };

  const handleCancel = () => {
    navigate('/formulations');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Formulations
        </button>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Formulation</h1>
          <p className="text-gray-600 mt-1">
            Browse ingredients by category and build your formula
          </p>
        </div>
      </div>

      {/* Builder */}
      <FormulationBuilder
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};

export default FormulationCreate;
