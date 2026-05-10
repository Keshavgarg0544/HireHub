const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const applicationRoutes = require("./routes/application.routes");
const companyRoutes = require("./routes/company.routes");
const jobRoutes = require("./routes/job.routes");
const adminRoutes = require("./routes/admin.routes");
const companyMemberRoutes = require("./routes/companyMember.routes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company-members", companyMemberRoutes);

app.get("/", (req, res) => {
  res.json({ message: "HireHub API Running" });
});

const errorHandler = require("./middleware/error.middleware");
app.use(errorHandler);

module.exports = app;