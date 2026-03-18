const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const applicationRoutes = require("./routes/application.routes");
const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");
const errorHandler = require("./middleware/error.middleware");



app.use(morgan("dev"));  //middleware for logging HTTP requests in development mode

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use(errorHandler);


app.get("/", (req, res) => {
  res.json({ message: "HireHub API Running" });
});

module.exports = app;