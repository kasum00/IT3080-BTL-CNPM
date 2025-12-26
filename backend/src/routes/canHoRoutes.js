const express = require('express')
const router = express.Router()

const CanHoController = require('../controllers/canhoController')

router.post("/", CanHoController.createCanHo)
router.get("/", CanHoController.getAllCanHo)
router.get("/:id", CanHoController.getCanHoByID)
router.put("/:id", CanHoController.updateCanHo)

module.exports = router;