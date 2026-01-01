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
  "/khoan-thu-ho-khau/:id",
  khoanThuHoKhauController.getKhoanThuByHoKhau
);

// cập nhật trạng thái thanh toán
router.put(
  "/khoan-thu-ho-khau/:maHoKhau/:maKhoanThu",
  khoanThuHoKhauController.updateTrangThaiKhoanThu
);

module.exports = router;
