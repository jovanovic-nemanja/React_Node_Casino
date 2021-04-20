
const BASECONTROL = require("./basecontroller");
const USERS = require("../models/users_model");
const BASECON = require("./basecontroller");
const CONFIG = require("../config/index.json");
const PROCONFIG = require("../servers/provider.json");
const request = require("request");
const parse = require('xml-parser');
const Sendy = require('sendy-api');
const DB = require("../servers/home.json");
const CryptoJS = require("crypto-js");
const PlayersController = require("./playerscontroller");
var mongoose = require('mongoose');
const hex = require('string-hex')
const adminUser = USERS.adminUser;
const themeModel = USERS.get_themeinfor;
const permission_model = USERS.permission_model;
const totalusermodel = USERS.totalusermodel;
const GamePlay = USERS.GamePlay;
const sidebarmodel = USERS.sidebarmodel;
const pokergridApi = USERS.pokergridApi;
const sendy = new Sendy(CONFIG.sendy.url, CONFIG.sendy.api_key);

exports.list_to_tree = (list) =>{
    var map = {}, node, roots = [], i;    
    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.pid !== "0") {
            if(list[map[node.pid]]){ 
                list[map[node.pid]].children.push(node);
                // return;
            }else{
                // return;
            }
            // if you have dangling branches check that map[node.parentId] exists
        } else {
            roots.push(node);
        }
    }
    return roots;
}

async function jwt_regiser(userinfor,req,res,callback){
    var forwarded = req.headers['x-forwarded-for'];
    var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    var ip = ips && ips.length > 0 && ips.indexOf(",") ? ips.split(",")[0] : null;    
    
    var date = (new Date()).valueOf()+'';
    var token = BASECONTROL.md5convert(date);
    const payload = {
        username: userinfor.username,
        firstname : userinfor.firstname,
        lastname : userinfor.lastname,
        fullname : userinfor.fullname,
        email : userinfor.email,
        password : userinfor.password,
        _id : userinfor._id,
        currency : userinfor.currency,
        intimestamp :date,
        token : token,
        role : userinfor.permission
    }

    var auth = BASECON.encrypt(JSON.stringify(payload));
    await BASECONTROL.data_save({email:userinfor.email,ip : ip},totalusermodel);
    callback({
        status : true,
        token : auth,
        data : payload,
        detail : userinfor
    });
}

function xpg_register(username,callback){
    var serverurl = PROCONFIG.xpg.serverurl + "createAccount";
    var password = BASECONTROL.md5convert(username);
    var privatekey = PROCONFIG.xpg.passkey;
    var operatorId = PROCONFIG.xpg.operatorid;
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};// method: 'POST', 'cache-control': 'no-cache', 
    var acpara = {operatorId : operatorId, username : username,userPassword : password,}
    var accessPassword = BASECONTROL.get_accessPassword(privatekey,acpara);
    var  parameter = {accessPassword : accessPassword,operatorId : operatorId,username : username,userPassword : password}        
    request.post(serverurl,{ form : parameter, headers: headers, },async (err, httpResponse, body)=>{
        if (err) {
            callback({status : false});
        }else{
            var xml =parse(body);
            var xmld = xml.root;
            var errorcode = xmld['children'][0]['content'];
            switch(errorcode){
                case "0" :
                    callback(true)
                    break;
                default :
                    callback({status : false});
                break;
            }
        }
    });
}

async function register_action(req,callback){

    var user = req.body.user;
    let device = req.headers["user-device"] === "app" ? true : false;

    let error =  await BASECONTROL.BfindOne(adminUser,{email : user.email });
    if(error){
        callback({status : false, data : "Email is duplicated!"})
        return;
    }
    let error1 = await BASECONTROL.BfindOne(adminUser,{username : user.username});
    if(error1){
        callback({status : false, data : "Username is duplicated!"})
        return;
    }
    let error2 = await BASECONTROL.BfindOne(adminUser,{operatorID : user.operatorID});
    if(error2){
        callback({status : false, data : "Operator ID is duplicated!"})
        return;
    }

    var roles = await BASECONTROL.BfindOne(permission_model,{id : user.permission});
    if(!roles){
        callback({status : false, error : ""});
        return;
    }

    var data = await BASECONTROL.BfindOne(adminUser,{email : user.created});
    user['signup_device'] = device;
    user['created'] = data.permission == CONFIG.USERS.superadmin ? "superweb@gmail.com" : user.created;
    // var _id =  mongoose.Types.ObjectId(hex(BASECONTROL.get_timestamp()+"").slice(0,24));
    // console.log(_id)
    let Newuser = new adminUser(user);
    let Newplayer = new GamePlay(user);
    Newplayer['id'] = Newuser._id;
    Newuser['playerid'] = mongoose.Types.ObjectId(Newuser._id);
    Newuser['permissionid'] = mongoose.Types.ObjectId(roles._id);
    Newplayer['userid'] = mongoose.Types.ObjectId(Newplayer._id);

    Newuser.password = Newuser.generateHash(Newuser.password);

    let U_save = await BASECONTROL.data_save(Newuser,adminUser)
    let P_save = await BASECONTROL.data_save(Newplayer,GamePlay)

    if(U_save && P_save){
        callback({status : true,data:U_save});
    }else{
        callback({status : false,error : ""});
    }

            // xpg_register(user.username,async(creathandle)=>{
            //     if(!creathandle){
            //         callback ({ status : false, data : "This nickname have already registered." })
            //     }else{
                    // signup_subscribe(userdata,async(sdata)=>{
                        // if(!sdata){
                        //     callback ({ status : false, data : "server error" });
                        // }else{
                            // var id =  ObjectId(hex(BASECONTROL.get_timestamp()+"").slice(0,24));
                            // var iddata =await get_max_id();
                            // var userid = iddata.id;
                            // var pid  = iddata.pid;
                            // var register = userdata;
                            // register['password'] = password;
                            // register['_id'] = id;
                            // register['id'] = userid;
                            // register['signup_device'] = device;

                            // var playerregister = {
                            //     username : userdata.username,
                            //     id : id,
                            //     email : userdata.email,
                            //     firstname : userdata.firstname,
                            //     lastname : userdata.lastname,
                            //     pid : pid   
                            // }
                            // var user =await BASECONTROL.data_save(register,adminUser);
                            // if(!user){
                            //     callback ({ status : false, data : "server error" })
                            // }else{
                            //     var playerhandle = await BASECONTROL.data_save(playerregister,GamePlay);
                            //     if(playerhandle){
                            //         callback ({ status : true,data : "success"})
                            //     }else{
                            //         callback ({ status : false,data : "server error"})
                            //     }
                            // }
                        // }
                    // })
            //     }
            // })
        
   
}

exports.get_location = (req,res,next)=>{

    var forwarded = req.headers['x-forwarded-for']
    var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    var ip = ips && ips.length > 0 && ips.indexOf(",") ? ips.split(",")[0] : null;    
    var key = CONFIG.iplocation.key;
    var options = {
        'method': 'GET',
        'url': CONFIG.iplocation.url+'ip='+ip+'&key='+key+'&package='+CONFIG.iplocation.package,
        'headers': {}
    };
    request(options, function (error, response) {
        if (error)
        {
            res.json({
                status : false,
            })
        }else{
            var location = JSON.parse(response.body);
            location['ip'] = ip;
            res.json({
                status : true,
                data : location
            })
            return next();
        }
    });
    return;
}

exports.player_login = async(req,res,next)=>{

    var password = req.body.password;
    var username = req.body.username;
    var error = "";
    var user = await BASECON.BfindOne(adminUser,{$or : [{username : username},{email : username}]});
    if(!user){
        error = "we can't find with this email/username.";
        res.json({status : false,error : error});
        return next();
    }

    if(!user.validPassword(password, user.password)){
        error = "passwords do not match";
        res.json({status: false, error : error});
        return next();
    }

    var device = req.headers["user-device"] === "app" ? true : false;
    if(user.permission != CONFIG.USERS.player ){
        error = "You can't login with this email/username.";
        res.json({status : false,error : error});
        return next();
    }else if (user.isdelete){
        error =  "This email/username was deleted.";
        res.json({status : false,error : error});
        return next();
    }else if (user.status == CONFIG.USERS.status.pending){
        error = "This email/username is pending.";
        res.json({status : false,error : error});
        return next();
    }else if (user.status == CONFIG.USERS.status.block){
        error = "This email/username was blocked.";
        res.json({status : false,error : error});
        return next();
    }else if(device != user.signup_device){
        error = "You can't login with this email/username.";
        res.json({status : false,error : error});
        return next();
    }else{
        var compressed = this.accestoken(user);
        let ip = BASECONTROL.get_ipaddress(req);
        await BASECONTROL.data_save({email:user.email,ip : ip},totalusermodel);
        return res.json({status : true,data:compressed});
    }
}

exports.accestoken = (user) =>{
    let hashstr = { 
        _id : user._id,
        role : user.permission,
    }
    var authstr = BASECON.encrypt(JSON.stringify(hashstr));
    return authstr
}
 
// async function run(){
//     var a=  await adminUser.findOne();
//     console.log(a);
// }

// run()
exports.admin_login = async(req,res,next)=>{

    var password = req.body.password;
    var username = req.body.username;
    var error = "";
    var user = await BASECON.BfindOne(adminUser,{$or : [{username : username},{email : username}]});
    if(!user){
        error = "we can't find with this email/username.";
        res.json({status : false,error : error});
        return next();
    }

    if(!user.validPassword(password, user.password)){
        error = "passwords do not match";
        res.json({status: false, error : error});
        return next();
    }
    var device = req.headers["user-device"] === "app" ? true : false;
    
    if(user.permission == CONFIG.USERS.player ){
            error = "You can't login with this email/username.";
        res.json({status : false,error : error});
        return next();
    }else if (user.isdelete){
            error =  "This email/username was deleted.";
        res.json({status : false,error : error});
        return next();
    }else if (user.status == CONFIG.USERS.status.pending){
        error = "This email/username is pending.";
        res.json({status : false,error : error});
        return next();
    }else if (user.status == CONFIG.USERS.status.block){
        error = "This email/username was blocked.";
        res.json({status : false,error : error});
        return next();
    }else if(device != user.signup_device){
        error = "You can't login with this email/username.";
        res.json({status : false,error : error});
        return next();
    }else{
        var compressed = this.accestoken(user);
        let ip = BASECONTROL.get_ipaddress(req);
        await BASECONTROL.data_save({email:user.email,ip : ip},totalusermodel);
        res.json({status : true,data:compressed});
        return next();
    }
}

exports.player_register = async (req,res,next) =>{
    register_action(req,async(rdata)=>{
        if(rdata.status){
            res.json({status : true ,data : rdata.data});
            return next();
        }else{
            res.json(rdata);
            return next();
        }
    });
}

exports.get_adminthemestyle = async (req,res,next) =>{
    var email = req.body.data;
    var rdata = await BASECONTROL.BfindOne(themeModel,{email : email})
    if(!rdata){
        res.json({status : false,data:"fail"});
        return next();
    }else{
        res.json({status : true,data : rdata});
        return next();
    }
}

exports.save_adminthmestyle = async function(req,res,next){ 
    var outdata = await BASECONTROL.BfindOne(themeModel,{email : req.body.data.email})
    if(!outdata){
        var rdata = await BASECONTROL.data_save(req.body.data,themeModel);
        if(!rdata){
            res.json({
                status : false,
                data : "Fail"
            })
            return next();
        }else{
            res.json({
                status : true,
                data : rdata
            })
            return next();
        }
    }else{
        var rdata = await BASECONTROL.BfindOneAndUpdate(themeModel,{email : req.body.data.email},req.body.data)
        if(!rdata){
            res.json({
                status : false,
                data : "Fail"
            })
            return next();
        }else{
            res.json({
                status : true,
                data : req.body.data
            })
            return next();
        }
    }
}

exports.get_user_detail = async(req,res,next)=>{
    let token = req.body.token;
    var authstr = JSON.parse(BASECON.decrypt(token));
    res.json({status : true,data: req.user,authstr : authstr});
    return next();
}

exports.user_changepassword = async(req,res,next)=>{
    var user = req.body.data;
    user.password =await  BASECONTROL.jwt_encode(user.password);
    var rdata = await BASECONTROL.BfindOneAndUpdate(adminUser,{email : user.email},{password : user.password});
    if(!rdata){
        res.json({
            status : false,
            data : "Email not found"
        })
        return next();
    }else{
        rdata.password = user.password;
        res.json({
            status : true,
            data : await BASECONTROL.jwt_encode(rdata)
        })
        return next();
    }
}

exports.admin_changepassword = async(req,res,next)=>{
    var user = req.body.user;

    var item = await BASECONTROL.BfindOne(adminUser,{email : user.email});
    var currentpassword = user.currentpassword;
    var password = user.password;

    if(!item.validPassword(currentpassword, item.password)){
        error = "passwords do not match";
        res.json({status: false, error : error});
        return next();
    }

    password =  item.generateHash(password);
    var up = await BASECONTROL.BfindOneAndUpdate(adminUser,{email:user.email},{password:password});
    if(up){
        res.json({status : true});
        return next();
    }else{
        res.json({status : false,error: "server error"});
        return next();
    }
};

//////////////---------------email verify ------------------------////////////////////////////
function signup_subscribe(user,callback){
    var domain = null;
    if(user.permission == CONFIG.USERS.player){
        domain = DB.homedomain;
    }else{
        domain = DB.admindomain;
    }
    var init = new Date().valueOf()
    var data = {
        email : user.email,
        permission : user.permission,
        init : init,
    }
    
    var verifyCode = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.USERS.secret_key).toString();
    var verifyString = '<a href="' + domain + CONFIG.USERS.emailverify_url + verifyCode + '" id="kasino9-confirm" target="_blank"><span>Confirm</span> </a>';
    sendy.subscribe({email: user.email, list_id: CONFIG.sendy.list_id1,api_key : CONFIG.sendy.api_key,name : user.username,verify : verifyString}, function(err, result){
        if(err){
            callback(false,err);
        }else{
            callback(true,result);
        }
    });

};



function forgotPassword_sendmail(user,callback){
    var domain = null;
    if(user.permission == CONFIG.USERS.player){
        domain = DB.homedomain;
    }else{
        domain = DB.admindomain;
    }
    var init = new Date().valueOf();
    var data = {
        email : user.email,
        permission : user.permission,
        init : init,
    }
    
    var verifyCode = CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.USERS.secret_key).toString();
    var verifyString = '<a href="' + domain + CONFIG.USERS.forgotpasswordverify_url + verifyCode + '" id="kasino9-confirm" target="_blank"><span>RESET</span> </a>';
    sendy.subscribe({email: user.email, list_id: CONFIG.sendy.list_id2,api_key : CONFIG.sendy.api_key,name : user.username,forgotemailverify : verifyString}, function(err, result){
        if(err){
            callback(false);
        }else{
            callback(true);
        }
    });

};

function unsubscribe(user,listid,callback){
  var params = {
    email: user.email,
    list_id: listid
  }
 
  sendy.unsubscribe(params, function(err, result) {
    if (err){
      callback(false,err)
    }else{
      callback(true,result)
    }
  })
}

exports.emailverify_receive_action =  async (req,res,next)=>{
    var data = req.body.data;
    try{
        var bytes  = CryptoJS.AES.decrypt(data,  CONFIG.USERS.secret_key);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        var fuserdata = await BASECON.BfindOne(adminUser,{email : decryptedData.email,emailverify  :true});
        if(fuserdata.emailverify){
            res.json({status : false,data : "This email already verify"})
        }else{
            var rdata = await BASECON.BfindOneAndUpdate(adminUser,{email : decryptedData.email},{emailverify : true});
            if(rdata){
                jwt_regiser(rdata,req,res,(tdata)=>{
                    res.json(tdata);
                    return next();
                })
            }else{
                res.json({status: false,data : "server error"})
                return next()            
            }
        }
    }catch(e){
        res.json({status: false,data : "server error"})
        return next()
    }
}

exports.forgotpassword_receive_action = async (req,res,next)=>{
    var data = req.body.data;
    try{
        var bytes  = CryptoJS.AES.decrypt(data,  CONFIG.USERS.secret_key);
        var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        var fuserdata = await BASECON.BfindOne(adminUser,{email : decryptedData.email});
        if(fuserdata){
            res.json({status : true,data :fuserdata.email });
            return next();
        }else{
            res.json({status : false,data : "fail"});
            return next();
        }
    }catch(e){
        res.json({status: false,data : "server error"})
        return next()
    }
}

exports.forgotpassword_send_action = async(req,res,next)=>{
    
    var data = req.body.email;
    var fdata = await BASECONTROL.BfindOne(adminUser,{email : data});
    if(fdata){
        unsubscribe(fdata,CONFIG.sendy.list_id2,(rdata)=>{
            forgotPassword_sendmail(fdata,(rdata)=>{
                if(rdata){
                    res.json({status: true});
                    return next();
                }else{
                    res.json({status: false, data : "We are sorry. it bounced email address."});
                    return next();
                }
            })
        })
    }else{
        res.json({status: false,data : "we are sorry. we can't this email"});
        return next();
    }
}

exports.forgotpassword_set_action = async (req,res,next) =>{
    var data = req.body.data;
    var fdata = await BASECONTROL.BfindOne(adminUser,{email : data.email});
    if(fdata){
        var row ={};
        row['password'] = await BASECONTROL.jwt_encode(data.password);
        var fupdate = await BASECONTROL.BfindOneAndUpdate(adminUser,{email : data.email},row);
        if(fupdate){
            jwt_regiser(fupdate,req,res,(tdata)=>{
                res.json(tdata);
                return next();
            })            
        }else{
            res.json({status : false,data : "server error"})
            return next();
        }
    }else{
        res.json({status : false,data : "server error"})
        return next();
    }
}

exports.resend_email_action = async(req,res,next)=>{
    var email = req.body.email;
    var userdata = await BASECON.BfindOne(adminUser,{email : email});
    if(userdata){
        unsubscribe(userdata,CONFIG.sendy.list_id1,(rdata,result)=>{
            signup_subscribe(userdata,(rdata,detail)=>{
                if(!rdata){                        
                    res.json({status : false,data : "Please check your email"})
                    return next();
                }else{
                    res.json({status : true,data : "server error"})
                    return next();
                }
            });
        });
    }else{
        res.json({status : false,data : "This email don't exist"})
        return next();
    }
}

/////////--------------------------roles ----------------
exports.roles_load = async (req,res,next)=>{
    var findhandle = "";
    findhandle = await BASECONTROL.BSortfind(permission_model,{},{order : 1});
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var data = BASECONTROL.array_sort(findhandle,"order")
        res.json({status : true,data : data})
        return next();
    }
}

exports.roles_menusave = async (req,res,next)=>{
    var indata = req.body.data;
    indata['id'] = new Date().valueOf();
    var lastdata = await BASECONTROL.BSortfind(permission_model,{},{order : 1});
    if(!lastdata){
        res.json({status : false,data : "fail"});
        return next();
    }else{
        indata['order'] = lastdata[lastdata.length-1].order  + 1;
        var savehandle = await BASECON.data_save(indata,permission_model);
        if(!savehandle){
            res.json({status : false,data : "fail"});
            return next();
        }else{
            var  findhandle = await BASECONTROL.BSortfind(permission_model,{},{order : 1});       
            if(!findhandle){
                res.json({status : false,data : "fail"})
                return next();
            }else{
                var data = BASECONTROL.array_sort(findhandle,"order")
                res.json({status : true,data : data})
                return next();
            }
        }
    }
}

exports.roles_menuupdate = async (req,res,next)=>{
    var indata = req.body.data;
    for(var i = 0 ; i < indata.length ; i++)
    {
        var updatehandle =  await BASECONTROL.BfindOneAndUpdate(permission_model,{_id : indata[i]._id},indata[i]);
        if(!updatehandle){
            res.json({status : false,data : "fail"});
            return next();
        }
    }
    var  findhandle = await BASECONTROL.BSortfind(permission_model,{},{order : 1});     
    if(!findhandle){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var data = BASECONTROL.array_sort(findhandle,"order")
        res.json({status : true,data : data})
        return next();
    }
}

exports.roles_menudelete = async(req,res,next)=>{
    var indata = req.body.data;
    var outdata = await BASECONTROL.BfindOneAndDelete(permission_model,{_id : indata._id})
    if(!outdata){
        res.json({status : false,data : "fail"})
        return next();
    }else{
        var findhandle = "";
        findhandle = await  BASECONTROL.BSortfind(permission_model,{},{order : 1});     
        if(!findhandle){
            res.json({status : false,data : "fail"})
            return next();
        }else{
            var data = BASECONTROL.array_sort(findhandle,"order")
            res.json({status : true,data : data})
            return next();
        }
    }
}
///////---------------users cms
exports.get_users_items = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECONTROL.Bfind(adminUser,{isdelete : false,created : email});
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECONTROL.Bfind(adminUser,{isdelete : false});
    }else{
        await recurse(role.email);
    }
   
    return data;
}

exports.get_users_items_users = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECONTROL.Bfind(adminUser,{isdelete : false,created : email, permission : {$ne : CONFIG.USERS.player }});
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECONTROL.Bfind(adminUser,{isdelete : false, permission : {$ne : CONFIG.USERS.player }});
    }else{
        await recurse(role.email);
    }
    
    
    return data;
}

exports.get_users_items_block = async(role) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECONTROL.Bfind(adminUser,{status : CONFIG.USERS.status.block });
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }
    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECONTROL.Bfind(adminUser,{status : CONFIG.USERS.status.block});
    }else{
        await recurse(role.email);
    }
  
    return data;
}

exports.get_users_for_permission = async(role,start,end) =>{                 ///////////////-----------------get user items
    var data = [];
    async function recurse(email){
        var rows = await BASECONTROL.Bfind(adminUser,{ $and: [ { "date": { $gte: start } }, { "date": { $lte: end } }, { "permission": CONFIG.USERS.player },{isdelete : false},{created : email} ] });
        // data = rows;
        // return;
        if(rows.length == 0) {
            return;
        } else {
            for(var i = 0 ; i < rows.length ; i++){
                data.push(rows[i]);
                await recurse(rows[i].email);
            }
        }
    }

    if(role.permission == CONFIG.USERS.superadmin){
       data = await BASECONTROL.Bfind(adminUser,{ $and: [ { "date": { $gte: start } }, { "date": { $lte: end } },{isdelete : false}, { "permission": CONFIG.USERS.player }]});
    }else{
        await recurse(role.email);
    }
    
    return data;
}


exports.get_users_load = async (req,res,next) => {
    var role = BASECONTROL.get_useritem_fromid(req)
    var userslist = await this.get_users_items_users(role);
    var data = await this.roles_get_fact(role);
    if(!userslist){
        res.json({
            status : false,
            data: 'failture'
        });
        return next();
    }else{
        res.json({
            status : true,
            data : userslist,roledata : data
        });
        return next();
    }
}


exports.get_users_load_block = async (req,res,next) => {
    var role = BASECONTROL.get_useritem_fromid(req)
    var userslist = await this.get_users_items_block(role);
    var data = await this.roles_get_fact(role);
    if(!userslist){
        res.json({
            status : false,
            data: 'failture'
        });
        return next();
    }else{
        res.json({
            status : true,
            data : userslist,roledata : data
        });
        return next();
    }
}

exports.admin_register = async (req,res,next) =>{

    req.body.user["created"] = req.user.email;
    delete req.body.user._id;

    register_action(req,async(rdata)=>{
        if(rdata.status){
            this.get_users_load(req,res,next);
            return;
        }else{
            res.json(rdata);
            return next();
        }
    });
}

exports.get_rolesfrom_per = async (req,res,next) =>{
    var role = await BASECONTROL.get_useritem_fromid(req)
    var data = await this.roles_get_fact(role);
    if(data){
        res.json({status : true, data : data});
        return next();
    }else{
        res.json({status : false, data : "false"});
        return next();
    }
}

exports.roles_get_fact = async(role) =>{
    var data = [];
    // async function recurse(id){
    //     var rows = await BASECONTROL.Bfind(permission_model,{pid : id});
    //     // data = rows;
    //     // return;
    //     if(rows.length == 0) {
    //         return;
    //     } else {
    //         for(var i = 0 ; i < rows.length ; i++){
    //             data.push(rows[i]);
    //             await recurse(rows[i].id);
    //         }
    //     }
    // }
    // if(role.permission == CONFIG.USERS.superadmin){
        data = await BASECONTROL.Bfind(permission_model,{});
    // }else{
    //     await recurse(role.permission);
    // }
    return data;
}
/////////////////-------------role manger- cms


exports.adminsidebar_load = async (req,res,next) =>{
    var role = req.user.permission;
    var condition = {};
    condition["roles."+role] = true;
    condition['status'] = true;
    var rdata = await BASECONTROL.BSortfind(sidebarmodel, condition,);
    if(rdata){
        var newrow =  this.list_to_tree(rdata)
        res.json({status : true, data: newrow,array: rdata});
        return next();
    }else{
        res.json({status : false,data : []});
        return next();
    }
}

exports.userdetail_save = async(req,res,next)=>{
    var user = req.body.user;
    var rdata = await BASECONTROL.BfindOneAndUpdate(adminUser,{email : user.email},user);
    if(rdata){
        jwt_regiser(rdata,req,res,(returndata)=>{
            res.json(returndata)
            return next();
        })
    }else{
        res.json({
            status : false,
            data : "Email not found"
        })
        return next();
    }
}

exports.adminuser_again = async (req,res,next)=>{


    var indata = req.body.newinfor;
    var row = Object.assign({},{email : indata.email},{firstname : indata.firstname},{lastname : indata.lastname});
    var rdata1 = await BASECONTROL.BfindOneAndUpdate(GamePlay,{id : req.body.newinfor._id},row);
    var rdata = await BASECONTROL.BfindOneAndUpdate(adminUser,{_id : req.body.newinfor._id},req.body.newinfor);

    if(rdata1 && rdata){
        this.get_users_load(req,res,next);
        return;
    }else{
        res.json({ status : false, data: 'failture' });
        return next();
    }
}

exports.adminresetpassword = async (req,res,next)=>{


    var user =  req.body.user;
    if(!user.password || !user.email){
        res.json({ status : false, data: 'failture' });
        return next();
    }        
    var item = await BASECONTROL.BfindOne(adminUser,{email : user.email});
    var password =  item.generateHash(user.password);    
    var rdata = await BASECONTROL.BfindOneAndUpdate(adminUser,{email : user.email},{password : password});
    if(!rdata){
        res.json({ status : false, data: 'failture' });
        return next();
    }else{
        res.json({ status : true });
        return next();   
    }
}

exports.adminmultiusersblock = async (req,res,next)=>{
    
    var users =  req.body.users;
    for (var i in users){
        await BASECONTROL.BfindOneAndUpdate(adminUser,{_id : users[i]._id},{status : CONFIG.USERS.status.block })
    }
    this.get_users_load(req,res,next);
}

exports.adminmultiusersdelete = async (req,res,next)=>{
    
    var users =  req.body.users;
    for (var i in users){
        await BASECONTROL.BfindOneAndUpdate(adminUser,{_id : users[i]._id},{isdelete : true })
    }
    this.get_users_load(req,res,next);
}

exports.Player_register = async(req,res,next)=>{

    req.body.user["created"] = req.user.email;
    delete req.body.user._id;

    register_action(req,async(rdata)=>{
        if(rdata.status){
            PlayersController.players_load(req,res,next);
        }else{
            res.json(rdata);
            return next();
        }
    });
}


exports.users_depositaction = async(req,res,next) =>{
    let ressult =  await PlayersController.deposit_func(req);
    if(ressult.status){
         this.get_users_load(req,res,next);
        return
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.users_withdrawlaction = async(req,res,next) =>{
    let ressult =  await PlayersController.withdrawlfunc(req);
    if(ressult.status){
         this.get_users_load(req,res,next);
        return
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.decrypt_auth = (req,res,next) =>{
    try{
        let data = req.body.auth;
        let decypstr = JSON.parse(BASECON.decrypt(data));
        res.json({ status :true,data :  decypstr});
        return next();
    }catch(e){
        res.status(404,{msg : "BAD request"})
        return next();
    }
}

exports.getip = (req,res,next) =>{
    console.log(req)
    var forwarded = req.headers['x-forwarded-for'];
    var ips = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
    var ip = ips && ips.length > 0 && ips.indexOf(",") ? ips.split(",")[0] : null;    
    res.json({ip:ip});
}

exports.save_pokergrid_api = async (req, res, next) => {
    var s_data = await BASECONTROL.data_save(req.body, pokergridApi);
    if (s_data) {
        res.json({status: true});
        return next();
    } else {
        res.json({status: false, data: "Server error!"})
        return next();
    }
}

exports.load_pokergrid_api = async (req, res, next) => {
    var l_data = await BASECONTROL.BfindOne(pokergridApi, req.body);
    if (l_data) {
        res.json({status: true, data: l_data})
        return next();
    } else {
        res.json({status: false});
        return next();
    }
}

exports.update_pokergrid_api = async (req, res, next) => {
    var u_data = await BASECONTROL.BfindOneAndUpdate(pokergridApi, {id: req.body.id}, req.body);
    if (u_data) {
        res.json({status: true});
        return next();
    } else {
        res.json({status: false, data: "Server error!"})
        return next();
    }
}