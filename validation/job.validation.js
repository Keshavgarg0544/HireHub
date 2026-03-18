const Joi = require("joi");

exports.jobSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),

  skillsRequired: Joi.string().optional(),

  location: Joi.string().required(),

  employmentType: Joi.string().required(),

  experienceLevel: Joi.string().required(),

  salaryMin: Joi.number().required(),
  salaryMax: Joi.number().required(),

  applicationDeadline: Joi.date().required(),

  companyId: Joi.number().required()
});