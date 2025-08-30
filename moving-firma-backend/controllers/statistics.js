const Ausgabe = require("../models/ausgabe");
const Invoice = require("../models/invoice");

const getMonatsStatistik = async (req, res) => {
  try {
    // Hole alle Einträge
    const ausgaben = await Ausgabe.find();
    const eingaben = await Invoice.find();

    // Helper zum Monat extrahieren
    const getMonth = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleString("de-DE", { month: "short" }); // Jan, Feb, Mär...
    };

    // Sum Ausgaben
    const stats = {};

    ausgaben.forEach((a) => {
      const month = getMonth(a.date || a.datum || a.createdAt);
      if (!stats[month]) stats[month] = { month, ausgaben: 0, eingaben: 0 };
      stats[month].ausgaben += Number(a.betrag || a.amount || 0);
    });
    // Sum Eingaben
    eingaben.forEach((e) => {
      const month = getMonth(
        e.rechnungsDatum || e.date || e.datum || e.createdAt
      );
      if (!stats[month]) stats[month] = { month, ausgaben: 0, eingaben: 0 };
      stats[month].eingaben += parseFloat(e.nettoBetrag) || 0;
    });

    // Antwort als Array sortiert nach Monat
    const result = Object.values(stats);
    res.json(result);
  } catch (err) {
    console.error("❌ Fehler Statistik:", err);
    res.status(500).json({ message: err.message });
  }
};
const getJahresStatistik = async (req, res) => {
  try {
    const ausgaben = await Ausgabe.find();
    const eingaben = await Invoice.find();

    const stats = {};

    const getYear = (dateStr) => new Date(dateStr).getFullYear();

    ausgaben.forEach((a) => {
      const year = getYear(a.date || a.datum || a.createdAt);
      if (!stats[year]) stats[year] = { year, ausgaben: 0, eingaben: 0 };
      stats[year].ausgaben += Number(a.betrag || a.amount || 0);
    });

    eingaben.forEach((e) => {
      const year = getYear(
        e.rechnungsDatum || e.date || e.datum || e.createdAt
      );
      if (!stats[year]) stats[year] = { year, ausgaben: 0, eingaben: 0 };
      stats[year].eingaben += Number(e.nettoBetrag || 0);
    });

    const result = Object.values(stats);
    res.json(result);
  } catch (err) {
    console.error("❌ Fehler Statistik:", err);
    res.status(500).json({ message: err.message });
  }
};
module.exports = { getMonatsStatistik, getJahresStatistik };
