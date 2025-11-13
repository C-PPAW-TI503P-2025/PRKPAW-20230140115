import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import RegisterPage from './component/RegisterPage';
import DashboardPage from './component/DashboardPage';

function App() {
  return (
    <Router>
      <div>
        {/* Navigasi ini bisa dihapus jika tidak diperlukan */}
        <nav className="p-4 bg-gray-100">
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;
