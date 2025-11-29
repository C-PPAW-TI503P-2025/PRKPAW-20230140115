import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (error) {
      console.error("Token tidak valid");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="font-bold text-xl">Aplikasi Presensi</div>

      <div className="flex space-x-6 items-center">
        <Link to="/presensi">Presensi</Link>

        {/* Hanya tampil jika admin */}
        {user?.role === "admin" && (
          <Link to="/reports">Laporan Admin</Link>
        )}

        {/* Nama user dari token */}
        <span className="font-semibold">{user?.nama}</span>

        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
