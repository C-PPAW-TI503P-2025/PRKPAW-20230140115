import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error('Token tidak valid');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-600 mb-2">
          ✓ Login Sukses!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Selamat Datang, <span className="font-semibold text-indigo-600">{user?.nama}</span>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Role: <span className="font-medium capitalize">{user?.role}</span>
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/presensi')}
            className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            📍 Presensi
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/reports')}
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              📊 Laporan Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2 px-6 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
