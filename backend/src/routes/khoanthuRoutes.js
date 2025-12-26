const express = require("express");
const router = express.Router();
const khoanThuController = require("../controllers/khoanthuController");
router.get("/khoan-thu", khoanThuController.getAllKhoanThu);
router.post("/khoan-thu", khoanThuController.createKhoanThu);
router.get("/khoan-thu/:id", khoanThuController.getKhoanThu);
router.put("/khoan-thu/:id", khoanThuController.updateKhoanThu);
router.delete("/khoan-thu/:id", khoanThuController.deleteKhoanThu);

module.exports = router;
