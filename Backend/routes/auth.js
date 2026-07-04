const express = require("express");
const passport = require("passport");

const {
  googleCallback,
  register,
  login,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallback
);

// Local Register
router.post("/register", register);

// Local Login
router.post("/login", login);

// Current User
router.get("/me", protect, getMe);

module.exports = router;