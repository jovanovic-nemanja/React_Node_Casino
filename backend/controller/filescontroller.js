const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const config = require('../db');
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;



module.exports = router;