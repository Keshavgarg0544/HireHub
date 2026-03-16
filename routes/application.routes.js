const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/apply/:jobId",
  authMiddleware,
  applicationController.applyJob
);

module.exports = router;