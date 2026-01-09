const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const khoanThuController = require("../controllers/khoanthuController");

=======

const khoanThuController = require("../controllers/khoanthuController");
router.get("/khoan-thu", khoanThuController.getAllKhoanThu);
>>>>>>> main
router.post("/khoan-thu", khoanThuController.createKhoanThu);
router.get("/khoan-thu/:id", khoanThuController.getKhoanThu);
router.put("/khoan-thu/:id", khoanThuController.updateKhoanThu);
router.delete("/khoan-thu/:id", khoanThuController.deleteKhoanThu);
<<<<<<< HEAD

module.exports = router;
=======
 
module.exports = router;
>>>>>>> main
