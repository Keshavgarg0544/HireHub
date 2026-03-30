const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  companyController.createCompany
);

router.get("/", companyController.getCompanies);

router.get("/:id", companyController.getCompanyById);

module.exports = router;