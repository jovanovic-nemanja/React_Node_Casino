const express = require('express');
const router = express.Router();
const DashboardControl = require("../controller/dashboardController")
const authMiddleware = require("../middleware/middleware/authMiddleware");

router.post("/revenue_load",authMiddleware.isLoggedIn,DashboardControl.revenue_load);
router.post("/get_user_load",authMiddleware.isLoggedIn,DashboardControl.get_user_load);

module.exports = router;