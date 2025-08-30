const Ausgabe = require("../models/ausgabe");

const parseGermanDate = (dateStr) => {
  const [day, month, year] = dateStr.split(".");
  return new Date(`${year}-${month}-${day}`);
};

const createAusgabe = async (req, res) => {
  try {
    console.log("📥 Received Lager data:", req.body);

    const ausgabe = await Ausgabe.create(req.body);

    res.status(201).json(ausgabe);
  } catch (err) {
    console.error("❌ Error creating ausgabe:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllAusgaben = async (req, res) => {
  try {
    const ausgabe = await Ausgabe.find();
    res.json(ausgabe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAusgabeById = async (req, res) => {
  try {
    const ausgabe = await Ausgabe.findById(req.params.id);

    if (!ausgabe) return res.status(404).json({ message: "Event not found" });
    res.json(ausgabe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAusgabe = async (req, res) => {
  try {
    const updateAusgabe = await Ausgabe.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updateAusgabe) {
      return res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(updateAusgabe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteAusgabe = async (req, res) => {
  try {
    const deleteAusgabe = await Ausgabe.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteAusgabe) {
      res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(deleteAusgabe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createAusgabe,
  getAllAusgaben,
  getAusgabeById,
  updateAusgabe,
  deleteAusgabe,
};
