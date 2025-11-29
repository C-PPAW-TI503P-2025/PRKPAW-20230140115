import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReports = async (query = '') => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    setError('');
    setLoading(true);

    try {
      const response = await axios.get(
        'http://localhost:3001/api/reports/daily',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            nama: searchTerm || query,
            startDate,
            endDate,
          },
        }
      );

      setReports(response.data.data || []);
    } catch (err) {
      setError('Gagal mengambil laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          📊 Laporan Presensi
        </h1>

        {/* Filter Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                🔍 Cari
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStartDate('');
                  setEndDate('');
                  fetchReports();
                }}
                className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                ↺ Reset
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
            <p className="text-red-800 font-semibold">✕ {error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-600 font-semibold">
            ⏳ Memuat data...
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">No</th>
                  <th className="px-6 py-3 text-left font-semibold">Nama</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Check-In</th>
                  <th className="px-6 py-3 text-left font-semibold">Check-Out</th>
                  <th className="px-6 py-3 text-left font-semibold">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">{index + 1}</td>
                      <td className="px-6 py-3 text-sm font-medium">
                        {item.User?.nama || 'N/A'}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {item.User?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {new Date(item.checkIn).toLocaleString('id-ID', {
                          timeZone: 'Asia/Jakarta',
                        })}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {item.checkOut
                          ? new Date(item.checkOut).toLocaleString('id-ID', {
                              timeZone: 'Asia/Jakarta',
                            })
                          : '⏱️ Belum Check-Out'}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {item.latitude && item.longitude ? (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${item.latitude}&mlon=${item.longitude}&zoom=18`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                          </a>
                        ) : (
                          'Tidak ada'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data presensi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Row Count */}
        {!loading && reports.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Total: <span className="font-semibold">{reports.length}</span> data
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
