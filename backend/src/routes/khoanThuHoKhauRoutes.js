const express = require("express");
const router = express.Router();
const khoanThuHoKhauController = require("../controllers/khoanThuHoKhauController");

// gán khoản thu cho hộ khẩu
router.post(
  "/khoan-thu-ho-khau/assign",
  khoanThuHoKhauController.assignKhoanThuToHoKhau
);

// get dsach khoản thu của hộ khẩu
router.get(
  "/khoan-thu-ho-khau/ho-khau/:id_ho_khau",
  khoanThuHoKhauController.getKhoanThuByHoKhau
);

module.exports = router;
