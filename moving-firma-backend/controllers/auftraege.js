const Auftrag = require("../models/auftrag");
const Hvz = require("../models/hvz");
// controllers/auftraege.js

const formatGermanDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};
const createAuftrag = async (req, res) => {
  try {
    console.log("📥 Incoming Auftrag data:", req.body);

    const newAuftrag = await Auftrag.create({
      ...req.body,
      createdBy: req.user._id,
    });

    // --- HVZ Creation ---
    if (req.body.auszugHvz) {
      const hvzData = {
        auftragId: newAuftrag._id,
        kundeName: newAuftrag.kundeName,
        straße: newAuftrag.auszugsadresse, // renamed to match schema
        datum: formatGermanDate(newAuftrag.datum),
        status: "Nicht bestellt", // required field
        hvzName: "Auszug-HVZ", // optional, you can customize
        classification: "Privat", // optional
      };
      await Hvz.create(hvzData);
    }

    if (req.body.einzugHvz) {
      const hvzData = {
        auftragId: newAuftrag._id,
        kundeName: newAuftrag.kundeName,
        straße: newAuftrag.einzugsadresse,
        datum: formatGermanDate(newAuftrag.datum),
        status: "Nicht bestellt", // required field
        hvzName: "Einzug-HVZ", // optional, you can customize
        classification: "Privat",
      };
      await Hvz.create(hvzData);
    }

    res.status(201).json(newAuftrag);
  } catch (error) {
    console.error("❌ Backend Error in createAuftrag:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

const getAllAuftraege = async (req, res) => {
  try {
    const auftraege = await Auftrag.find();
    res.json(auftraege);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAuftragById = async (req, res) => {
  try {
    const auftraege = await Auftrag.find({ _id: req.params.id });
    if (auftraege.length === 0) {
      res.status(404).json({ message: "Auftrag nicht gefunden" });
    }
    res.json(auftraege[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAuftrag = async (req, res) => {
  try {
    // Update the Auftrag
    const auftrag = await Auftrag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!auftrag) {
      return res.status(404).json({ message: "Auftrag nicht gefunden" });
    }

    // --- HVZ Handling ---

    // 1️⃣ Auszug-HVZ
    if (req.body.auszugHvz) {
      // Check if Auszug-HVZ already exists
      const existingAuszug = await Hvz.findOne({
        auftragId: auftrag._id,
        hvzName: "Auszug-HVZ",
      });
      if (!existingAuszug) {
        await Hvz.create({
          auftragId: auftrag._id,
          kundeName: auftrag.kundeName,
          straße: auftrag.auszugsadresse,
          datum: formatGermanDate(auftrag.datum),
          status: "Nicht bestellt",
          hvzName: "Auszug-HVZ",
          classification: "Privat",
        });
      }
    } else {
      // Delete Auszug-HVZ if unchecked
      await Hvz.deleteMany({
        auftragId: auftrag._id,
        hvzName: "Auszug-HVZ",
      });
    }

    // 2️⃣ Einzug-HVZ
    if (req.body.einzugHvz) {
      const existingEinzug = await Hvz.findOne({
        auftragId: auftrag._id,
        hvzName: "Einzug-HVZ",
      });
      if (!existingEinzug) {
        await Hvz.create({
          auftragId: auftrag._id,
          kundeName: auftrag.kundeName,
          straße: auftrag.einzugsadresse,
          datum: formatGermanDate(auftrag.datum),
          status: "Nicht bestellt",
          hvzName: "Einzug-HVZ",
          classification: "Privat",
        });
      }
    } else {
      await Hvz.deleteMany({
        auftragId: auftrag._id,
        hvzName: "Einzug-HVZ",
      });
    }

    res.status(200).json(auftrag);
  } catch (err) {
    console.error("❌ Error updating Auftrag:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

const deleteAuftrag = async (req, res) => {
  try {
    const auftragId = req.params.id;

    // 1. Auftrag löschen
    const deletedAuftrag = await Auftrag.findByIdAndDelete(auftragId);
    if (!deletedAuftrag) {
      return res.status(404).json({ message: "Auftrag nicht gefunden" });
    }

    // 2. Alle HVZ löschen, die zu diesem Auftrag gehören
    await Hvz.deleteMany({ auftragId });

    res.json({
      message: "Auftrag und zugehörige HVZ erfolgreich gelöscht",
      deletedAuftrag,
    });
  } catch (error) {
    console.error("❌ Fehler beim Löschen:", error);
    res.status(500).json({ message: error.message });
  }
};

const auftragStatsMonthly = async (req, res) => {
  try {
    const year = parseInt(req.params.year); // e.g. /stats/monthly/2025

    const stats = await Auftrag.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      stats.map((s) => ({
        month: s._id,
        count: s.count,
      }))
    );
  } catch (err) {
    console.error("❌ Error fetching monthly stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const auftragStatsYearly = async (req, res) => {
  try {
    const stats = await Auftrag.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(stats.map((s) => ({ year: s._id, count: s.count })));
  } catch (err) {
    console.error("❌ Error fetching yearly stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createAuftrag,
  getAllAuftraege,
  getAuftragById,
  updateAuftrag,
  deleteAuftrag,
  auftragStatsYearly,
  auftragStatsMonthly,
};
