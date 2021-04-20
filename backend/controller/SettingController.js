const SettingMD = require("../models/settings_model");
const BASECONTROLL =require("./basecontroller");
const ProviderCredential = SettingMD.provider_credential;
const fs =require("fs");
const config = require("../db");
const DB = require("../servers/db.json");
const PROVIDER = require("../servers/provider.json");
const HOME = require("../servers/home.json");
const PAYMENTERROR = require("../config/paymenterror.json");
const PROVIDERMANAGE = require("../config/providermanage.json");
const TYPEMANAGER = require("../config/typemange.json");

exports.get_provider_credential = async (req,res,next) =>{
    var row = Object.assign({},
        {dbconfig : DB},
        {pvconfig : PROVIDER},
        {pmconfig:PAYMENTERROR},
        {hmconfig:HOME},
        {pvmconfig: PROVIDERMANAGE},
        {tymconfig : TYPEMANAGER}
    )
    // var data = await BASECONTROLL.Bfind(ProviderCredential,{});
    if(!row){
        res.json({status : false});
        return next();
    }else{
        res.json({status : true,data : row});
        return next();
    }
}

exports.save_provider_credential =async (req,res,next) =>{
    var ndata = req.body.data;
    var ldata = await BASECONTROLL.BfindOne(ProviderCredential,{launchID : ndata.launchID});
    if(ldata){
        res.json({status : false,data : ""});
        return next();
    }else{
        var sHandle = await BASECONTROLL.data_save(ndata,ProviderCredential);
        if(!sHandle){
            res.json({status : false,data : ""});
            return next();
        }else{
            this.get_provider_credential(req,res,next);
        }
    }
}

exports.update_provider_credential=async (req,res,next) =>{
    var udata = req.body.data;
    var item = req.body.item;
    let data = JSON.stringify(udata);
    switch(item){
        case  "dbconfig" :
            fs.writeFileSync(config.DIR+"/servers/db.json", data,(error)=>{
            });
        break;
        case  "pvconfig" :
            fs.writeFileSync(config.DIR+"/servers/provider.json", data,(error)=>{
            });
        break;
        case  "pmconfig" :
            fs.writeFileSync(config.DIR+"/config/paymenterror.json", data,(error)=>{
            });
        break;
        case  "hmconfig" :
            fs.writeFileSync(config.DIR+"/servers/home.json", data,(error)=>{
            });
        break;
        case  "pvmconfig" :
            fs.writeFileSync(config.DIR+"/config/providermanage.json", data,(error)=>{
            });
        break;
      
        case  "tymconfig" :
            fs.writeFileSync(config.DIR+"/config/typemange.json", data,(error)=>{
            });
        break;
    }
}

exports.delete_provider_credential=async (req,res,next) =>{
    var udata = req.body.data;
    var uphandle = await BASECONTROLL.BfindOneAndDelete(ProviderCredential,{_id : udata._id},udata);
    if(!uphandle){
        res.json({status : false,data : ""});
        return next();
    }else{
        this.get_provider_credential(req,res,next);
    }
}