const express = require("express");
const router = express.Router();
const companyMemberController = require("../controllers/companyMember.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");
const { checkCompanyMembership } = require("../middleware/rbac.middleware");

// 1. User gets their own memberships
router.get(
  "/my-memberships",
  isAuthenticated,
  authorize("RECRUITER"),
  companyMemberController.getMyMemberships
);

// 2. User requests access to a company
router.post(
  "/request",
  isAuthenticated,
  authorize("RECRUITER"),
  companyMemberController.requestAccess
);

// -------------------------------------------------------------
// ADMIN ROUTES (Requires COMPANY_ADMIN membership for the specific company)
// Note: We expect :companyId in the route params for the rbac middleware
// -------------------------------------------------------------

// 3. Admin gets all pending requests for their company
router.get(
  "/:companyId/requests",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.getPendingRequests
);

// 4. Admin reviews (approves/rejects) a request
router.put(
  "/:companyId/requests/:membershipId",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.reviewAccessRequest
);

// 5. Admin gets all approved members for their company
router.get(
  "/:companyId/members",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.getCompanyMembers
);

// 6. Admin removes a member from their company
router.delete(
  "/:companyId/members/:membershipId",
  isAuthenticated,
  authorize("RECRUITER"),
  checkCompanyMembership("COMPANY_ADMIN"),
  companyMemberController.removeMember
);

module.exports = router;
