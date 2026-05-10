const db = require("../models");
const CompanyMember = db.CompanyMember;

exports.checkCompanyMembership = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // The companyId can be in params (e.g. /:companyId/members) or body (when posting a job)
      const companyId = req.params.companyId || req.body.companyId;
      const userId = req.user.id;

      if (!companyId) {
        return res.status(400).json({ 
          success: false, 
          message: "Company ID is required for authorization." 
        });
      }

      const membership = await CompanyMember.findOne({
        where: { companyId, userId, status: 'APPROVED' }
      });

      if (!membership) {
        return res.status(403).json({ 
          success: false, 
          message: "You are not an approved member of this company." 
        });
      }

      if (requiredRole === 'COMPANY_ADMIN' && membership.role !== 'COMPANY_ADMIN') {
        return res.status(403).json({ 
          success: false, 
          message: "Only Company Admins can perform this action." 
        });
      }

      // Attach membership to request for downstream use
      req.companyMembership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};
