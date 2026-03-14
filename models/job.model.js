const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Job = sequelize.define("Job", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT
  },

  skillsRequired: {
    type: DataTypes.TEXT
  },

  location: {
    type: DataTypes.STRING
  },

  employmentType: {
    type: DataTypes.ENUM(
      "FULL_TIME",
      "PART_TIME",
      "INTERNSHIP",
      "CONTRACT"
    )
  },

  experienceLevel: {
    type: DataTypes.ENUM(
      "FRESHER",
      "JUNIOR",
      "MID",
      "SENIOR"
    )
  },

  salaryMin: {
    type: DataTypes.INTEGER
  },

  salaryMax: {
    type: DataTypes.INTEGER
  },

  applicationDeadline: {
    type: DataTypes.DATE
  },

  status: {
    type: DataTypes.ENUM("OPEN", "CLOSED"),
    defaultValue: "OPEN"
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});

module.exports = Job;