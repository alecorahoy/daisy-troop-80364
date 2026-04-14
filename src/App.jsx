import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import LeaderDashboard from './components/LeaderDashboard/Dashboard';
import ParentView from './components/ParentView/Dashboard';
import { Flower2 } from 'lucide-react';
import './index.css';

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <Flower2 className="w-16 h-16 text-blue-700 animate-pulse" fill="currentColor" />
      <p className="mt-4 text-blue-800 font-medium">Loading...</p>
    </div>
  );
}

function ProtectedRoute({ children, requiredRole }) {
  const { user, userRole, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function RootRedirect() {
  const { user, userRole, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={userRole === 'leader' ? '/leader' : '/parent'} replace />;
}

function LoginRoute() {
  const { user, userRole, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={userRole === 'leader' ? '/leader' : '/parent'} replace />;
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
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
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
