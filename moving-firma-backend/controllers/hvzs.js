const Hvz = require("../models/hvz");

const parseGermanDate = (dateStr) => {
  const [day, month, year] = dateStr.split(".");
  return new Date(`${year}-${month}-${day}`);
};

const formatGermanDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

const createHvz = async (req, res) => {
  try {
    let hvzData = { ...req.body };
    if (hvzData.datum) {
      hvzData.datum = formatGermanDate(hvzData.datum);
    }
    const hvz = await Hvz.create(hvzData);
    res.status(201).json(hvz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllHvz = async (req, res) => {
  try {
    const hvz = await Hvz.find();
    res.json(hvz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHvzById = async (req, res) => {
  try {
    const hvz = await Hvz.findById(req.params.id);

    if (!hvz) return res.status(404).json({ message: "Event not found" });
    res.json(hvz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHvz = async (req, res) => {
  try {
    const updatedHvz = await Hvz.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedHvz) {
      return res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(updatedHvz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHvz = async (req, res) => {
  try {
    const deletedHvz = await Hvz.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedHvz) {
      res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(deletedHvz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllHvz,
  createHvz,
  getHvzById,
  updateHvz,
  deleteHvz,
};
