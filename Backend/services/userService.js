const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getCurrentUser = async (userId) => {
  return await User.findById(userId).select("-__v");
};

const updateProfile = async (userId, { name, email }) => {
  const existingUser = await User.findOne({
    email,
    _id: { $ne: userId },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    profilePicture: user.profilePicture,
  };
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
};

module.exports = {
  getCurrentUser,
  updateProfile,
  changePassword,
};