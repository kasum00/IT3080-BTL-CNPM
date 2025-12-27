const express = require("express");
const router = express.Router();

const HoKhauController = require("../controllers/hokhauController");

router.post("/", HoKhauController.createHoKhau);
router.post("/gan-chu-ho", HoKhauController.ganChuHo);
router.get("/", HoKhauController.getAllHoKhau);
router.get("/:id", HoKhauController.getHoKhauByID);
router.put("/:id", HoKhauController.updateHoKhau);
router.delete("/:id", HoKhauController.deleteHoKhau);

module.exports = router;
