const mongoose = require("mongoose");

const hvzSchema = new mongoose.Schema(
  {
    auftragId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auftrag",
    },
    kundeName: { type: String, required: true },
    straße: { type: String, required: true },
    datum: { type: String, required: true },
    status: { type: String, required: true },
    hvzName: { type: String },
    classification: { type: String },
  },
  { timestamps: true }
);

const Halteverbotszone = mongoose.model("Hvz", hvzSchema);
module.exports = Halteverbotszone;
