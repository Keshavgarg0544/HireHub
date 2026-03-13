const express = require("express");

const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "HireHub API Running" });
});

module.exports = app;