const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/middleware/authMiddleware");
const PokerController = require("../controller/pokerController")

router.post("/createPokerRoom", authMiddleware.isLoggedIn, PokerController.createPokerRoom);
router.post("/updatePokerRoom", authMiddleware.isLoggedIn, PokerController.updatePokerRoom);
router.post("/deletePokerRoom", authMiddleware.isLoggedIn, PokerController.deletePokerRoom);
router.post("/getRoomList", authMiddleware.isLoggedIn, PokerController.getRoomList);

module.exports = router;