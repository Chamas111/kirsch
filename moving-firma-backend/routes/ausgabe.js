const express = require("express");
const router = express.Router();
const {
  createAusgabe,
  getAllAusgaben,
  getAusgabeById,
  updateAusgabe,
  deleteAusgabe,
} = require("../controllers/ausgaben");
const authenticate = require("../middlewares/auth");
router.use(authenticate);
router.get("/", getAllAusgaben);

router.post("/", createAusgabe);
router.get("/:id", getAusgabeById);
router.put("/:id", updateAusgabe);
router.delete("/:id", deleteAusgabe);
module.exports = router;
