require("dotenv/config");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const auftragRouter = require("./routes/auftraege");
const events = require("./routes/events");
const hvzs = require("./routes/hvzs");
const lagerungs = require("./routes/Lagerungs");
const invoices = require("./routes/invoice");
const ausgaben = require("./routes/ausgabe");
const authRouter = require("./routes/users");
const statistic = require("./routes/statistics");
const search = require("./routes/search");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/statistics", statistic);
app.use("/api/auftraege", auftragRouter);
app.use("/api/events", events);
app.use("/api/hvzs", hvzs);
app.use("/api/search", search);
app.use("/api/lagerungs", lagerungs);
app.use("/api/ausgaben", ausgaben);
app.use("/api/invoices", invoices);

app.use("/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
