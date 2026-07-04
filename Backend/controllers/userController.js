const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getCurrentUser(req.user._id);

  res.status(200).json(user);
});

module.exports = {
  getMe,
};