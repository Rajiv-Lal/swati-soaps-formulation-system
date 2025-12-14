/**
 * Main Application Component
 * 
 * Sets up:
 * - Authentication context
 * - Toast notifications
 * - Error boundary
 * - Routing
 * - Protected routes
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Package, Beaker, Loader2 } from 'lucide-react';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import Login from './pages/Login';
import Ingredients from './pages/Ingredients';
import Formulations from './pages/Formulations';
import FormulationDetail from './pages/FormulationDetail';
import FormulationEditor from './components/FormulationEditor';

// =============================================================================
// APP HEADER COMPONENT
// =============================================================================

function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const tabs = [
    { path: '/ingredients', label: 'Ingredients', icon: Package },
    { path: '/formulations', label: 'Formulations', icon: Beaker }
  ];

  const handleLogout = () => {
    logout('User logged out');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/formulations')}
          >
            <h1 className="text-xl font-bold text-blue-600">Swati Soaps</h1>
          </div>

          {/* Tabs Navigation */}
          <nav className="flex space-x-1">
            {tabs.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path);
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
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User Info + Logout Button */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.name || user.email}
              </span>
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
  const { isAuthenticated, isLoading, authError } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location, error: authError }} replace />;
  }

  // Authenticated - render the app
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/formulations" replace />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/formulations" element={<Formulations />} />
        <Route path="/formulations/create" element={<FormulationEditor />} />
        <Route path="/formulations/:id" element={<FormulationDetail />} />
        <Route path="/formulations/:id/edit" element={<FormulationEditor />} />
        <Route path="*" element={<Navigate to="/formulations" replace />} />
      </Routes>
    </AppLayout>
  );
}

// =============================================================================
// APP ROUTES
// =============================================================================

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Login route - accessible when not authenticated */}
      <Route 
        path="/login" 
        element={
          isAuthenticated 
            ? <Navigate to="/formulations" replace /> 
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
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
