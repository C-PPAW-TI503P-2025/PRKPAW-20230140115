 	// 1. Ganti sumber data dari array ke model Sequelize
 	const { Presensi } = require("../models");
 	const { format } = require("date-fns-tz");
 	const timeZone = "Asia/Jakarta";
	const { validationResult } = require("express-validator");
 	
exports.CheckIn = async (req, res) => {
  // 2. Gunakan try...catch untuk error handling
  try {
    const { id: userId } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

    // 3. Ubah cara mencari data menggunakan 'findOne' dari Sequelize
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // 4. Ubah cara membuat data baru menggunakan 'create' dari Sequelize
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude || null,
      longitude: longitude || null,
    });
    
    const formattedData = {
        userId: newRecord.userId,
        checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: null,
        latitude: newRecord.latitude,
        longitude: newRecord.longitude
    };

    res.status(201).json({
      message: `Check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
}; 

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    if (latitude) recordToUpdate.latitude = latitude;
    if (longitude) recordToUpdate.longitude = longitude;
    await recordToUpdate.save();

    const formattedData = {
        userId: recordToUpdate.userId,
        checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        latitude: recordToUpdate.latitude,
        longitude: recordToUpdate.longitude
    };

    res.json({
      message: `Check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
	
	exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


exports.updatePresensi = async (req, res) => {
  try {
    // Periksa validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Input tidak valid",
        errors: errors.array(),
      });
    }

    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};