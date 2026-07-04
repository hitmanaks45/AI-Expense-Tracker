const jwt = require("jsonwebtoken");
const User = require("../models/TempUser");

const protect = async (req, res, next) => {
  try {
    // 1. Get Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // 2. Extract Token
    const token = authHeader.split(" ")[1];

    // 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch latest user from MongoDB
    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // 5. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;