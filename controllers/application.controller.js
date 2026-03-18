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
        message: "Job not found",
      });
    }

    const application = await Application.create({
      jobId: jobId,
      applicantId: req.user.id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "You already applied to this job",
      });
    }

    res.status(500).json({
      message: "Application failed",
    });
  }
};
// GET MY APPLICATIONS
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.findAll({
      where: { applicantId: userId },
      include: [
        {
          model: Job,
          attributes: ["title", "location"],
        },
      ],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET APPLICATIONS BY JOB
exports.getApplicationByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.findAll({
      where: { jobId: jobId },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE APPLICATION STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await Application.findByPk(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }
    const job = await Job.findByPk(application.jobId);
    if (!job) {
      return res.status(404).json({
        message: "Associated job not found",
      });
    }
    if (job.postedBy !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    application.status = status.toUpperCase();
    await application.save();
    res.json({
      message: "Application status updated successfully",
      application: application.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
