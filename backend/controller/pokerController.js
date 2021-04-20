const BASECONTROL = require('./basecontroller');
const POKERROOMMODEL = require('../models/games_model').POKERROOMMODEL;

exports.createPokerRoom = async (req, res, next) => {
    var sdata = await BASECONTROL.data_save(req.body, POKERROOMMODEL);
    if (sdata) {
        this.getRoomList(req, res, next);
        return;
    } else {
        res.json({status: false, data: "Server Error!"});
        return next();
    }
}

exports.updatePokerRoom = async (req, res, next) => {
    var udata = {...req.body};
    delete udata._id;
    var sdata = await BASECONTROL.BfindOneAndUpdate(POKERROOMMODEL, {_id: req.body._id}, udata);
    if (sdata) {
        this.getRoomList(req, res, next);
        return;
    } else {
        res.json({status: false, data: "Server Error!"});
        return next();
    }
}

exports.getRoomList = async (req, res, next) => {
    var ldata = await BASECONTROL.Bfind(POKERROOMMODEL, {});
    if (ldata) {
        res.json({status: true, data: ldata});
        return next();
    } else {
        res.json({status: false})
    }
}

exports.deletePokerRoom = async (req, res, next) => {
    var data = await BASECONTROL.BfindOneAndDelete(POKERROOMMODEL, {_id: req.body._id});
    if (data) {
        this.getRoomList(req, res, next);
        return;
    } else {
        res.json({status: false, data: "Server Error!"});
        return next();
    }
}