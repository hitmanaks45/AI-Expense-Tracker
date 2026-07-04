const bcrypt = require("bcryptjs");
const User = require("../models/TempUser");
const generateToken = require("../utils/generateToken");

// =================== GOOGLE CALLBACK ===================
const googleCallback = (req, res) => {
  const token = generateToken(req.user);

  res.redirect(
    `${process.env.FRONTEND_URL}/auth/success?token=${token}`
  );
};

// =================== REGISTER ===================
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// =================== LOGIN ===================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.provider === "google") {
      return res.status(400).json({
        success: false,
        message: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// =================== CURRENT USER ===================
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  googleCallback,
  register,
  login,
  getMe,
};