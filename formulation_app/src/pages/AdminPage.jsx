/**
 * Admin Page v2.5
 * 
 * FEATURES:
 * - User management (CRUD)
 * - Role assignment
 * - Pending approvals list
 * - Approve/Reject formulation versions
 * - Only accessible by owner/admin
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, CheckCircle, XCircle, Clock, ArrowLeft,
  Plus, Edit2, Trash2, Save, X, AlertCircle, Eye, EyeOff,
  Send, RefreshCw, UserCheck, UserX
} from 'lucide-react';

const API_BASE = '/api';

const ROLES = [
  { value: 'viewer', label: 'Viewer', description: 'View only, no edit rights' },
  { value: 'qc', label: 'QC', description: 'Edit formulations & ingredients' },
  { value: 'accountant', label: 'Accountant', description: 'Edit ingredients only' },
  { value: 'owner', label: 'Owner', description: 'All rights including make active' },
  { value: 'admin', label: 'Admin', description: 'All rights including user management' }
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [userRole, setUserRole] = useState('viewer');
  
  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'viewer',
    is_active: true
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Approvals state
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(true);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    // Check user role
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'viewer');
        
        // Only owner/admin can access admin page
        if (!['owner', 'admin'].includes(user.role)) {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
    
    loadUsers();
    loadPendingApprovals();
  }, []);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to load users');
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadPendingApprovals = async () => {
    setLoadingApprovals(true);
    try {
      const response = await fetch(`${API_BASE}/admin/pending-approvals`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to load pending approvals');
      
      const data = await response.json();
      setPendingApprovals(data.pending_approvals || []);
    } catch (err) {
      console.error('Error loading approvals:', err);
    } finally {
      setLoadingApprovals(false);
    }
  };

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  const handleUserFormChange = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserForm({
      email: '',
      full_name: '',
      password: '',
      role: 'viewer',
      is_active: true
    });
    setShowUserModal(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      full_name: user.full_name || '',
      password: '', // Don't show existing password
      role: user.role,
      is_active: user.is_active !== false
    });
    setShowUserModal(true);
  };

  const saveUser = async () => {
    setError(null);
    
    if (!userForm.email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!editingUser && !userForm.password) {
      setError('Password is required for new users');
      return;
    }
    
    try {
      const url = editingUser 
        ? `${API_BASE}/admin/users/${editingUser.id}`
        : `${API_BASE}/admin/users`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const payload = { ...userForm };
      if (editingUser && !payload.password) {
        delete payload.password; // Don't send empty password on edit
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save user');
      }
      
      setSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
      setShowUserModal(false);
      loadUsers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user "${user.email}"?\n\nThis cannot be undone.`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      
      setSuccess('User deleted successfully');
      loadUsers();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleUserActive = async (user) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ is_active: !user.is_active })
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // ============================================================================
  // APPROVAL WORKFLOW
  // ============================================================================

  const handleApproval = async (approval, action, notes = '') => {
    try {
      const response = await fetch(`${API_BASE}/admin/approvals/${approval.version_id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ notes })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${action} version`);
      }
      
      setSuccess(`Version ${action}ed successfully`);
      loadPendingApprovals();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const approveVersion = (approval) => {
    if (confirm(`Approve version ${approval.version_number} of "${approval.product_name}"?`)) {
      handleApproval(approval, 'approve');
    }
  };

  const rejectVersion = (approval) => {
    const notes = prompt('Enter rejection reason (optional):');
    if (notes !== null) {
      handleApproval(approval, 'reject', notes);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getRoleBadge = (role) => {
    const colors = {
      viewer: 'bg-gray-100 text-gray-700',
      qc: 'bg-blue-100 text-blue-700',
      accountant: 'bg-green-100 text-green-700',
      owner: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-7 h-7 text-blue-600" />
              Admin Panel
            </h1>
            <p className="text-gray-500">Manage users and approvals</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'approvals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending Approvals
            {pendingApprovals.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                {pendingApprovals.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Management</h2>
            <div className="flex gap-2">
              <button
                onClick={loadUsers}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={openAddUserModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>

          {loadingUsers ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{user.full_name || user.email}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUserActive(user)}
                          className={`flex items-center gap-1 text-sm ${
                            user.is_active !== false
                              ? 'text-green-600 hover:text-green-800'
                              : 'text-red-600 hover:text-red-800'
                          }`}
                        >
                          {user.is_active !== false ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.last_login ? formatDate(user.last_login) : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEditUserModal(user)}
                          className="p-1 text-blue-600 hover:text-blue-800 mr-2"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
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
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pending Approvals</h2>
            <button
              onClick={loadPendingApprovals}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loadingApprovals ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            </div>
          ) : pendingApprovals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h3 className="font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p>No pending approvals at this time.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingApprovals.map(approval => (
                <div key={approval.version_id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {approval.product_name}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        Version {approval.version_number} • 
                        Submitted by {approval.submitted_by_name || 'Unknown'} •
                        {formatDate(approval.submitted_at)}
                      </div>
                      {approval.change_notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          "{approval.change_notes}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/formulations/${approval.formulation_id}`)}
                        className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => rejectVersion(approval)}
                        className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => approveVersion(approval)}
                        className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => handleUserFormChange('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userForm.full_name}
                  onChange={(e) => handleUserFormChange('full_name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userForm.password}
                    onChange={(e) => handleUserFormChange('password', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => handleUserFormChange('role', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {ROLES.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={userForm.is_active}
                    onChange={(e) => handleUserFormChange('is_active', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
