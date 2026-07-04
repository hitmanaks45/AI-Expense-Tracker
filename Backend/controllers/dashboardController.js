const asyncHandler = require("../utils/asyncHandler");
const dashboardService = require("../services/dashboardService");

const getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getDashboardData(req.user._id);

  res.status(200).json(dashboardData);
});

module.exports = {
  getDashboard,
};