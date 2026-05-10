const express = require("express");
const router = express.Router();

const companyController = require("../controllers/company.controller");
const validate = require("../middleware/validate.middleware");
const { companySchema } = require("../validators/company.validator");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const { checkCompanyMembership } = require("../middleware/rbac.middleware");

const upload = require("../middleware/upload.middleware");

router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  upload.single("logo"),
  validate(companySchema),
  companyController.createCompany
);

router.get("/", companyController.getCompanies);

router.get("/:id", companyController.getCompanyById);

// Update company details (requires COMPANY_ADMIN)
router.put(
  "/:companyId",
  auth,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  upload.single("logo"),
  (req, res, next) => {
      // The controller expects id in params, but rbac expects companyId.
      req.params.id = req.params.companyId;
      next();
  },
  companyController.updateCompany
);

module.exports = router;