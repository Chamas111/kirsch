const express = require("express");
const router = express.Router();
const {
  getMonatsStatistik,
  getJahresStatistik,
} = require("../controllers/statistics");
const authenticate = require("../middlewares/auth");
router.use(authenticate);
router.get("/monatsstatistik", getMonatsStatistik);
router.get("/jahresstatistik", getJahresStatistik);
module.exports = router;
