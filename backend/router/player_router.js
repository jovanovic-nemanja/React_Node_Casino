const express = require('express');
const router = express.Router();
const Players = require("../controller/playerscontroller")
const authMiddleware = require("../middleware/middleware/authMiddleware");

// get wallet 
router.post("/get_wallet_mainuser", authMiddleware.isLoggedIn,Players.get_wallet_mainuser);
// getting for players
router.post("/playerlist",authMiddleware.isLoggedIn, Players.players_load);
// deposit for players
router.post("/deposittion",authMiddleware.isLoggedIn, Players.deposit_action);
// withdrawal for players
router.post("/withdrawaction", authMiddleware.isLoggedIn, Players.withdrawl_action);
// player side reset password
router.post("/playerresetpass", authMiddleware.isLoggedIn, Players.playerresetpass_action);
// player side block action
router.post("/multiblock",authMiddleware.isLoggedIn, Players.multiblock_action);
// inactive players
router.post("/get_inactivePlayers",authMiddleware.isLoggedIn, Players.get_inactivePlayers);
// player detail account statement
router.post("/get_accountstatement",authMiddleware.isLoggedIn,Players.get_accountstatement)
// player detail profile 
router.post("/profile_userload", authMiddleware.isLoggedIn,Players.profile_userload);
router.post("/profile_userupdate",authMiddleware.isLoggedIn, Players.profile_userupdate);
// player detail betting profit
router.post("/get_bets_profit",authMiddleware.isLoggedIn, Players.get_bets_profit);
// player side function for  getting launch url
router.post("/gameaccount",authMiddleware.isLoggedIn,  Players.get_realgameaccount);
// player side function for gettiing guest game launch url 
router.post("/guestgameaccount", Players.get_guestgameaccount);

//  player limit functionally
router.post("/playerlimit_load",authMiddleware.isLoggedIn,Players.get_playerlimit);
router.post("/playerlimit_update",authMiddleware.isLoggedIn,Players.update_playerlimit);

// player kyc part
router.post("/KYCmenuload",authMiddleware.isLoggedIn, Players.get_kycmenuLoad);
router.post("/KYCupdate",authMiddleware.isLoggedIn, Players.update_kycmenu);

// player site login users
router.post("/realtimeusers",authMiddleware.isLoggedIn,Players.realtimeusers_load);
// user game-players
router.post("/gamesrealtimeusers",authMiddleware.isLoggedIn,Players.gamesrealtimeusers_load);
router.post("/gamesrealtimeusersdelete",authMiddleware.isLoggedIn,Players.gamesrealtimeusers_delete);

// cms side finance deposit history
router.post("/balance_history",authMiddleware.isLoggedIn,Players.balance_history_load);


router.post("/get_balances", Players.balances_load);
router.post("/playerupdate", Players.playerupdate_action);
router.post("/get_wallet_profit", Players.get_wallet_profit);

router.post("/kickPlayerFromGames",Players.kickPlayerFromGames_action);

router.post("/getaccount", Players.getaccount);



module.exports = router;