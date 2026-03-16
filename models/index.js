const sequelize = require("../config/database");

const User = require("./user.model");
const Company = require("./company.model");
const Job = require("./job.model");
const Application = require("./application.model");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Company = Company;
db.Job = Job;
db.Application = Application;

/* Relationships */

User.hasMany(Job, { foreignKey: "postedBy" });
Job.belongsTo(User, { foreignKey: "postedBy" });

Company.hasMany(Job, { foreignKey: "companyId" });
Job.belongsTo(Company, { foreignKey: "companyId" });

User.hasMany(Application, { foreignKey: "applicantId" });
Application.belongsTo(User, { foreignKey: "applicantId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });


module.exports = db;