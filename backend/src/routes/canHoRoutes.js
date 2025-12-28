const express = require('express')
const router = express.Router()

const CanHoController = require('../controllers/canhoController')

// tìm hộ khẩu theo căn hộ
router.get("/tim-ho-khau/:id", CanHoController.findHouseholdInAparment);
// tìm chủ theo căn hộ
router.get("/tim-chu-ho/:id", CanHoController.findOwnerByApartment);

router.post("/chuyen-can-ho", CanHoController.assignHoKhauForCanHo)

router.post("/", CanHoController.createCanHo)
router.get("/", CanHoController.getAllCanHo)
router.get("/:id", CanHoController.getCanHoByID)
router.put("/:id", CanHoController.updateCanHo)


module.exports = router;