const mongoose = require("mongoose");

const ausgabeSchema = new mongoose.Schema(
  {
    rechnungId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rechnung",
    },
    anbieter: { type: String, required: true },
    rechnungsNummer: { type: String, required: true },
    betrag: { type: String, required: true },
    datum: { type: Date, required: true },
  },
  { timestamps: true }
);

const Ausgaben = mongoose.model("Ausgabe", ausgabeSchema, "ausgaben");
module.exports = Ausgaben;
