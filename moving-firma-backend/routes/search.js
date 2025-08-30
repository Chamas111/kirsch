const express = require("express");
const router = express.Router();
const Auftrag = require("../models/auftrag");
const Invoice = require("../models/invoice");
const Ausgabe = require("../models/ausgabe");
const Hvz = require("../models/hvz");
const Lagerung = require("../models/lagerung");

router.get("/", async (req, res) => {
  try {
    const { query, searchField } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Suchbegriff fehlt" });
    }

    const regexQuery = { $regex: query, $options: "i" };
    const numericQuery = parseFloat(query);

    // --- LAGERUNG ---
    let lagerungen = [];
    const lagerungFields = {
      datum: "datum",
      title: "kundeName",
      straße: "lager",
      kundeName: "employeeName",
      status: "notitz",
    };

    if (searchField && lagerungFields[searchField]) {
      lagerungen = await Lagerung.find({
        [lagerungFields[searchField]]: regexQuery,
      });
    } else {
      lagerungen = await Lagerung.find({
        $or: [
          { datum: regexQuery },
          { kundeName: regexQuery },
          { lager: regexQuery },
          { employeeName: regexQuery },
          { notitz: regexQuery },
        ],
      });
    }

    // --- HVZ ---
    let hvzs = [];
    const hvzFields = {
      datum: "datum",
      title: "classification",
      straße: "straße",
      kundeName: "kundeName",
      status: "status",
    };

    if (searchField && hvzFields[searchField]) {
      hvzs = await Hvz.find({ [hvzFields[searchField]]: regexQuery });
    } else {
      hvzs = await Hvz.find({
        $or: [
          { datum: regexQuery },
          { classification: regexQuery },
          { straße: regexQuery },
          { kundeName: regexQuery },
          { status: regexQuery },
        ],
      });
    }

    // --- AUFTRÄGE ---
    let auftraege = [];
    const auftragFields = {
      classification: "classification",
      kundeName: "kundeName",
      straße: "tel",
    };

    if (searchField && auftragFields[searchField]) {
      auftraege = await Auftrag.find({
        [auftragFields[searchField]]: regexQuery,
      });
    } else {
      auftraege = await Auftrag.find({
        $or: [
          { title: regexQuery },
          { kundeName: regexQuery },
          { tel: regexQuery },
        ],
      });
    }

    // --- INVOICES ---
    let invoices = [];
    if (searchField === "nettoBetrag" && !isNaN(numericQuery)) {
      invoices = await Invoice.find({ nettoBetrag: numericQuery });
    } else if (
      searchField === "rechnungsNummer" ||
      searchField === "kundeName"
    ) {
      invoices = await Invoice.find({ [searchField]: regexQuery });
    } else {
      invoices = await Invoice.find({
        $or: [
          { rechnungsNummer: regexQuery },
          { kundeName: regexQuery },
          ...(!isNaN(numericQuery) ? [{ nettoBetrag: numericQuery }] : []),
        ],
      });
    }

    // --- AUSGABEN ---
    let ausgaben = [];
    if (searchField === "Betrag" && !isNaN(numericQuery)) {
      ausgaben = await Ausgabe.find({ betrag: numericQuery });
    } else if (
      searchField === "rechnungsNummer" ||
      searchField === "anbieter"
    ) {
      ausgaben = await Ausgabe.find({ [searchField]: regexQuery });
    } else {
      ausgaben = await Ausgabe.find({
        $or: [
          { rechnungsNummer: regexQuery },
          { anbieter: regexQuery },
          ...(!isNaN(numericQuery) ? [{ betrag: numericQuery }] : []),
        ],
      });
    }

    // --- RETURN ALL ---
    res.json({ auftraege, invoices, ausgaben, lagerungen, hvzs });
  } catch (err) {
    console.error("❌ Fehler bei Suche:", err);
    res.status(500).json({ message: "Serverfehler bei Suche" });
  }
});

module.exports = router;
