const express = require("express")
const router = express.Router()
const ptCtrl = require("../controllers/phuongtienController")

router.get("/", ptCtrl.getAllPhuongTien)
router.get("/:id", ptCtrl.getPhuongTienByID)
router.post("/", ptCtrl.createPhuongTien)
router.delete("/:id", ptCtrl.deletePhuongTien)

module.exports = router
