import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Webcam from 'react-webcam';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError('Gagal mendapatkan lokasi: ' + error.message);
        }
      );
    } else {
      setError('Geolocation tidak didukung oleh browser ini.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleCheckIn = async () => {
    if (!coords) {
      setError('Lokasi belum didapatkan. Mohon izinkan akses lokasi.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);
    
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // always send multipart/form-data so server multer can parse optional image
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      if (image) {
        // convert base64 dataURL to blob
        const blob = await (await fetch(image)).blob();
        formData.append('image', blob, 'selfie.jpg');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTE: do NOT set Content-Type here; browser will set the correct multipart boundary
        },
      };

      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-in',
        formData,
        config
      );

      setMessage(response.data.message || 'Check-in berhasil!');
      // clear image after successful upload
      setImage(null);
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Check-in gagal'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!coords) {
      setError('Lokasi belum didapatkan. Mohon izinkan akses lokasi.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);
    
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      if (image) {
        const blob = await (await fetch(image)).blob();
        formData.append('image', blob, 'selfie.jpg');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-out',
        formData,
        config
      );

      setImage(null);

      setMessage(response.data.message || 'Check-out berhasil!');
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Check-out gagal'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Sistem Presensi
        </h1>

        {/* Peta */}
        {coords && (
          <div className="mb-8 border-4 border-blue-500 rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>
                  Lokasi Presensi Anda
                  <br />
                  Lat: {coords.lat.toFixed(6)}
                  <br />
                  Lng: {coords.lng.toFixed(6)}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Koordinat Display */}
        {coords && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-gray-800 font-semibold">
              📍 Lokasi Anda: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </p>
          </div>
        )}

        {/* Kamera / Selfie */}
        <div className="my-4 border rounded-lg overflow-hidden bg-black max-w-xl mx-auto">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>

        <div className="mb-4 max-w-xl mx-auto">
          {!image ? (
            <button onClick={capture} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
              Ambil Foto 📸
            </button>
          ) : (
            <button onClick={() => setImage(null)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
              Foto Ulang 🔄
            </button>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
            <p className="text-green-800 font-semibold">✓ {message}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded">
            <p className="text-red-800 font-semibold">✕ {error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCheckIn}
            disabled={loading || !coords}
            className={`px-8 py-4 text-white font-bold rounded-lg shadow-lg text-lg transition ${
              loading || !coords
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? '⏳ Memproses...' : '✓ Check-In'}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading || !coords}
            className={`px-8 py-4 text-white font-bold rounded-lg shadow-lg text-lg transition ${
              loading || !coords
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? '⏳ Memproses...' : '✕ Check-Out'}
          </button>
        </div>

        {!coords && (
          <div className="mt-6 text-center">
            <button
              onClick={getLocation}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              🔄 Muat Ulang Lokasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PresensiPage;
