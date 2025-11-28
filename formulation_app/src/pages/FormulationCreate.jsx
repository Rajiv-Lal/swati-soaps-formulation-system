import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import FormulationForm from '../components/FormulationForm';

const API_BASE_URL = '/api';

const FormulationCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/formulations`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success - navigate to the new formulation
      if (response.data.formulation_id) {
        navigate(`/formulations/${response.data.formulation_id}`);
      } else {
        navigate('/formulations');
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create formulation');
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
            Design a new soap or cosmetic formulation
          </p>
        </div>
      </div>

      {/* Form */}
      <FormulationForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={false}
      />
    </div>
  );
};

export default FormulationCreate;
