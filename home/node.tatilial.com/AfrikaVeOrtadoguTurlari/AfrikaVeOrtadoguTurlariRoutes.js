const express = require("express");
const router = express.Router();
const {
  getAllTurlar,
  getTuruById,
  createTuru,
  updateTuru,
  deleteTuru,
} = require("../../controllers/AfrikaVeOrtadoguTurlari/AfrikaVeOrtadoguTurlariController.js");

router.get("/", getAllTurlar);
router.get("/:id", getTuruById);
router.post("/", createTuru);
router.put("/:id", updateTuru);
router.delete("/:id", deleteTuru);

module.exports = router;
