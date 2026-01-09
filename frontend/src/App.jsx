import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import TrajetForm from './components/TrajetForm/TrajetForm';
import Admin from './components/Admin/Admin';
import ChatWidget from './components/Chat/ChatWidget';
import { useAuth } from './hooks/useAuth'
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-card">
          <div className="spinner"></div>
          <p>Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('smartride:admin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navigation />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trajets/nouveau"
            element={
              <ProtectedRoute>
                <TrajetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trajets/modifier/:id"
            element={
              <ProtectedRoute>
                <TrajetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <ChatWidget />
    </Router>
  );
}

export default App;
