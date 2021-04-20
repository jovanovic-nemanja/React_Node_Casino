
const config = require('../db');
const fs = require("fs");
const JSONCONFIG = require("../config/index.json");
const BASECON = require("./basecontroller");
const FIRSTPAGECON = require("../models/firstpage_model");
const SliderIMgModel = FIRSTPAGECON.SliderIMGModel;
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;
const firstpagesetting = FIRSTPAGECON.firstpagesetting;
const FirstpagePaymentMethodImg =FIRSTPAGECON.FirstpagePaymentMethodImg;
const FirstpageProviderImg = FIRSTPAGECON.FirstpageProviderImg;
const firstMenuModel =FIRSTPAGECON.firstMenuModel;

const BASECONTROL = require("./basecontroller");
const USERS = require("../models/users_model");
const sidebarmodel = USERS.profilemenu;

exports.get_sliderimgs = async (req,res,next) =>{
    var bool = parseInt(req.body.data);
    var row = {}
    for(var i = 1 ; i <= bool ; i++){
        var data = await BASECON.BSortfind(SliderIMgModel,{ bool: i},{order : 1});
        row[i] = data;
    }
    res.json({status : true,data : row});
    return next();
}

exports.save_sldierimgs =  async (req,res,next) =>{
    
    var filename = req.files[0].filename;
    var filetype = req.files[0].mimetype.split("/")[1];
    var now_path = config.BASEURL  + filename;
    var new_path = config.BASEURL  + filename + "." + filetype;
    var editdata = req.body;
    var bool  =req.body.bool;
    var newdata = {
        text1  : editdata.text1,
        text2  : editdata.text2,
        text3  : editdata.text3,
        gameitem : editdata.gameitem
    };
    var img = filename + "." + filetype;
    var id  = editdata.gameitem;
    var gameitem = await BASECON.BfindOne(GAMELISTMODEL,{_id : id});
    if(!gameitem){
        res.json({ status:false });
        return next();
    }else{
        newdata['gamedata'] = id;
        fs.rename(now_path , new_path , async function(err){
            if(err){
                res.json({ status:false });
                return next();
            }else{
                if(editdata.addnew == "true"){
                    var result = await BASECON.BSortfind(SliderIMgModel,{bool : bool},{order : 1});
                    var order  = 1;
                    if(result.length > 0){
                        order = result[result.length -1].order+ 1;
                    }
                    var rdata = await BASECON.data_save({order:order ,image: img,data : newdata,bool : bool},SliderIMgModel)
                    if (!rdata) {
                        res.json({ status:false })
                        return next();
                    }else {
                        get_sliderimgs(req,res,next,bool)
                    }
                }else{
                    var _id = editdata._id;
                    var row = {}
                    row['data'] = newdata;
                    row['image'] = img;
                    var uhandle = await BASECON.BfindOneAndUpdate(SliderIMgModel,{_id : _id},row);
                    if(uhandle){
                        get_sliderimgs(req,res,next,bool)
                    }else{
                        res.json({ status:false })
                        return next();
                    }
                }
            }
        })
    }
}

async function get_sliderimgs(req,res,next,bool){
    var data = await BASECON.BSortfind(SliderIMgModel,{ bool: bool},{order : 1});
    if(data){
        res.json({status : true,data : data});
        return next();
    }else{
        res.json({status : false,data : data});
        return next();
    }
}

exports.delete_sldierimgs =  async (req,res,next) =>{
    var data = req.body.data.data;
    var del_path = config.BASEURL + data.image;
    var udelete = await BASECON.BfindOneAndDelete(SliderIMgModel,{_id : data._id });
    if(udelete){
        fs.unlink(del_path, (err)=>{    
            get_sliderimgs(req,res,next,data.bool);
        });
    }else{
        res.json({status : false,data : data});
        return next();
    }
}

exports.update_sldierimgs =  async (req,res,next) =>{
    var data = req.body.data.data;
    for(var i = 0 ; i < data.length ; i++){
        var upHandle = await BASECON.BfindOneAndUpdate(SliderIMgModel,{_id :  data[i]._id},data[i]);
        if(!upHandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    get_sliderimgs(req,res,next,req.body.data.bool);
}

exports.save_logos = async(req,res,next) =>{
    var type = req.body.type;
    var filename =  req.files[0].filename;
    var filetype = type == "appurl" ? "apk" :  req.files[0].mimetype.split("/")[1];
    var now_path = config.BASEURL + filename;
    var new_path =  type == "appurl" ? JSONCONFIG.APKNAME : req.files[0].filename;
    file_upload_acition(now_path,config.BASEURL + new_path + "." + filetype,new_path + "." + filetype,firstpagesetting,type,(rdata)=>{
        if(!rdata){
            res.json({ status: false });
            return next();
        }else{
            res.json({ status: true,data : rdata });
            return next();
        }
    })
}

async function file_upload_acition(now_path,new_path,filename,Model,type,callback){
    var result = await BASECON.BfindOne(Model,{type : type});
    if(result){
        var del_path = config.BASEURL  + result.content;
        fs.unlink(del_path, async(err)=>{
            fs.rename(now_path , new_path,async function(err){
                if(err) {
                    callback(false);
                }else{
                    var rdata = await BASECON.BfindOneAndUpdate(Model,{type : type},{content : filename});
                    if(rdata){
                        callback(rdata);
                    }else{
                        callback(false);
                    }
                }
            })
        });
    }else{
        fs.rename(now_path , new_path,async function(err){
            if(err) {
                callback(false);
            }else{
                var shandle = await BASECON.data_save({type : type,content : filename},Model);
                if(shandle){
                    callback(shandle);
                }else{
                    callback(false)
                }

            }
        })
    }
}

exports.firstpage_load = async (req,res,next) =>{
    var data = await BASECON.Bfind(firstpagesetting);
    var row = {};
    for(var i = 0 ; i < data.length ; i++){
        row[data[i].type] = data[i].content;
    }
    var data1 = await BASECON.Bfind(FirstpagePaymentMethodImg);
    var data2 = await BASECON.Bfind(FirstpageProviderImg);
    row['payment'] = data1;
    row['provider'] = data2;
    res.json({status : true,data : row});
    return next();
}

exports.logoimg_load = async(req,res,next)=>{
    var rdata = await BASECON.BfindOne(firstpagesetting,{type : "logoimg"});
    if(!rdata){
        res.json({status : false})
        return next();
    }else{
        res.json({status : true,data : rdata})
        return next();
    }
}

exports.setting_etc = async (req,res,next) =>{
    var code = req.body.data;
    var Model = firstpagesetting;
    var type = code.type;
    var data = code.data;
    var fhandle = await BASECON.BfindOne(Model,{type : type});
    if(fhandle){
        var uphandle = await BASECON.BfindOneAndUpdate(Model,{type : type},{content : data});
        if(!uphandle){
            res.json({status : false})
            return next();
        }else{
            res.json({status : true,data : uphandle})
            return next();            
        }
    }else{
        var shandle = await BASECON.data_save({type : type,content : data},Model);
        if(!shandle){
            res.json({status : false})
            return next();
        }else{
            res.json({status : true,data : shandle})
            return next();            
        }
    }
}

exports.paymentimg_delete =async(req,res,next)=>{
    var indata = req.body.data;   
    var outdata = null;
    await FirstpagePaymentMethodImg.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var del_path = config.BASEURL + indata.image;
        fs.unlink(del_path, async rdata=>{
            get_provider_paymentimgs(req,res,next,FirstpagePaymentMethodImg)
        });
    }
}

async function get_provider_paymentimgs(req,res,next,Model){
    await Model.find().then(rdata=>{
        if(!rdata){
            outdata = false;
        }else{
            outdata = rdata;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,data : outdata})
        return next();
    }
}

exports.providerimg_delete = async(req,res,next)=>{
    var indata = req.body.data;   
    var outdata = null;
    await FirstpageProviderImg.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var del_path = config.BASEURL + indata.image;
        fs.unlink(del_path, async rdata=>{
            get_provider_paymentimgs(req,res,next,FirstpageProviderImg)
        })
    }
}

exports.upload_provider_paymentimg = async (req,res,next) =>{
    var filename = req.files[0].filename;
    var filetype = req.files[0].mimetype.split("/")[1];
    var now_path = config.BASEURL  + filename;
    var new_path = config.BASEURL  + filename + "." + filetype;
    var bool = req.body.bool;
    fs.rename(now_path , new_path ,async function(err){
        if(err){
            res.json({
                status:false
            })
            return next();
        }else{
            if(bool == "1"){
                var shandle = await BASECON.data_save({image: filename + "." + filetype},FirstpagePaymentMethodImg)
                if (!shandle) {
                    res.json({
                        status:false
                    })
                    return next();
                }else {
                    get_provider_paymentimgs(req,res,next,FirstpagePaymentMethodImg)
                }
            }else{
                var shandle = await BASECON.data_save({image: filename + "." + filetype},FirstpageProviderImg)
                if (!shandle) {
                    res.json({
                        status:false
                    })
                    return next();
                }else {
                    get_provider_paymentimgs(req,res,next,FirstpageProviderImg)
                }
            }
        }
    });
}

exports.upload_apk = async (req,res,next) =>{
    var filename = req.files[0].filename;
    var filetype = req.files[0].mimetype.split("/")[1];
    var now_path = config.BASEURL  + filename;
    var new_path = config.BASEURL  + filename + "." + filetype;
    var bool = req.body.bool;
    fs.rename(now_path , new_path ,async function(err){
        if(err){
            res.json({
                status:false
            })
            return next();
        }else{
            if(bool == "1"){
                var shandle = await BASECON.data_save({image: filename + "." + filetype},FirstpagePaymentMethodImg)
                if (!shandle) {
                    res.json({
                        status:false
                    })
                    return next();
                }else {
                    get_provider_paymentimgs(req,res,next,FirstpagePaymentMethodImg)
                }
            }else{
                var shandle = await BASECON.data_save({image: filename + "." + filetype},FirstpageProviderImg)
                if (!shandle) {
                    res.json({
                        status:false
                    })
                    return next();
                }else {
                    get_provider_paymentimgs(req,res,next,FirstpageProviderImg)
                }
            }
        }
    });
}
//--------------------------------------------
 
exports.save_menu = async (req,res,next)=>{
    var indata = req.body.data;
    var savehandle = await BASECON.data_save(indata,firstMenuModel);
    if(!savehandle){
        res.json({status : false,data : "fail"});
        return next();
    }else{
        this.load_menu(req,res,next)
    }
}

exports.update_menu = async (req,res,next)=>{
    var indata = req.body.data;
    for(var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await data_update(indata[i],firstMenuModel);
        if(!updatehandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    this.load_menu(req,res,next)
}

exports.delete_menu = async(req,res,next)=>{
    var indata = req.body.data;
    var outdata = null;
    await firstMenuModel.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        this.load_menu(req,res,next)
    }
}

exports.load_menu = async (req,res,next)=>{
    var findhandle = "";
    findhandle = await BASECON.BSortfind(firstMenuModel,{bool : req.body.bool},{order : 1});
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,data : findhandle})
        return next();
    }
}

async function data_update(data,model)
{
    var outdata = null;
    await model.findOneAndUpdate({_id : data._id},data).then(rdata=>{
        if(!rdata){
            outdata =false;
        }else{
            outdata = true;
        }
    });
    return outdata;
}





exports.roles_load = async (req,res,next)=>{
    var  roles = await BASECONTROL.Bfind(sidebarmodel);
    if(!roles){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        res.json({status : true,list :roles})
        return next();
    }
}

exports.roles_add = async(req,res,next) =>{ 
    var data = req.body.data;
    var roles = await BASECONTROL.Bfind(sidebarmodel,{pid : data.pid});
    var order = 1;
    if(roles.length > 0){
        order = roles[roles.length-1].order + 1;
    }
    data['order'] = order;    
    var shandle = await BASECONTROL.data_save(data,sidebarmodel);
    if(shandle){
        this.roles_load(req,res,next);

    }else{
        res.json({status : false});
        return next();
    }
}

exports.roles_delete = async(req,res,next) =>{
    var data = req.body.data;
    var ids = await get_deleteids(data.id);
    for(var i = 0 ; i < ids.length ; i++){
        var handel = await BASECONTROL.BfindOneAndDelete(sidebarmodel,{id : ids[i]})
    }
    this.roles_load(req,res,next);
}

async function get_deleteids(id) {
    var data = [];
    async function  fact(pid){
        var child = await BASECONTROL.Bfind(sidebarmodel,{pid : pid});
        if(child.length > 0){
            for(var i = 0 ; i < child.length ; i++){
                data.push(child[i].id);
                await fact(child[i].id);
            }
        }else{
            return;
        }
    }
    await fact(id);
    data.push(id);
    return data;
}



exports.roles_update = async(req,res,next) =>{
    var data = req.body.data;
    var row = {};
    row['title'] = data.title;
    row['navLink'] = data.navLink;
    row['icon'] = data.icon;
    row['status'] = data.status;
    row['roles'] = data.roles;
    row['type'] = data.type;
    var uhandle = await BASECONTROL.BfindOneAndUpdate(sidebarmodel,{id : data.id},row);
    
    if(uhandle){
        this.roles_load(req,res,next);
    }else{ 
        res.json({status : false});
        return next()
    }
}