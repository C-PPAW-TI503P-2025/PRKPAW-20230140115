const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3001;

// Impor rute
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');
const presensiRoutes = require('./routes/presensi');
const reportRoutes = require('./routes/reports');

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rute
app.get('/', (req, res) => {
  res.send('Home Page for API');
});

// Menggunakan semua rute
app.use('/api/auth', authRoutes);
app.use('/api/presensi', presensiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/books', bookRoutes);

// Static folder untuk uploads
app.use('/uploads', express.static('uploads'));

// Error Handling untuk 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});

