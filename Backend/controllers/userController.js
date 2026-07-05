const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUser(req.user._id);
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(
    req.user._id,
    req.body
  );

  res.json(user);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await userService.changePassword(
    req.user._id,
    currentPassword,
    newPassword
  );

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});

module.exports = {
  getMe,
  updateProfile,
  changePassword,
};