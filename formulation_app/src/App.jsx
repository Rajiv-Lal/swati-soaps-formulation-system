/**
 * Main Application Component v2.5
 * 
 * FIXES:
 * - Swati Soaps logo links to /dashboard (not /formulations)
 * - Admin link visible only for owner/admin roles
 * - User name displays correctly
 * - Dashboard as default route
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Package, Beaker, Loader2, Shield, LayoutDashboard, FlaskConical } from 'lucide-react';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import Ingredients from './pages/Ingredients';
import Formulations from './pages/Formulations';
import FormulationDetail from './pages/FormulationDetail';
import FormulationEditor from './pages/FormulationEditor';
import Sandbox from './pages/Sandbox';

// =============================================================================
// APP HEADER COMPONENT
// =============================================================================

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Get user role from context or localStorage
  const userRole = user?.role || 'viewer';
  const userName = user?.name || user?.email || '';
  
  // Check if user can access admin
  const canAccessAdmin = ['owner', 'admin'].includes(userRole);
  
  // Navigation tabs - dynamically include Admin for authorized users
  const tabs = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ingredients', label: 'Ingredients', icon: Package },
    { path: '/formulations', label: 'Formulations', icon: Beaker },
    { path: '/sandbox', label: 'Sandbox', icon: FlaskConical },
  ];
  
  // Add Admin tab for owner/admin
  if (canAccessAdmin) {
    tabs.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  const handleLogout = () => {
    logout('User logged out');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name - Links to Dashboard */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <h1 className="text-xl font-bold text-blue-600">Swati Soaps</h1>
          </div>

          {/* Tabs Navigation */}
          <nav className="flex space-x-1">
            {tabs.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path || 
                (path !== '/dashboard' && location.pathname.startsWith(path));
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info + Logout Button */}
          <div className="flex items-center gap-4">
            {userName && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600">{userName}</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  userRole === 'admin' ? 'bg-red-100 text-red-700' :
                  userRole === 'owner' ? 'bg-purple-100 text-purple-700' :
                  userRole === 'qc' ? 'bg-blue-100 text-blue-700' :
                  userRole === 'accountant' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {userRole}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// =============================================================================
// APP LAYOUT COMPONENT
// =============================================================================

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main>
        {children}
      </main>
    </div>
  );
}

// =============================================================================
// LOADING SCREEN
// =============================================================================

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// =============================================================================
// PROTECTED ROUTES WRAPPER
// =============================================================================

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render routes with layout
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/formulations" element={<Formulations />} />
        <Route path="/formulations/create" element={<FormulationEditor />} />
        <Route path="/formulations/:id" element={<FormulationDetail />} />
        <Route path="/formulations/:id/edit" element={<FormulationEditor />} />
        <Route path="/sandbox" element={<Sandbox />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

// =============================================================================
// APP ROUTES (handles login vs protected)
// =============================================================================

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Login route */}
      <Route 
        path="/login" 
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" replace />
            : <Login />
        } 
      />
      {/* All other routes are protected */}
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
