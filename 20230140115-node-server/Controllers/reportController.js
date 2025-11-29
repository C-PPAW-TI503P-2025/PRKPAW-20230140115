const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, startDate, endDate } = req.query;
    
    let options = {
      include: [
        {
          model: User,
          attributes: ["id", "nama", "email"],
          where: {}
        }
      ],
      where: {}
    };

    if (nama) {
      options.include[0].where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    if (startDate && endDate) {
      options.where.checkIn = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString("id-ID"),
      count: records.length,
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
