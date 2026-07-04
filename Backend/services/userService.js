const User = require("../models/User");

const getCurrentUser = async (userId) => {
  return await User.findById(userId).select("-__v");
};

module.exports = {
  getCurrentUser,
};