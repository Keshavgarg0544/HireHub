const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Name is required",
      },
      len: {
        args: [2, 50],
        msg: "Name must be between 2 and 50 characters",
      },
    },
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Email already exists",
    },
    validate: {
      isEmail: {
        msg: "Invalid email format",
      },
      notEmpty: {
        msg: "Email is required",
      },
    },
    set(value) {
      this.setDataValue("email", value.toLowerCase().trim());
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password is required",
      },
      len: {
        args: [6, 100],
        msg: "Password must be at least 6 characters",
      },
    },
  },

  role: {
    type: DataTypes.ENUM("ADMIN", "RECRUITER", "JOB_SEEKER"),
    defaultValue: "JOB_SEEKER",
  },

  phone: {
   type: DataTypes.STRING,
   allowNull: true,
   validate: {
     isValidPhone(value) {
       if (value && !/^[0-9]{10}$/.test(value)) {
         throw new Error("Phone number must be 10 digits");
       }
     },
   },
 },

 bio: {
   type: DataTypes.TEXT,
   allowNull: true,
 },

 skills: {
   type: DataTypes.JSON, // Store skills as an array/JSON
   allowNull: true,
   defaultValue: [],
 },

 resumeUrl: {
   type: DataTypes.STRING,
   allowNull: true,
 },

 resumeName: {
   type: DataTypes.STRING,
   allowNull: true,
 },

 profilePhotoUrl: {
   type: DataTypes.STRING,
   allowNull: true,
 },

 coverPhotoUrl: {
   type: DataTypes.STRING,
   allowNull: true,
 },

 socialLinks: {
   type: DataTypes.JSON,
   allowNull: true,
   defaultValue: []
 },

 education: {
   type: DataTypes.JSON,
   allowNull: true,
   defaultValue: []
 },

 experience: {
   type: DataTypes.JSON,
   allowNull: true,
   defaultValue: []
 },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  timestamps: true,
  tableName: "users",

  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },

    beforeUpdate: async (user) => {
      if (user.changed("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

module.exports = User;