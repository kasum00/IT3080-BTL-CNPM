const express = require("express");
const router = express.Router();
const nhanKhauController = require("../controllers/nhanKhauController");

router.post("/nhan-khau", nhanKhauController.createNhanKhau);
router.get("/nhan-khau", nhanKhauController.getAllNhanKhau);
router.get("/nhan-khau/:id", nhanKhauController.getNhanKhauByID);
router.put("/nhan-khau/:id", nhanKhauController.updateNhanKhau);
router.delete("/nhan-khau/:id", nhanKhauController.deleteNhanKhau);

module.exports = router;
