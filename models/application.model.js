const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Application = sequelize.define("Application", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEW",
      "REJECTED",
      "HIRED"
    ),
    defaultValue: "APPLIED"
  }

}, {
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ["jobId", "applicantId"]
    }
  ]

});

module.exports = Application;