const User = require("../models/TempUser");

const getCurrentUser = async (userId) => {
  return await User.findById(userId).select("-__v");
};

module.exports = {
  getCurrentUser,
};