const express = require('express');
const router = express.Router();
const UserCon = require("../controller/userscontroller")
const authMiddleware = require("../middleware/middleware/authMiddleware");

// player login
router.post("/login",UserCon.player_login);
// player register
router.post("/register",UserCon.player_register);
// admin login
router.post("/adminlogin",UserCon.admin_login)
// logout
router.post("/logout", authMiddleware.logoutUser,(req, res, next)=>{ res.json({status : true}); });
// player changedpasswrod 
router.post("/adminchangepassword",authMiddleware.isLoggedIn,UserCon.admin_changepassword)
// cms player user creating action
router.post("/adminplayerregister",authMiddleware.isLoggedIn,UserCon.Player_register)

// cms sidebar load
router.post("/adminsidebar_load",authMiddleware.isLoggedIn,UserCon.adminsidebar_load)
//cms user getting items list
router.post("/getlist",authMiddleware.isLoggedIn,UserCon.get_users_load)
// cms users actions start
router.post("/users_depositaction",authMiddleware.isLoggedIn,UserCon.users_depositaction)
router.post("/users_withdrawlaction",authMiddleware.isLoggedIn,UserCon.users_withdrawlaction)
router.post("/adminresetpassword",authMiddleware.isLoggedIn,UserCon.adminresetpassword)
router.post("/adminmultiusersblock",authMiddleware.isLoggedIn,UserCon.adminmultiusersblock)
router.post("/adminmultiusersdelete",authMiddleware.isLoggedIn,UserCon.adminmultiusersdelete)
router.post("/adminusers_again",authMiddleware.isLoggedIn,UserCon.adminuser_again)
router.post("/adminregister",authMiddleware.isLoggedIn,UserCon.admin_register)
// cms user actions end

// cms users rolemanager action start
router.post("/role_menuload",authMiddleware.isLoggedIn,UserCon.roles_load)
router.post("/role_menusave",authMiddleware.isLoggedIn,UserCon.roles_menusave)
router.post("/role_menuupdate",authMiddleware.isLoggedIn,UserCon.roles_menuupdate)
router.post("/role_menudelete",authMiddleware.isLoggedIn,UserCon.roles_menudelete)
// cms users rolemanager action send

router.post("/blockgetlist",UserCon.get_users_load_block)
router.post("/save_themeinfor",UserCon.save_adminthmestyle)
router.post("/changepassword",UserCon.user_changepassword)
router.post("/emailverify_receive",UserCon.emailverify_receive_action)
router.post("/forgotpassword_receive",UserCon.forgotpassword_receive_action)
router.post("/forgotpassword_send",UserCon.forgotpassword_send_action)
router.post("/forgotpassword_set",UserCon.forgotpassword_set_action)
router.post("/resend_email",UserCon.resend_email_action)


router.post("/againusersave",UserCon.userdetail_save)
router.post("/role_menuload_permission",UserCon.get_rolesfrom_per)
router.put("/authdecrypt",UserCon.decrypt_auth);

router.post("/get_themeinfor",authMiddleware.isLoggedIn,UserCon.get_adminthemestyle)
router.post("/get_userinfor",authMiddleware.isLoggedIn,UserCon.get_user_detail)
router.get("/getip",authMiddleware.isLoggedIn,UserCon.getip);

router.post("/save_pokergrid_api",authMiddleware.isLoggedIn,UserCon.save_pokergrid_api);
router.post("/load_pokergrid_api",authMiddleware.isLoggedIn,UserCon.load_pokergrid_api);
router.post("/update_pokergrid_api",authMiddleware.isLoggedIn,UserCon.update_pokergrid_api);

module.exports = router;