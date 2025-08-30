const express = require("express");
const router = express.Router();
const {
  getAllAuftraege,
  getAuftragById,
  updateAuftrag,
  deleteAuftrag,
  createAuftrag,
  auftragStatsYearly,
  auftragStatsMonthly,
} = require("../controllers/auftraege");
const authenticate = require("../middlewares/auth");
router.use(authenticate);
router.get("/stats/yearly", auftragStatsYearly);
router.get("/stats/monthly/:year", auftragStatsMonthly);
router.get("/", getAllAuftraege);
router.get("/:id", getAuftragById);
router.put("/:id", updateAuftrag);
router.post("/", createAuftrag);
router.delete("/:id", deleteAuftrag);

module.exports = router;
