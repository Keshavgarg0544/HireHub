const sequelize = require("../config/database");

const User = require("./user.model");
const Company = require("./company.model");
const Job = require("./job.model");
const Application = require("./application.model");
const CompanyMember = require("./companyMember.model");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Company = Company;
db.Job = Job;
db.Application = Application;
db.CompanyMember = CompanyMember;

// ==========================================
// NEW MEMBERSHIP ASSOCIATIONS (PHASE 4)
// ==========================================

// 1. User <-> Company (Many-to-Many via CompanyMember)
// A user can be a member of many companies
User.belongsToMany(Company, {
  through: CompanyMember,
  foreignKey: "userId",
  otherKey: "companyId",
  as: "memberCompanies",
});

// A company can have many users (members)
Company.belongsToMany(User, {
  through: CompanyMember,
  foreignKey: "companyId",
  otherKey: "userId",
  as: "members",
});

// 2. Direct relations to the Pivot Table
// This allows us to query CompanyMember directly and include the User/Company data
CompanyMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(CompanyMember, {
  foreignKey: "userId",
  as: "memberships",
});

CompanyMember.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});
Company.hasMany(CompanyMember, {
  foreignKey: "companyId",
  as: "companyMemberships",
});

// ==========================================
// OLD LEGACY ASSOCIATIONS (Do not touch yet)
// ==========================================


User.hasMany(Job, {
  foreignKey: "postedBy",
  as: "postedJobs",
  onDelete: "CASCADE",
});
Job.belongsTo(User, {
  foreignKey: "postedBy",
  as: "recruiter",
});

Company.hasMany(Job, {
  foreignKey: "companyId",
  as: "jobs",
  onDelete: "CASCADE",
});
Job.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

User.hasMany(Application, {
  foreignKey: "applicantId",
  as: "applications",
  onDelete: "CASCADE",
});
Application.belongsTo(User, {
  foreignKey: "applicantId",
  as: "applicant",
});

Job.hasMany(Application, {
  foreignKey: "jobId",
  as: "applications",
  onDelete: "CASCADE",
});
Application.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

User.hasMany(Company, {
  foreignKey: "createdBy",
  as: "companies",
  onDelete: "CASCADE",
});
Company.belongsTo(User, {
  foreignKey: "createdBy",
  as: "owner",
});

module.exports = db;