const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CompanyMember = sequelize.define("CompanyMember", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "User ID is required",
      },
    },
  },
  
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Company ID is required",
      },
    },
  },
  
  role: {
    type: DataTypes.ENUM("COMPANY_ADMIN", "RECRUITER"),
    allowNull: false,
    defaultValue: "RECRUITER",
    validate: {
      isIn: {
        args: [["COMPANY_ADMIN", "RECRUITER"]],
        msg: "Invalid role specified",
      },
    },
  },
  
  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
    allowNull: false,
    defaultValue: "PENDING",
    validate: {
      isIn: {
        args: [["PENDING", "APPROVED", "REJECTED"]],
        msg: "Invalid status specified",
      },
    },
  },
  
  invitedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "ID of the admin who invited this user, if applicable",
  },
  
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "ID of the admin who approved this membership",
  },

}, {
  timestamps: true,
  tableName: "company_members",
  
  indexes: [
    {
      unique: true,
      fields: ["userId", "companyId"], 
    },
    {
      fields: ["companyId"],
    },
    {
      fields: ["userId"],
    },
    {
      fields: ["companyId", "status"], 
    }
  ],
});

module.exports = CompanyMember;
