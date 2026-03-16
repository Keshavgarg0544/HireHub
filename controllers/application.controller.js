const db = require("../models");

const Application = db.Application;
const Job = db.Job;



// APPLY TO JOB
exports.applyJob = async (req, res) => {

  try {

    const jobId = req.params.jobId;

    const job = await Job.findByPk(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const application = await Application.create({
      jobId: jobId,
      applicantId: req.user.id
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "You already applied to this job"
      });
    }

    res.status(500).json({
      message: "Application failed"
    });

  }

};