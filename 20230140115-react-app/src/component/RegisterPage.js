import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: name,
        email,
        password,
      });
      alert('Registrasi berhasil!');
      navigate('/login');
    } catch (err) {
      alert(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-600 flex flex-col items-center justify-center text-white">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Register</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nama:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded focus:ring focus:ring-indigo-300"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
