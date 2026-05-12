const express = require("express");
const router = express.Router();
const companyMemberController = require("../controllers/companyMember.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { checkCompanyMembership } = require("../middleware/rbac.middleware");

router.get(
  "/my-memberships",
  isAuthenticated,
  authorize("RECRUITER"),
  companyMemberController.getMyMemberships
);

router.post(
  "/request",
  isAuthenticated,
  authorize("RECRUITER"),
  companyMemberController.requestAccess
);

router.get(
  "/:companyId/requests",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.getPendingRequests
);

router.put(
  "/:companyId/requests/:membershipId",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.reviewAccessRequest
);

router.get(
  "/:companyId/members",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.getCompanyMembers
);

router.delete(
  "/:companyId/members/:membershipId",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.removeMember
);

module.exports = router;
