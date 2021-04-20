const express = require('express');
const router = express.Router();

const DashboardRouter = require("./dashboard_router");
const PlayerRouter = require("./player_router");
const UsersRouter = require("./users_router");
const PermissionRouter = require("./permission_router");
const SettingRouter = require("./SettingRouter");
const CmsRouter = require("./cms_router");
const PokerRouter = require("./pokerRouter")

// const GameProviders = require("../controller/gameproviders.js");

router.use("/users",UsersRouter);
router.use("/dashboard",DashboardRouter);
router.use("/players",PlayerRouter);
router.use("/permission",PermissionRouter);
router.use("/settings", SettingRouter)
router.use("/cms",CmsRouter);
router.use("/poker", PokerRouter);

module.exports = router;