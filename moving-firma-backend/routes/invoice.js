const express = require("express");
const router = express.Router();
const {
  createRechnung,
  getAllRechnung,
  getRechnungById,
  updateRechnung,
  deleteRechnung,
  lagerRechnungen,
} = require("../controllers/invoices");
const authenticate = require("../middlewares/auth");
router.use(authenticate);
router.get("/", getAllRechnung);

router.post("/", createRechnung);
router.get("/lager", lagerRechnungen);
router.get("/:id", getRechnungById);
router.put("/:id", updateRechnung);
router.delete("/:id", deleteRechnung);

module.exports = router;
