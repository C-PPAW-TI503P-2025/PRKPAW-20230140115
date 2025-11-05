const express = require('express');
const router = express.Router();
const presensiController = require('../Controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');

router.use(addUserData);

router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
const { body } = require("express-validator");
router.put(
  "/:id",
  [
    body("checkIn")
      .optional()
      .isISO8601()
      .withMessage("Format tanggal checkIn tidak valid. Gunakan format YYYY-MM-DD atau ISO."),
    body("checkOut")
      .optional()
      .isISO8601()
      .withMessage("Format tanggal checkOut tidak valid. Gunakan format YYYY-MM-DD atau ISO."),
  ],
  presensiController.updatePresensi
);
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;


