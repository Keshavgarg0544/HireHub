const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, jobController.createJob);

router.get("/", jobController.getJobs);

router.get("/:id", jobController.getJobById);

module.exports = router;