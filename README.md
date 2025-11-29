# 🎓 Aplikasi Presensi dengan Geolocation & Visualisasi OpenStreetMap

## 📌 Project Information

- **Student ID:** 20230140115
- **Class:** PRKPAW (Praktikum Pemrograman Web) - TI-503P
- **Date:** 29 November 2025
- **Status:** ✅ Complete & Ready for Submission

---

## 📖 Quick Start

### 1. Backend Setup
```bash
cd 20230140115-node-server
npm install
npm start
# Runs on http://localhost:3001
```

### 2. Frontend Setup
```bash
cd 20230140115-react-app
npm install
npm start
# Runs on http://localhost:3000
```

### 3. Database Setup
```bash
mysql -u root -p
CREATE DATABASE prakpaw4;
USE prakpaw4;

# In node-server directory:
npx sequelize-cli db:migrate
```

---

## 🎯 Project Requirements & Implementation

### ✅ 1. Endpoint: `POST /api/presensi/check-in` dengan Bearer Token

**Implementation Location:** `20230140115-node-server/Controllers/presensiController.js`

**Features:**
- Extracts `userId` from JWT token payload: `const { id: userId } = req.user`
- Accepts `latitude` and `longitude` from request body
- Saves to database with geolocation coordinates
- Returns formatted response with timezone (Asia/Jakarta)
- Prevents duplicate check-ins on same day

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/presensi/check-in \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"latitude": -6.2088, "longitude": 106.8456}'
```

**Response:**
```json
{
  "message": "Check-in berhasil pada pukul 13:00:00 WIB",
  "data": {
    "userId": 1,
    "checkIn": "2025-11-29T13:00:00Z",
    "latitude": -6.2088,
    "longitude": 106.8456
  }
}
```

---

### ✅ 2. Tampilan Halaman Presensi dengan Maps OSM

**Implementation Location:** `20230140115-react-app/src/component/PresensiPage.js`

**URL:** `http://localhost:3000/presensi`

**Components:**
1. **Leaflet Map Display**
   - OpenStreetMap tile layer
   - Marker at user's current location
   - Zoom level: 15 (street view)
   - Popup showing location info

2. **Geolocation Integration**
   - `navigator.geolocation.getCurrentPosition()` API
   - Browser permission request
   - Real-time coordinate display
   - Error handling for denied permissions

3. **User Interface**
   - Display current coordinates (latitude, longitude)
   - Check-In button (green, ✓ icon)
   - Check-Out button (red, ✕ icon)
   - Success/Error message display
   - Loading state during API calls

**Screenshot Layout:**
```
┌────────────────────────────────────────┐
│  Sistem Presensi                       │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  🗺️  OpenStreetMap Leaflet       │ │
│  │  📍 Marker at Location            │ │
│  │  Blue Circle = Current Position  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Koordinat: -6.208835, 106.845736    │
│                                        │
│  ✓ Check-in berhasil!                │
│                                        │
│  ┌──────────────┬──────────────────┐ │
│  │ ✓ Check-In   │  ✕ Check-Out     │ │
│  └──────────────┴──────────────────┘ │
└────────────────────────────────────────┘
```

---

### ✅ 3. Check-In Berhasil

**Flow:**
1. User klik tombol "✓ Check-In"
2. Geolocation coordinates dikirim ke backend
3. Backend menyimpan record dengan userId, checkIn time, latitude, longitude
4. Success message ditampilkan: "Check-in berhasil pada pukul XX:XX:XX WIB"
5. Map tetap aktif menampilkan lokasi

**Database Record:**
```
id | userId | checkIn             | checkOut | latitude  | longitude
1  | 1      | 2025-11-29 13:00:00 | NULL     | -6.20884  | 106.84567
```

---

### ✅ 4. Check-Out Berhasil

**Flow:**
1. User klik tombol "✕ Check-Out"
2. Geolocation coordinates dikirim ke backend
3. Backend mengupdate record dengan checkOut time dan geolocation
4. Success message ditampilkan: "Check-out berhasil pada pukul XX:XX:XX WIB"
5. Record tersimpan dengan check-in dan check-out time

**Database Record:**
```
id | userId | checkIn             | checkOut            | latitude  | longitude
1  | 1      | 2025-11-29 13:00:00 | 2025-11-29 17:00:00 | -6.20884  | 106.84567
```

---

### ✅ 5. Tampilan Halaman Report dengan Data Semua User

**Implementation Location:** `20230140115-react-app/src/component/Reportpage.js`

**URL:** `http://localhost:3000/reports` (Admin only)

**Features:**
- Admin-only access (role validation)
- Display all users' presensi data in table format
- Filter by nama (search/like)
- Filter by date range (startDate - endDate)
- Clickable location links to OpenStreetMap
- User info from relational join (User.nama, User.email)
- Timezone formatting (Asia/Jakarta)

**Table Columns:**
| No | Nama | Email | Check-In | Check-Out | Lokasi |
|:--:|:----:|:-----:|:--------:|:---------:|:------:|
| 1  | User1| email1| 13:00:00 | 17:00:00  | 📍 Link|
| 2  | User2| email2| 13:15:00 | -         | 📍 Link|

**API Endpoint:**
```
GET /api/reports/daily?nama=&startDate=2025-11-29&endDate=2025-11-29
Authorization: Bearer {admin_token}
```

---

### ✅ 6. Screenshot Tabel Presensi di Database

**Database Name:** `prakpaw4`

**SQL Query untuk Screenshot:**
```sql
-- View Presensi Table Schema
DESCRIBE Presensis;

-- View Sample Data
SELECT id, userId, checkIn, checkOut, latitude, longitude 
FROM Presensis;

-- View dengan User Join
SELECT 
  p.id,
  u.nama,
  u.email,
  p.checkIn,
  p.checkOut,
  p.latitude,
  p.longitude
FROM Presensis p
INNER JOIN Users u ON p.userId = u.id;
```

**Expected Output Structure:**
```
+----+--------+---------------------+---------------------+-----------+------------+
| id | userId | checkIn             | checkOut            | latitude  | longitude  |
+----+--------+---------------------+---------------------+-----------+------------+
| 1  | 1      | 2025-11-29 13:00:00 | 2025-11-29 17:00:00 | -6.208835 | 106.845736 |
| 2  | 2      | 2025-11-29 13:15:00 | NULL                | -6.208901 | 106.845702 |
| 3  | 1      | 2025-11-29 14:00:00 | 2025-11-29 15:30:00 | -6.208850 | 106.845681 |
+----+--------+---------------------+---------------------+-----------+------------+
```

**Documentation:** See `DATABASE_SCREENSHOTS.md` for detailed SQL queries

---

## 📂 Project Structure

```
PRKPAW-20230140115-main/
│
├── 20230140115-node-server/
│   ├── Controllers/
│   │   ├── authController.js              ✅ JWT auth logic
│   │   ├── presensiController.js          ✅ CheckIn/CheckOut with geolocation
│   │   └── reportController.js            ✅ Reports with User join
│   │
│   ├── models/
│   │   ├── user.js                        ✅ hasMany Presensi
│   │   ├── presensi.js                    ✅ belongsTo User, lat/lng
│   │   └── index.js
│   │
│   ├── migrations/
│   │   ├── 20251101000000-create-user.js
│   │   └── 20251102000000-create-presensi.js  ✅ with latitude/longitude
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── presensi.js                    ✅ /check-in, /check-out endpoints
│   │   ├── reports.js                     ✅ /daily reports endpoint
│   │   └── books.js
│   │
│   ├── middleware/
│   │   ├── permissionMiddleware.js        ✅ JWT auth, admin check
│   │   └── ...
│   │
│   ├── config/
│   │   └── config.json
│   │
│   ├── server.js                           ✅ Main Express server
│   └── package.json
│
├── 20230140115-react-app/
│   ├── src/
│   │   ├── component/
│   │   │   ├── LoginPage.js               ✅ JWT login
│   │   │   ├── RegisterPage.js            ✅ Role selector + auto-login
│   │   │   ├── DashboardPage.js           ✅ Main dashboard
│   │   │   ├── PresensiPage.js            ✅ Leaflet map + geolocation
│   │   │   ├── Reportpage.js              ✅ Admin reports
│   │   │   ├── Navbar.js                  ✅ Conditional navigation
│   │   │   └── ProtectedRoute.js          ✅ Route protection
│   │   │
│   │   ├── App.js                         ✅ Router setup
│   │   ├── index.js                       ✅ Entry point
│   │   ├── index.css
│   │   └── ...
│   │
│   └── package.json
│
├── Documentation/
│   ├── FINAL_SUBMISSION.md                📋 This file
│   ├── IMPLEMENTATION_GUIDE.md            📖 Detailed implementation
│   ├── REQUIREMENT_VERIFICATION.md        ✅ Verification checklist
│   ├── DATABASE_SCREENSHOTS.md            📸 SQL queries for screenshots
│   ├── TEST_CREDENTIALS.md                🧪 Testing guide
│   └── SUBMISSION_READY.md                📦 Submission status
│
└── README.md
```

---

## 🔐 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (hashed with bcryptjs),
  role ENUM('mahasiswa', 'admin') DEFAULT 'mahasiswa',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### Presensi Table
```sql
CREATE TABLE Presensis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,                    -- Foreign Key to Users
  checkIn DATETIME,                       -- Nullable (for out-only updates)
  checkOut DATETIME,                      -- Nullable (for in-only updates)
  latitude DECIMAL(10, 8),                -- Geolocation latitude
  longitude DECIMAL(11, 8),               -- Geolocation longitude
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  
  FOREIGN KEY (userId) REFERENCES Users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);
```

---

## 🔌 API Routes

### Authentication Routes
```
POST   /api/auth/register      ← Register user
POST   /api/auth/login         ← Login user (returns JWT)
```

### Presensi Routes (Protected with Bearer Token)
```
POST   /api/presensi/check-in  ← Check-in with geolocation
POST   /api/presensi/check-out ← Check-out with geolocation
PUT    /api/presensi/:id       ← Update presensi
DELETE /api/presensi/:id       ← Delete presensi
```

### Reports Routes (Admin Only)
```
GET    /api/reports/daily      ← Get all presensi data with filters
```

---

## 🧪 Testing Flow

### Step 1: Register User (Mahasiswa)
```
URL: http://localhost:3000/register
Nama: Budi Santoso
Email: budi@example.com
Password: password123
Role: Mahasiswa
→ Auto-login to Dashboard
```

### Step 2: Go to Presensi Page
```
URL: http://localhost:3000/presensi
→ Browser requests geolocation permission
→ Allow permission
→ Map displays with current location marker
```

### Step 3: Check-In
```
Click "✓ Check-In" button
→ POST /api/presensi/check-in with geolocation
→ Message: "Check-in berhasil pada pukul 13:00:00 WIB"
→ Database record created with latitude/longitude
```

### Step 4: Check-Out
```
Click "✕ Check-Out" button
→ POST /api/presensi/check-out with geolocation
→ Message: "Check-out berhasil pada pukul 17:00:00 WIB"
→ Database record updated with check-out time & geolocation
```

### Step 5: Register Admin
```
URL: http://localhost:3000/register
Nama: Administrator
Email: admin@example.com
Password: admin123
Role: Admin
→ Auto-login to Dashboard
→ Navbar shows "Laporan Admin" link
```

### Step 6: View Reports (Admin)
```
Click "Laporan Admin" in navbar
→ Table shows all users' presensi data
→ Filter by nama or date range
→ Click location link → Opens in OpenStreetMap
```

---

## ✨ Key Features

✅ **JWT Authentication**
- Secure token-based auth
- Role-based access control (mahasiswa/admin)
- Auto-login after registration
- Password hashing with bcryptjs

✅ **Geolocation Integration**
- Browser geolocation API
- Real-time location tracking
- Coordinate capture (latitude, longitude)
- Precision: 8 decimal places

✅ **Leaflet/OpenStreetMap**
- Interactive map visualization
- Marker at current location
- Zoom level control
- Clickable links to full OSM view

✅ **Database Relations**
- User ↔ Presensi one-to-many relationship
- Foreign key constraints
- CASCADE delete/update
- Timezone-aware timestamps

✅ **Admin Features**
- Comprehensive reporting
- User data filtering
- Date range filtering
- Location visualization

---

## 📦 Dependencies

**Backend:**
- express.js (framework)
- sequelize (ORM)
- mysql2 (database driver)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- date-fns-tz (timezone handling)
- cors (cross-origin)
- morgan (logging)

**Frontend:**
- react (UI framework)
- react-router (routing)
- axios (HTTP client)
- leaflet (maps)
- react-leaflet (React wrapper)
- tailwind (styling)
- jwt-decode (token parsing)

---

## 🎉 Submission Checklist

- [x] Backend server (Node.js + Express)
- [x] Frontend application (React)
- [x] Database (MySQL with Sequelize)
- [x] JWT authentication
- [x] Presensi check-in endpoint with geolocation
- [x] Presensi check-out endpoint with geolocation
- [x] PresensiPage with Leaflet OSM map
- [x] Check-in success message & functionality
- [x] Check-out success message & functionality
- [x] ReportPage with all users' data
- [x] Admin-only access control
- [x] Database relational design
- [x] Geolocation storage (latitude/longitude)
- [x] User-Presensi relationship
- [x] Protected routes
- [x] Comprehensive documentation
- [x] Testing guide
- [x] SQL query documentation

---

## 📝 Notes

- **Database:** MySQL prakpaw4
- **Backend Port:** 3001
- **Frontend Port:** 3000
- **Timezone:** Asia/Jakarta (UTC+7)
- **JWT Secret:** INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN
- **Token Expiry:** 1 hour

---

## 🏆 Status

**✅ PROJECT COMPLETE & READY FOR SUBMISSION**

All requirements have been implemented, tested, and documented.

---

**Created by:** Student ID 20230140115  
**Date:** 29 November 2025  
**Class:** PRKPAW - TI503P

