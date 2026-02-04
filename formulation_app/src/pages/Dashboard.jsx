/**
 * Dashboard Page v2.5
 * 
 * Main landing page after login showing:
 * - Quick stats (formulations, ingredients counts)
 * - Recent formulations
 * - Pending approvals (for owner/admin)
 * - Quick action buttons
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Beaker, Package, FileText, Plus, Clock, CheckCircle, 
  AlertCircle, TrendingUp, Users, Shield, ArrowRight,
  Activity, Calendar
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFormulations: 0,
    activeFormulations: 0,
    draftFormulations: 0,
    totalIngredients: 0,
    pendingApprovals: 0
  });
  const [recentFormulations, setRecentFormulations] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('viewer');
  const [userName, setUserName] = useState('');

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    // Get user info
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'viewer');
        setUserName(user.name || user.email || 'User');
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = getToken();
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch formulations
      const formRes = await fetch(`${API_BASE}/formulations`, { headers });
      const formData = await formRes.json();
      const formulations = formData.formulations || [];

      // Fetch ingredients
      const ingRes = await fetch(`${API_BASE}/ingredients`, { headers });
      const ingData = await ingRes.json();
      const ingredients = ingData.ingredients || [];

      // Calculate stats
      const active = formulations.filter(f => f.status === 'active').length;
      const draft = formulations.filter(f => f.status === 'draft').length;

      setStats({
        totalFormulations: formulations.length,
        activeFormulations: active,
        draftFormulations: draft,
        totalIngredients: ingredients.length,
        pendingApprovals: 0
      });

      // Get recent formulations (last 5)
      const sorted = [...formulations].sort((a, b) => 
        new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
      );
      setRecentFormulations(sorted.slice(0, 5));

      // Fetch pending approvals if owner/admin
      if (['owner', 'admin'].includes(userRole)) {
        try {
          const approvalRes = await fetch(`${API_BASE}/admin/pending-approvals`, { headers });
          if (approvalRes.ok) {
            const approvalData = await approvalRes.json();
            setPendingApprovals(approvalData.pending_approvals || []);
            setStats(prev => ({
              ...prev,
              pendingApprovals: (approvalData.pending_approvals || []).length
            }));
          }
        } catch (e) {
          console.warn('Could not fetch pending approvals');
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const canAccessAdmin = () => ['owner', 'admin'].includes(userRole);
  const canCreateFormulation = () => ['qc', 'owner', 'admin'].includes(userRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your formulations today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Formulations */}
        <div 
          className="bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/formulations')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Formulations</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalFormulations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Beaker className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.activeFormulations} active</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-yellow-600">{stats.draftFormulations} draft</span>
          </div>
        </div>

        {/* Total Ingredients */}
        <div 
          className="bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/ingredients')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Ingredients Library</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalIngredients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            Click to manage ingredients
          </div>
        </div>

        {/* Pending Approvals (Owner/Admin only) */}
        {canAccessAdmin() && (
          <div 
            className="bg-white rounded-lg border p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/admin')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingApprovals}</p>
              </div>
              <div className={`p-3 rounded-full ${stats.pendingApprovals > 0 ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <Clock className={`w-6 h-6 ${stats.pendingApprovals > 0 ? 'text-orange-600' : 'text-gray-400'}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.pendingApprovals > 0 ? (
                <span className="text-orange-600 font-medium">Requires your attention</span>
              ) : (
                <span className="text-green-600">All caught up!</span>
              )}
            </div>
          </div>
        )}

        {/* Quick Action */}
        <div 
          className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white ${canCreateFormulation() ? 'cursor-pointer hover:from-blue-600 hover:to-blue-700' : 'opacity-75'}`}
          onClick={() => canCreateFormulation() && navigate('/formulations/create')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Quick Action</p>
              <p className="text-xl font-bold mt-1">
                {canCreateFormulation() ? 'Create Formulation' : 'View Formulations'}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-100">
            <ArrowRight className="w-4 h-4 mr-1" />
            {canCreateFormulation() ? 'Start a new formulation' : 'Browse existing formulations'}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Formulations */}
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Recent Formulations
            </h2>
            <button
              onClick={() => navigate('/formulations')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentFormulations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Beaker className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No formulations yet</p>
              {canCreateFormulation() && (
                <button
                  onClick={() => navigate('/formulations/create')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create First Formulation
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {recentFormulations.map(form => (
                <div 
                  key={form.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/formulations/${form.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{form.product_name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {form.product_type_name || 'Soap'} • {form.grammage}g
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(form.status)}`}>
                      {form.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    Updated {formatDate(form.updated_at || form.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Pending Approvals List (Owner/Admin only) */}
          {canAccessAdmin() && pendingApprovals.length > 0 && (
            <div className="bg-white rounded-lg border">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Pending Approvals
                </h2>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Review all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y">
                {pendingApprovals.slice(0, 3).map(approval => (
                  <div 
                    key={approval.version_id}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/formulations/${approval.formulation_id}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{approval.product_name}</h3>
                        <p className="text-sm text-gray-500">
                          v{approval.version_number} • by {approval.submitted_by_name || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-lg border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/formulations')}
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Beaker className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">Formulations</span>
              </button>
              
              <button
                onClick={() => navigate('/ingredients')}
                className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <Package className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-700">Ingredients</span>
              </button>
              
              {canCreateFormulation() && (
                <button
                  onClick={() => navigate('/formulations/create')}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-700">New Formulation</span>
                </button>
              )}
              
              {canAccessAdmin() && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <Shield className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-700">Admin Panel</span>
                </button>
              )}
            </div>
          </div>

          {/* User Role Info */}
          <div className="bg-gray-50 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full">
                <Users className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-900">{userName}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                  userRole === 'admin' ? 'bg-red-100 text-red-700' :
                  userRole === 'owner' ? 'bg-purple-100 text-purple-700' :
                  userRole === 'qc' ? 'bg-blue-100 text-blue-700' :
                  userRole === 'accountant' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
