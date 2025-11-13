import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30 animate-fadeIn">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
          Selamat Datang 👋
        </h2>
        <p className="text-center text-white/80 mb-8 text-sm">
          Silakan login untuk melanjutkan ke dashboard Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/30 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-200 text-sm mt-4 text-center font-medium animate-pulse">
            {error}
          </p>
        )}

        <p className="text-center text-white/80 mt-6 text-sm">
          Belum punya akun?{' '}
          <Link to="/register" className="text-yellow-300 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
