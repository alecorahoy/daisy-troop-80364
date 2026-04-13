import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import LeaderDashboard from './components/LeaderDashboard/Dashboard';
import ParentView from './components/ParentView/Dashboard';
import './index.css';

function ProtectedRoute({ children, requiredRole }) {
  const { user, userRole, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/leader/*"
            element={
              <ProtectedRoute requiredRole="leader">
                <LeaderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/*"
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentView />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/parent" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;