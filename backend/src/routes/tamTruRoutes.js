const express = require("express");
const router = express.Router();
const tamTruController = require("../controllers/tamTruController");

router.post("/tam-tru", tamTruController.createTamTru);
router.get("/tam-tru", tamTruController.getAllTamTru);
router.get("/tam-tru/:id", tamTruController.getTamTruByID);
router.put("/tam-tru/:id", tamTruController.updateTamTru);
router.delete("/tam-tru/:id", tamTruController.deleteTamTru);

module.exports = router;
