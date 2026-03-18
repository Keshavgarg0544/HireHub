const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema } = require("../validation/auth.validation");

const User = db.User;

// REGISTER
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const { name, role } = req.body;

    const email = String(req.body.email).toLowerCase().trim();
    const password = String(req.body.password);

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // ❗ NO hashing here (model hook karega)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "JOB_SEEKER"
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const email = String(req.body.email).toLowerCase().trim();
    const password = String(req.body.password);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};