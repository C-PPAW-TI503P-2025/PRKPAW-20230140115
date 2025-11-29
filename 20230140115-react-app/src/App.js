import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import RegisterPage from './component/RegisterPage';
import DashboardPage from './component/DashboardPage';
import PresensiPage from './component/PresensiPage';
import Reportpage from './component/Reportpage';
import Navbar from './component/Navbar';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div>
        {/* Navbar hanya tampil jika sudah login */}
        {isAuthenticated && <Navbar />}
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/presensi" 
            element={
              <ProtectedRoute>
                <PresensiPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Reportpage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
