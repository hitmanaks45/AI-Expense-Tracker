const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

module.exports = router;