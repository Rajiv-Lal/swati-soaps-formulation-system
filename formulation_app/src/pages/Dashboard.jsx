import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Beaker, FileText, LogOut } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Ingredients',
      description: 'Manage raw materials and ingredients',
      icon: Package,
      color: 'bg-blue-500',
      path: '/ingredients'
    },
    {
      title: 'Formulations',
      description: 'Create and manage product formulations',
      icon: Beaker,
      color: 'bg-green-500',
      path: '/formulations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Swati Soaps</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Formulation Management System
          </h1>
          <p className="text-lg text-gray-600">
            Manage ingredients, create formulations, and generate BOMs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h2>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
