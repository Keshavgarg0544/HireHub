const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");

const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
  "/",
  auth,
  authorize("RECRUITER"),
  jobController.createJob
);

router.get("/", jobController.getJobs);

router.get("/:id", jobController.getJobById);

module.exports = router;