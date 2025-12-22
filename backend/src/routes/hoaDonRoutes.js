const express = require("express");
const router = express.Router();
const hoaDonController = require("../controllers/hoaDonController");

router.post("/hoa-don", hoaDonController.createHoaDon);
router.put("/hoa-don/:id/thanh-toan", hoaDonController.thanhToanHoaDon);
router.put("/hoa-don/:id", hoaDonController.updateHoaDon);
router.delete("/hoa-don/:id", hoaDonController.deleteHoaDon);
router.get("/hoa-don/:id", hoaDonController.getHoaDon);

module.exports = router;
