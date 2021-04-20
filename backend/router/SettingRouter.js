const express = require('express');
const router = express.Router();
const SettingControl = require("../controller/SettingController");

router.post("/setting_procredential_load",SettingControl.get_provider_credential);
router.post("/setting_procredential_save",SettingControl.save_provider_credential);
router.post("/setting_procredential_update",SettingControl.update_provider_credential);
router.post("/setting_procredential_delete",SettingControl.delete_provider_credential);

module.exports = router;
