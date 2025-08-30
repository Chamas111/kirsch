const Event = require("../models/event");

const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedEvent) {
      res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(deletedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
