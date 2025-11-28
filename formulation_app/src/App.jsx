import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Package, Beaker } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ingredients from './pages/Ingredients';
import Formulations from './pages/Formulations';
import FormulationDetail from './pages/FormulationDetail';
import FormulationCreate from './pages/FormulationCreate';
import FormulationEdit from './pages/FormulationEdit';

// Header component with logout and tabs
function AppHeader({ onLogout, currentPath }) {
  const navigate = useNavigate();
  
  const tabs = [
    { path: '/ingredients', label: 'Ingredients', icon: Package },
    { path: '/formulations', label: 'Formulations', icon: Beaker }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Swati Soaps</h1>
          </div>

          {/* Tabs Navigation */}
          <nav className="flex space-x-1">
            {tabs.map(({ path, label, icon: Icon }) => {
              const isActive = currentPath.startsWith(path);
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

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// Layout wrapper component
function AppLayout({ children, onLogout }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLogout={onLogout} currentPath={location.pathname} />
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/formulations" />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/formulations" element={<Formulations />} />
          <Route path="/formulations/create" element={<FormulationCreate />} />
          <Route path="/formulations/:id" element={<FormulationDetail />} />
          <Route path="/formulations/:id/edit" element={<FormulationEdit />} />
          <Route path="*" element={<Navigate to="/formulations" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
