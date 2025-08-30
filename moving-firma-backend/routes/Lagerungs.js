const express = require("express");
const router = express.Router();
const {
  createLager,
  getAllLagerung,
  getLagerungById,
  updateLagerung,
  deleteLagerung,
} = require("../controllers/Lagerungen");
const authenticate = require("../middlewares/auth");
router.use(authenticate);
router.get("/", getAllLagerung);

router.post("/", createLager);
router.get("/:id", getLagerungById);
router.put("/:id", updateLagerung);
router.delete("/:id", deleteLagerung);
module.exports = router;
