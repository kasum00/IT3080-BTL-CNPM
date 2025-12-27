const express = require("express");
const router = express.Router();

const CanHoController = require("../controllers/canhoController");

router.post("/", CanHoController.createCanHo);
router.get("/", CanHoController.getAllCanHo);
router.get("/:id", CanHoController.getCanHoByID);
router.put("/:id", CanHoController.updateCanHo);

// nên ở hộ khẩu hay ở căn hộ ?
// tìm hộ khẩu theo căn hộ
router.get("/tim-ho-khau/:id", CanHoController.findHouseholdInAparment);
// tìm chủ theo căn hộ
router.get("/tim-chu-ho/:id", CanHoController.findOwnerByApartment);

module.exports = router;
