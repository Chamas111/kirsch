const mongoose = require("mongoose");

const lagerungSchema = new mongoose.Schema(
  {
    auftragId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auftrag",
    },
    kundeName: { type: String, required: true },
    lager: { type: String, required: true },
    datum: { type: String, required: true },
    employeeName: { type: String },
    notitz: { type: String },
  },
  { timestamps: true }
);

const Lagerungen = mongoose.model("Lagerung", lagerungSchema);
module.exports = Lagerungen;
