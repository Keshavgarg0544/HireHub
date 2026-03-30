const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/apply/:jobId",
  auth,
  authorize("JOB_SEEKER"),
  applicationController.applyJob
);

router.get(
  "/my",
  auth,
  authorize("JOB_SEEKER"),
  applicationController.getMyApplications
);

router.get(
  "/job/:jobId",
  auth,
  authorize("RECRUITER"),
  applicationController.getApplicationByJob
);

router.put(
  "/:id/status",
  auth,
  authorize("RECRUITER"),
  applicationController.updateStatus
);

module.exports = router;