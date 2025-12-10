// File ini untuk testing API endpoints
// Jalankan di browser console atau gunakan tool seperti Postman

// 1. Test Register
const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'mahasiswa'
      })
    });
    const data = await response.json();
    console.log('Register Response:', data);
    return data;
  } catch (error) {
    console.error('Register Error:', error);
  }
};

// 2. Test Login
const loginUser = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log('Login Response:', data);
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Login Error:', error);
  }
};

// 3. Test Check-In
const testCheckIn = async (token) => {
  try {
    const formData = new FormData();
    formData.append('latitude', '-6.2088');
    formData.append('longitude', '106.8456');
    
    const response = await fetch('http://localhost:3001/api/presensi/check-in', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    console.log('Check-In Response:', data);
    return data;
  } catch (error) {
    console.error('Check-In Error:', error);
  }
};

// 4. Test Check-Out
const testCheckOut = async (token) => {
  try {
    const formData = new FormData();
    formData.append('latitude', '-6.2088');
    formData.append('longitude', '106.8456');
    
    const response = await fetch('http://localhost:3001/api/presensi/check-out', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    console.log('Check-Out Response:', data);
    return data;
  } catch (error) {
    console.error('Check-Out Error:', error);
  }
};

// 5. Test Get Reports (Admin Only)
const testGetReports = async (token) => {
  try {
    const response = await fetch('http://localhost:3001/api/reports/daily', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('Reports Response:', data);
    return data;
  } catch (error) {
    console.error('Reports Error:', error);
  }
};

// Usage:
// await registerUser();
// const token = await loginUser();
// await testCheckIn(token);
// await testCheckOut(token);
// await testGetReports(token);
