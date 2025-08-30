const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const authenticate = require("../middlewares/auth");
router.use(authenticate);
router.get("/", getAllEvents);

router.post("/", createEvent);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
module.exports = router;
