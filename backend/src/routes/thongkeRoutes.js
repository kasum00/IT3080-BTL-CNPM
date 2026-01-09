const express = require("express");
const router = express.Router();

const ThongKeController = require("../controllers/thongkeController");

// Thống kê tổng quan khoản thu
router.get("/tong-quan", ThongKeController.getThongKeKhoanThu);

// Thống kê chi tiết theo từng khoản thu
router.get("/chi-tiet", ThongKeController.getThongKeChiTiet);

// Thống kê theo hộ khẩu
router.get("/theo-ho", ThongKeController.getThongKeTheoHo);

module.exports = router;
