const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/apply/:jobId",
  authMiddleware,
  applicationController.applyJob
);

router.get(
  "/my",
  authMiddleware,
  applicationController.getMyApplications
);

router.get(
  "/job/:jobId",
  authMiddleware,
  applicationController.getApplicationByJob
);

router.put(
  "/:id/status",
  authMiddleware,
  applicationController.updateStatus
);

module.exports = router;