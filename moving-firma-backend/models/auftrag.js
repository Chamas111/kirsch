const mongoose = require("mongoose");
const auftragSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "Der Titel im Formular ist ein obligatorisches Feld!"],
    },

    start: String, // e.g. '2025-07-25 14:00'
    end: String,
    datum: {
      type: String,
      // required: [true, "Das Datum im Formular ist ein obligatorisches Feld!"],
    },
    uhrZeit: {
      type: String, // e.g., "14:30"
      match: /^([01]?\d|2[0-3]):([0-5]\d)$/, // optional: validate HH:MM format
      //  required: [true, "Die Zeit im Formular ist ein obligatorisches Feld!"],
    },
    kundeName: { type: String },
    tel: { type: String },
    auszugsadresse: {
      type: String,
      // required: [true, "Die Adresse im Formular ist ein obligatorisches Feld!"],
    },
    auszugsEtage: { type: String },
    auszugsAufzug: { type: String },
    auszugHvz: { type: String },
    einzugsadresse: {
      type: String,
      // required: [true, "Der Titel im Formular ist ein obligatorisches Feld!"],
    },
    einzugsEtage: {
      type: String,
      // required: [true, "Der Titel im Formular ist ein obligatorisches Feld!"],
    },
    einzugsAufzug: {
      type: String,
      // required: [true, "Der Titel im Formular ist ein obligatorisches Feld!"],
    },
    einzugHvz: { type: String },

    preis: {
      type: String,
      // required: [true, "Die Adresse im Formular ist ein obligatorisches Feld!"],
    },
    hvz: { type: String },
    others: { type: String },
    bezahlMethod: { type: String },
    bemerkungen: { type: String },
    umzugsListe: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // link to event
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link to event
  },
  { timestamps: true }
);

const model = mongoose.model("Auftrag", auftragSchema);
module.exports = model;
