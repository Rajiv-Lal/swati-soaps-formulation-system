import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

const Formulations = () => {
  const navigate = useNavigate();
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFormulations();
  }, []);

  const fetchFormulations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/formulations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFormulations(data.formulations || []);
    } catch (error) {
      console.error('Error fetching formulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFormulations = formulations.filter(f =>
    f.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button onClick={() => navigate('/')} className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </button>
              <span className="text-xl font-bold text-gray-800">Formulations</span>
            </div>
            
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search formulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grammage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFormulations.map((f) => (
                  <tr key={f.id} onClick={() => navigate(`/formulations/${f.id}`)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{f.product_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{f.product_type_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{f.grammage}g</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 text-xs font-semibold rounded-full ${f.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹{f.total_cost_per_piece?.toFixed(2)}</td>
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

export default Formulations;
