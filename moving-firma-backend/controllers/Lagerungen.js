const Lager = require("../models/lagerung");

const parseGermanDate = (dateStr) => {
  const [day, month, year] = dateStr.split(".");
  return new Date(`${year}-${month}-${day}`);
};

const createLager = async (req, res) => {
  try {
    console.log("📥 Received Lager data:", req.body);

    const lager = await Lager.create(req.body);

    res.status(201).json(lager);
  } catch (err) {
    console.error("❌ Error creating Lager:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllLagerung = async (req, res) => {
  try {
    const lager = await Lager.find();
    res.json(lager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLagerungById = async (req, res) => {
  try {
    const lager = await Lager.findById(req.params.id);

    if (!lager) return res.status(404).json({ message: "Event not found" });
    res.json(lager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLagerung = async (req, res) => {
  try {
    const updateLagerung = await Lager.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updateLagerung) {
      return res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(updateLagerung);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLagerung = async (req, res) => {
  try {
    const deleteLagerung = await Lager.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteLagerung) {
      res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(deleteLagerung);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createLager,
  getAllLagerung,
  getLagerungById,
  updateLagerung,
  deleteLagerung,
};
