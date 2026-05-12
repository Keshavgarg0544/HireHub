const db = require("../models");

/**
 * Service to handle ownership and authorization checks.
 */
class AuthorizationService {
  /**
   * Check if a user owns a company.
   * @param {number} userId 
   * @param {number} companyId 
   * @param {Object} options - Sequelize options (e.g. transaction)
   * @throws {Error} if not authorized
   */
  async verifyCompanyOwnership(userId, companyId, options = {}) {
    const company = await db.Company.findByPk(companyId, options);
    
    if (!company) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }

    const membership = await db.CompanyMember.findOne({
      where: { companyId, userId, status: 'APPROVED' },
      ...options
    });

    if (!membership) {
      const error = new Error("You are not authorized to perform actions for this company");
      error.status = 403;
      throw error;
    }

    company.membership = membership;
    return company;
  }

  
  async verifyJobOwnership(userId, jobId, options = {}) {
    const job = await db.Job.findByPk(jobId, options);

    if (!job) {
      const error = new Error("Job not found");
      error.status = 404;
      throw error;
    }

    if (job.postedBy === userId) {
      return job;
    }

    const membership = await db.CompanyMember.findOne({
      where: { companyId: job.companyId, userId, status: 'APPROVED', role: 'COMPANY_ADMIN' },
      ...options
    });

    if (!membership) {
      const error = new Error("You are not authorized to modify this job. You must be the original poster or a Company Admin.");
      error.status = 403;
      throw error;
    }

    return job;
  }
}

module.exports = new AuthorizationService();
