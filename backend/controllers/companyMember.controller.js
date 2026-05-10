const db = require("../models");
const CompanyMember = db.CompanyMember;
const Company = db.Company;
const User = db.User;

// 1. Recruiter requests access to an existing company
exports.requestAccess = async (req, res, next) => {
  try {
    const { companyId } = req.body;
    const userId = req.user.id;

    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company ID is required" });
    }

    // Check if company exists
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    // Check if a membership request already exists
    const existing = await CompanyMember.findOne({
      where: { companyId, userId }
    });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: `You already have a ${existing.status} request for this company.` 
      });
    }

    const membership = await CompanyMember.create({
      companyId,
      userId,
      role: 'RECRUITER',
      status: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: "Access request sent successfully. Waiting for Admin approval.",
      data: membership
    });

  } catch (error) {
    next(error);
  }
};

// 2. Admin gets all pending requests for a company
exports.getPendingRequests = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const requests = await CompanyMember.findAll({
      where: { companyId, status: 'PENDING' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    next(error);
  }
};

// 3. Admin reviews (approves/rejects) a request
exports.reviewAccessRequest = async (req, res, next) => {
  try {
    const { membershipId } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status update" });
    }

    const membership = await CompanyMember.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({ success: false, message: "Membership request not found" });
    }

    // Ensure the admin reviewing it actually belongs to the same company
    // (This is also protected by the rbac middleware, but double check doesn't hurt)
    if (membership.companyId.toString() !== req.params.companyId.toString()) {
      return res.status(400).json({ success: false, message: "Company ID mismatch" });
    }

    membership.status = status;
    membership.approvedBy = req.user.id;
    await membership.save();

    res.json({
      success: true,
      message: `Membership request ${status.toLowerCase()} successfully`,
      data: membership
    });

  } catch (error) {
    next(error);
  }
};

// 4. Admin gets all members of a company
exports.getCompanyMembers = async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const members = await CompanyMember.findAll({
      where: { companyId, status: 'APPROVED' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({
      success: true,
      data: members
    });

  } catch (error) {
    next(error);
  }
};

// 5. User gets their own memberships
exports.getMyMemberships = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const memberships = await CompanyMember.findAll({
      where: { userId },
      include: [
        { model: Company, as: 'company' }
      ]
    });

    res.json({
      success: true,
      data: memberships
    });

  } catch (error) {
    next(error);
  }
};

// 6. Admin removes a member
exports.removeMember = async (req, res, next) => {
  try {
    const { membershipId, companyId } = req.params;

    const membership = await CompanyMember.findByPk(membershipId);
    
    if (!membership || membership.companyId.toString() !== companyId.toString()) {
      return res.status(404).json({ success: false, message: "Membership not found" });
    }

    // Prevent removing the last admin (basic safety check)
    if (membership.role === 'COMPANY_ADMIN') {
      const adminCount = await CompanyMember.count({
        where: { companyId, role: 'COMPANY_ADMIN', status: 'APPROVED' }
      });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: "Cannot remove the only company admin." });
      }
    }

    await membership.destroy();

    res.json({
      success: true,
      message: "Member removed successfully"
    });

  } catch (error) {
    next(error);
  }
};
