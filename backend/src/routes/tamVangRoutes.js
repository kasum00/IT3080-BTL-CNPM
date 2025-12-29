const express = require("express");
const router = express.Router();
const tamVangController = require("../controllers/tamVangController");

router.post("/tam-vang", tamVangController.createTamVang);
router.get("/tam-vang", tamVangController.getAllTamVang);
router.get("/tam-vang/:id", tamVangController.getTamVangByID);
router.put("/tam-vang/:id", tamVangController.updateTamVang);
router.delete("/tam-vang/:id", tamVangController.deleteTamVang);

module.exports = router;
