const users_model = require("../models/users_model");
const sessionmodel = users_model.sessionmodel;
const gamesessionmodel = users_model.gamesessionmodel;
const balance_histoy = users_model.balance_histoy;
const playersUser = users_model.GamePlay;
const Users = users_model.adminUser;
const totalusermodel = users_model.totalusermodel;
const totalgamesusermodel = users_model.totalgamesusermodel;
const wallethistory = users_model.wallethistory;
const {TransactionsHistory} = require("../models/paymentGateWayModel");
const PAYMENTCONFIG = require("../config/paymenterror.json");
var mongoose = require('mongoose');

const parse = require('xml-parser');
const BASECONTROL = require("./basecontroller");
const request  = require("request");
const BASECONFIG = require("../servers/provider.json");
const HOMECONFIG = require("../servers/home.json");
const MAINCONFIG = require("../config/index.json");
const UsersControl = require("./userscontroller");
const playerlimits = users_model.playerlimit;
const documentModel = require('../models/profile_model').documentModel;
const permission_model = users_model.permission_model;
const DashboardControl = require("./dashboardController");
const Satta_ModelS = require('../models/matka_model');
const BazaarModel = Satta_ModelS.BazaarModel;
const matka_betmodels = Satta_ModelS.matka_betmodels;
const Amount_Type =MAINCONFIG.AMOUNT_TYPE;
const Wallet_Type =MAINCONFIG.WALLET_TYPE;
const GAMELISTMODEL = require("../models/games_model").GAMELISTMODEL;

async function run(){
    var ff = await BASECONTROL.Bfind(balance_histoy);
    for(var i in ff){
        await BASECONTROL.BfindOneAndUpdate(balance_histoy,{_id : ff[i]._id},{createDate : ff[i].date});
    }

}


exports.players_load = async(req,res,next)=>{

    console.time();
    var role = BASECONTROL.get_useritem_fromid(req);
    var userslist = await UsersControl.get_users_items(role);
    var news = [];
    for(var i = 0 ; i < userslist.length ; i++){
        if(userslist[i].permission == MAINCONFIG.USERS.player ){
            news.push(userslist[i]);
        }
    }
    // var roledata = await UsersControl.roles_get_fact(role);
    
    console.timeEnd();
    res.json({
        status : true,
        data : news,
        // roledata : roledata
    });
    return next();
}

exports.get_inactivePlayers = async(req,res,next)=>{
    var role = BASECONTROL.get_useritem_fromid(req);
    var start = BASECONTROL.get_stand_date_first(req.body.start);
    var end = BASECONTROL.get_stand_date_end(req.body.end);
    var userslist = await UsersControl.get_users_items(role);
    var news = [];
    for(var i = 0 ; i < userslist.length ; i++){
        var flag = await BASECONTROL.BfindOne(totalusermodel,{email : userslist[i].email, date :{$gte: start, $lte:end}});
        if(userslist[i].permission == MAINCONFIG.USERS.player && !flag ){
            news.push(userslist[i]);
        }
    }
    res.json({
        status : true,
        data : news
    });
    return next();
}

exports.realtimeusers_load =async (req,res,next) =>{

    var mainuser = BASECONTROL.get_useritem_fromid(req);
    var playerslist = await UsersControl.get_users_items(mainuser);
    var start = BASECONTROL.get_stand_date_first(req.body.start);
    var end = BASECONTROL.get_stand_date_end(req.body.end);
    var indexs = await this.get_index_users(start,end,playerslist)
    var rdata = await BASECONTROL.Bfind(sessionmodel);
    var rows= [];
    for(var i in rdata){
        var item = playerslist.find(obj => obj._id == rdata[i].id);
        if(item){            
            rows.push(item);
        }
    }
    if(!rows){ 
        res.json({
            status : false
        });
        return next();
    }else{
        res.json({
            status : true,
            data : rows,count : indexs
        });
        return next();
    }
}

exports.get_index_users = async (start,end,userlist) =>{
    var webindex = 0;
    var appindex = 0;
    var data = await totalusermodel.aggregate([
        {$match: { $and: [ { "date": { $gte: start ,$lte: end} }]}},
        {$group: { _id: { "email": "$email"}}}])
    if(data.length > 0){
        for(var i in data){
            var email = data[i]._id.email;
            var item = userlist.find(obj=>obj.email === email);
            if(item){
                if( item.signup_device){
                    appindex ++;
                }else{
                    webindex ++;
                }
            }
        }
    }
    return {webindex : webindex,appindex:appindex}
}


exports.get_index_players = async (start,end,userlist) =>{
    var webindex = 0;
    var appindex = 0;
    var data = await totalgamesusermodel.aggregate([
        {$match: { $and: [ { "date": { $gte: start ,$lte: end} }]}},
        {$group: { _id: { "email": "$email"}}}])
    if(data.length > 0){
        for(var i in data){
            var email = data[i]._id.email;
            var item = userlist.find(obj=>obj.email === email);
            if(item){
                if( item.signup_device){
                    appindex ++;
                }else{
                    webindex ++;
                }
            }
        }
    }
    return {webindex : webindex,appindex:appindex}
}

exports.gamesrealtimeusers_load = async (req,res,next) =>{
    var mainuser = BASECONTROL.get_useritem_fromid(req);
    var playerslist = await UsersControl.get_users_items(mainuser);
    var start = BASECONTROL.get_stand_date_first(req.body.start);
    var end = BASECONTROL.get_stand_date_end(req.body.end);
    var indexs = await this.get_index_players(start,end,playerslist)
    var rdata = await BASECONTROL.Bfind(gamesessionmodel);
    var rows = [];
    for(var i in rdata){
        var item = playerslist.find(obj => obj.email == rdata[i].email);
        if(item){
            var row = Object.assign({},rdata[i]._doc,{data : item._doc})
            rows.push(row);
        }
    }

    if(!rows){ 
        res.json({ status : false });
        return next();
    }else{
        res.json({ status : true, data : rows ,count : indexs});
        return next();
    }
}

exports.gamesrealtimeusers_delete = async (req,res,next) =>{
    
    var update = await BASECONTROL.BfindOneAndDelete(gamesessionmodel,{email : req.body.email});
    this.gamesrealtimeusers_load(req,res,next);
}

exports.balances_load= async(req,res,next) =>{
    var rdata = await BASECONTROL.Bfind(playersUser);
    if(!rdata){
        res.json({
            status : false
        })
    }else{
        res.json({status : true,
        data : rdata})
    }

}

exports.deposit_func  = async(req) =>{


    var item = BASECONTROL.get_useritem_fromid(req);

    var inputdata = req.body.data;
    var amount = parseFloat(inputdata.amount);
    var amounttype = inputdata.amounttype;
    var comment = inputdata.comment;
    var cemail = item.email;
    var lastbalance = 0;
    var c_item = await BASECONTROL.BfindOne(playersUser,{email : inputdata.email});
    if (!c_item){
        return({ status : false,data : "we are sorry. Server has some issues"});
    }

    if(amount <= 0){
        return({ status : false,data : "Amount error"});
    }

    var current = 0;

    var order_no = "admin-"+new Date().valueOf();
    var wallets_ = {
        commission:0,
        status :"DEPOSIT",
        roundid :order_no,
        transactionid : order_no,
        LAUNCHURL : "cash",
        GAMEID : "ADMIN",
        USERID : c_item.id,
        credited : amount,
        debited : 0,
        lastbalance : c_item.balance
    }
  
    if(item.permission == MAINCONFIG.USERS.superadmin){ //   // when admin is superadmin ,

        if(amounttype === Amount_Type.BALANCE){
            let up =  await BASECONTROL.email_balanceupdate(inputdata.email,amount,wallets_);
            lastbalance = c_item.balance;
            current = up;
        }else{
            // uphandle = await BASECONTROL.player_Bonusupdatein_Username(amount,username);
            // lastbalance = c_item.bonusbalance;
            // current = uphandle;
        }
    }else{
        var playitem = await BASECONTROL.BfindOne(playersUser,{email : item.email});
        var wallets_2 = {
            commission:0,
            status :"WITHDRAWL",
            roundid :order_no,
            transactionid : order_no,
            LAUNCHURL : "cash",
            GAMEID : "ADMIN",
            USERID : playitem.id,
            credited : amount,
            debited : 0,
            lastbalance : playitem.balance
        }
        
        var balance = playitem.balance;
        var bonusbalance = playitem.bonusbalance;
        if(amounttype === Amount_Type.BALANCE){
            if (balance >= amount){
                // withdrwal admin 
                let up1 =  await BASECONTROL.email_balanceupdate( playitem.email,-1 * amount,wallets_2);  
                // deposit play 
                let up2 =  await BASECONTROL.email_balanceupdate(inputdata.email,amount,wallets_); 
                lastbalance = c_item.balance;
                current = up2;
            }else{
               return({ status : false,data : "6 we are sorry. Your account is  insufficient balance. Please deposit your balance"});
            }
        }else{
            //bonus part

            // if (bonusbalance >= amount){
            //     uphandle =  await BASECONTROL.player_Bonusupdatein_Username( -1 * amount,playitem.username);
            //     uphandle =  await BASECONTROL.player_Bonusupdatein_Username(amount,username);
            //     lastbalance = c_item.bonusbalance;
            //     current = uphandle;
            // }else{
            //    return({ status : false,data : "7 we are sorry. Your account is  insufficient balance. Please deposit your balance"});
            // }
        }
    }

    let row ={};
    row["type"] = "admin";
    row["email"] = inputdata.email;
    row["order_no"] = order_no;
    row["status"] = PAYMENTCONFIG.PaymentStatus_bool.Approve;
    row["amount"] = amount;
    row["wallettype"] = "DEPOSIT";
    row["lastbalance"] = lastbalance;
    row["updatedbalance"] = current;
    row["comment"] = comment;
    row["resultData"] = { createdby : cemail };
    row["userid"] = mongoose.Types.ObjectId(c_item.id);
    
console.log(row);
    let sh = await BASECONTROL.data_save(row,TransactionsHistory);
    if(sh){
        return ({status : true});
    }else{
        return({ status : false,data : "we are sorry. Server has some issues"});
    }
  
}

// admin deposit action
exports.deposit_action = async (req,res,next) =>{
    let ressult =  await this.deposit_func(req,res,next);
    if(ressult.status){
        this.players_load(req,res,next);
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.withdrawlfunc = async (req) =>{

    var item = BASECONTROL.get_useritem_fromid(req);

    var inputdata = req.body.data;
    var amount = inputdata.amount;
    var username = inputdata.username;
    var amounttype = inputdata.amounttype;
    var cemail = item.email;
    var comment = inputdata.comment;
    var lastbalance = 0;
    var current = 0;
    if(amount <= 0){
        return({ status : false,data : "Amount error"});
    }
    var c_item = await BASECONTROL.BfindOne(playersUser,{email : inputdata.email});
    if (!c_item){
        return({ status : false,data : "we are sorry. Server has some issues"});
    }

    var order_no = "admin-"+new Date().valueOf();

    var wallets_ = {
        commission:0,
        status :"WITHDRAWl",
        roundid :order_no,
        transactionid : order_no,
        LAUNCHURL : "cash",
        GAMEID : "ADMIN",
        USERID : c_item.id,
        credited : 0,
        debited : amount,
        lastbalance : c_item.balance
    }

    if(item.permission == MAINCONFIG.USERS.superadmin){

        if(amounttype === Amount_Type.BALANCE){
            uphandle =  await BASECONTROL.email_balanceupdate(inputdata.email,amount * -1,wallets_);
            lastbalance = c_item.balance;
            current = uphandle;
        }else{
            uphandle = await BASECONTROL.player_Bonusupdatein_Username(amount * -1,username);
            lastbalance = c_item.bonusbalance;
            current = uphandle;
        }
    }else{
        var playitem = await BASECONTROL.BfindOne(playersUser,{email : item.email})

        if (!playitem){
            return({ status : false,data : "we are sorry. Server has some issues"});
        } 
        var wallets_2 = {
            commission:0,
            status :"DEPOSIT",
            roundid :order_no,
            transactionid : order_no,
            LAUNCHURL : "cash",
            GAMEID : "ADMIN",
            USERID : playitem.id,
            credited : amount,
            debited : 0,
            lastbalance : playitem.balance
        }

        if(amounttype === Amount_Type.BALANCE){
            uphandle =  await BASECONTROL.email_balanceupdate(playitem.email,amount,wallets_2);
            uphandle =  await BASECONTROL.email_balanceupdate( inputdata.email,amount * -1,wallets_);
            lastbalance = c_item.balance;
            current = uphandle;
        }else{
            uphandle =  await BASECONTROL.player_Bonusupdatein_Username( amount,playitem.username);
            uphandle =  await BASECONTROL.player_Bonusupdatein_Username(amount * -1,username);
            lastbalance = c_item.bonusbalance;
            current = uphandle;
        }
    }
    
    let row ={};
    row["type"] = "admin";
    row["email"] = inputdata.email;
    row["order_no"] = order_no;
    row["status"] = PAYMENTCONFIG.PaymentStatus_bool.Approve;
    row["amount"] = amount;
    row["wallettype"] = "WITHDRAWL";
    row["lastbalance"] = lastbalance;
    row["updatedbalance"] = current;
    row["comment"] = comment;
    row["resultData"] = { createdby : cemail };
    row["userid"] = mongoose.Types.ObjectId(c_item.id);
    
    let sh = await BASECONTROL.data_save(row,TransactionsHistory);
    if(sh){
        return ({status : true});
    }else{
        return({ status : false,data : "we are sorry. Server has some issues"});
    }
}

exports.withdrawl_action = async (req,res,next) =>{
    let ressult =  await this.withdrawlfunc(req,res,next);
    if(ressult.status){
        this.players_load(req,res,next);
    }else{
        res.json({ status : false,data : ressult.data});
        return next();
    }
}

exports.multiblock_action = async (req,res,next) =>{
 
    var users =  req.body.users;
    for (var i in users){
        await BASECONTROL.BfindOneAndUpdate(Users,{email : users[i].email},{status : MAINCONFIG.USERS.status.block })
    }
    this.players_load(req,res,next);        
}

exports.playerupdate_action = async (req,res,next) =>{

    var indata = req.body.users;
    var row = Object.assign({},{email : indata.email},{firstname : indata.firstname},{lastname : indata.lastname});
    var rdata1 = await BASECONTROL.BfindOneAndUpdate(playersUser,{id : indata._id},row);
    var rdata = await BASECONTROL.BfindOneAndUpdate(Users,{_id :indata._id},req.body.users);
    if(!rdata){
        res.json({
            status : false,
            data: 'failture'
        });
        next();
    }else{
        this.players_load(req,res,next);
    }

}

exports.profile_userupdate = async (req,res,next) =>{

    var indata = req.body.users;
    var row = Object.assign({},{firstname : indata.firstname},{lastname : indata.lastname});
    var rdata1 = await BASECONTROL.BfindOneAndUpdate(playersUser,{id : indata._id},row);
    var rdata = await BASECONTROL.BfindOneAndUpdate(Users,{_id :indata._id},req.body.users);
    if(rdata && rdata1){
        res.json({status : true,data :rdata });
        return next();
    }else{
        res.json({ status : false, data: 'failture' });
        return next();
    }
}

exports.profile_userload = async (req,res,next) =>{

    var indata = req.body.user;
    var rdata = await BASECONTROL.BfindOne(Users,{email : indata})
    if(!rdata){
        res.json({ status : false, data: 'failture' });
        return next();
    }else{
        res.json({status : true,data :rdata });
        return next();
    }

}

exports.playerresetpass_action = async (req,res,next)=>{
    
    var user =  req.body.user;
    if(!user.password || !user.email){
        res.json({ status : false, data: 'failture' });
        return next();
    }        
    var item = await BASECONTROL.BfindOne(Users,{email : user.email});
    var password =  item.generateHash(user.password);    
    var rdata = await BASECONTROL.BfindOneAndUpdate(Users,{email : user.email},{password : password});
    if(!rdata){
        res.json({ status : false, data: 'failture' });
        return next();
    }else{
        res.json({ status : true });
        return next();   
    }
    // this.players_load(req,res,next);

}

exports.balance_history_load = async (req,res,next) =>{
    var wallettype = req.body.wallettype;
    var date = req.body.dates;
    
    var start = BASECONTROL.get_stand_date_first(date[0]);
    var end = BASECONTROL.get_stand_date_end(date[1]);
    var role =await BASECONTROL.get_useritem_fromid(req)
    var userslist = await UsersControl.get_users_items(role);
    var resdata = [];

    for(var i in userslist){
        let rdata = await BASECONTROL.BSortfindPopulate(TransactionsHistory,{ createDate :{$gte: start, $lte:end},email:userslist[i].email,type :"admin",wallettype : wallettype},{createDate : -1},"userid");
        resdata = [...resdata,...rdata];
    }

    resdata.sort(function(resdata,b){
        return new Date(b.createDate) - new Date(resdata.createDate)
    })

    res.json({status : true, data : resdata});
    return next();
    
}

exports.kickPlayerFromGames_action = async(req,res,next) =>{
    
}

exports.getaccount = async (req,res,next) =>{
    var status = await BASECONTROL.BfindOne(playersUser,{email : req.body.data});
    if(!status){
        res.json({ 
            data : status,
            status : false
        })
        return next();
     }else{
         res.json({
             data : status,
             status : true
         })
         return next();
    }
}

exports.get_guestgameaccount =async(req,res,next)=>{
     var gamedata = req.body.game;
     var width = req.body.width
     guset_launch_url(gamedata,width,(rdata)=>{
         if(rdata.status){
             res.json({
                 status : true,data : rdata.data
             });
             return next();
         }else{
             res.json({
                 status : false,data : rdata.data
             });
             return next();
         }
     })
}

exports.get_realgameaccount =async(req,res,next)=>{
     var user = req.body.user;
     var width = req.body.width
     var gamedata = req.body.game;
     var limits = req.body.limits;
     var playaccount = await get_gameaccount(req,limits);
     if(!playaccount.status){
         res.json({status : false,data : playaccount.data,bool : playaccount.bool});
         return next();
     }else{
         var account = playaccount.data;
         var newtoken = await make_token(account);        
         get_launch_url(account,gamedata,newtoken,width,limits,async(rdata)=>{
             if(rdata.status){
                // var finhandle = await BASECONTROL.BfindOne(gamesessionmodel,{email : newtoken.email});
                // if(finhandle){
                    var uhandle = await BASECONTROL.BfindOneAndUpdate(gamesessionmodel,{email : newtoken.email},newtoken);
                    console.log(uhandle)
                    if(uhandle){
                        res.json({
                            status : true,data : {url : rdata.url,token : newtoken}
                        });
                        return next();
                    }else{
                        // res.json({status : false,data : "You cannot bet Simultaniously "});
                        res.json({status : false,data : "You cannot bet Play",bool : 0});
                        return next();
                    }
                // }else{
                //     var savehandle =  await BASECONTROL.data_save(newtoken,gamesessionmodel);
                //     if(!savehandle){
                //         res.json({status : false,data : "You cannot bet Play",bool : 0});
                //         return next();
                //     }else{
                //         res.json({
                //             status : true,data : {url : rdata.url,token : newtoken}
                //         });
                //         return next();
                //     }
                // }
             }else{
                 res.json({status : false,data : rdata.data,bool : 0});
                 return next();
             }
         });
 
     }
}
 
async function get_launch_url(account,gamedata,token,width,limits,callback){
     var LAUNCH_FLAG = gamedata.LAUNCHURL;
     console.log("---------------------LAUNCH_FLAG",LAUNCH_FLAG)
     var usersdata = await BASECONTROL.BfindOne(Users,{email: account.email});
     var currency = usersdata.currency == "" ? "INR" : usersdata.currency;
     switch(LAUNCH_FLAG){
         case "1" :{
            
            //  var url = BASECONFIG.betsoft.real+"bankId="+BASECONFIG.betsoft.bankId+"&gameId="+gamedata.ID+"&mode=real&token="+token.token+"&lang=en&homeUrl="+HOMECONFIG.homedomain;
            //betsoft
             var url =  "https://2vivo.com/FlashRunGame/RunRngGame.aspx?" + 
             "Token=" + token.token +
             "&GameID=" + gamedata.ID +
             "&OperatorId=" +BASECONFIG.vivo.operatorid +
             "&lang=EN" + 
             "&cashierUrl=" + HOMECONFIG.homedomain + 
             "&homeUrl=" + HOMECONFIG.homedomain;
             callback({status : true,url : url})
             break;
         }
         case "2" :{
             //xpg
             xpg_token(account,gamedata,(rdata)=>{
                 callback(rdata);
             });
             break;
         }
 
         case "3" :{
             //ezugi
             var  url = BASECONFIG.ezugi.url+"token="+token.token+"&operatorId="+BASECONFIG.ezugi.operatorId+"&language=en&clientType=html5&openTable="+ gamedata.ID +"&homeUrl="+HOMECONFIG.homedomain
             callback({status : true,url : url})
             break;
         }
 
         case "4" :{
             //vivo
             // var gametypes = {
             //     1 : "Roulette",
             //     2 : "Baccarat",
             //     3 : "Blackjack",
             //     4 : "Poker"
             // }
             var gametypes = {
                "Roulette":"roulette",
                "Baccarat":"baccarat",
                "Blackjack":"blackjack",
               "Poker":"casinoholdem"
            }
             var select_game = gametypes[gamedata.TYPE];
            var limitIds = gamedata.WITHOUT;
            
            if(limitIds.Mojos){
                var url = BASECONFIG.vivo.url2+
                "tableguid="+limitIds.tableguid+
                "&token=" +token.token +
                "&OperatorId="+BASECONFIG.vivo.operatorid+
                "&language=en"+
                "&cashierUrl="+HOMECONFIG.homedomain+
                "&homeURL="+HOMECONFIG.homedomain +
                "&currency="+currency +
                "&GameID=" + limitIds.gameid+
                "&mode=real"+
                "&operatorToken=" + limitIds.operatorToken+
                "&gametype=live&host=https://de-lce.svmsrv.com";
                callback({status : true,url : url})
            }else{
                var limitId = limits ? limits.limitId : "";
                var  url = BASECONFIG.vivo.url+
                    "token="+token.token+
                    "&operatorid="+BASECONFIG.vivo.operatorid+
                    "&language=EN"+
                    "&serverid="+BASECONFIG.vivo.serverid+
                    "&modeselection=3D" +
                    "&responsive=true"+
                    "&isgamelauncher=true"+
                    "&isinternalpop=false" +
                    "&isswitchlobby=true"+
                    "&securedomain=true"+
                    "&tableid="+gamedata.ID+
                    "&limitid="+limitId+
                    "&application="+select_game+
                    "&homeurl="+HOMECONFIG.homedomain;
                    callback({status : true,url : url})
                }
                break;
         }
 
         case "5" :{
             //wac
             // https://pi-test.njoybingo.com/game.do?token=934fc6cc086a0bba00a8fe9bda626de2&pn=kasino9&lang=en&game=1X2-8008&type=CHARGED
             var url = BASECONFIG.wac.url + "token="+token.token+"&pn="+ BASECONFIG.wac.pn + "&lang=en&game="+ gamedata.ID+"&type=CHARGED";
            callback({status : true,url : url});
            break;
         }

        case "6" : {
            var clientPlatform = width < 768 ?  "mobile" : "desktop";
            var mode = gamedata.mode ? "0" : "1";
            var hashstring = token.token+gamedata.ID+HOMECONFIG.homedomain+mode+"enmaster"+clientPlatform+HOMECONFIG.homedomain+BASECONFIG.xpress.hashkey;
             var hash = BASECONTROL.md5convert(hashstring);
             var url = BASECONFIG.xpress.url + 
             "token="+token.token + 
             "&game=" + gamedata.ID + 
             "&backurl="+HOMECONFIG.homedomain+
             "&mode="+ mode +
             "&language=en"+
             "&group=master"+
             "&clientPlatform="+clientPlatform +
             "&cashierurl="+HOMECONFIG.homedomain+
             "&h="+hash;
             callback({status : true,url : url});
             break;
        }
        case "7" :{
            var URL = BASECONFIG.betgames.url +
            "/ext/client/index/" + BASECONFIG.betgames.apicode +
            "/" + token.token + 
            "/" + "en" +
            "/" + "0" + 
            "/" + "0" + 
            "/" + gamedata.ID + 
            "/" + "india" + 
            "?" + HOMECONFIG.homedomain;
            callback({status : true,url : URL});
            break;
        }

        case "8" : {
            var clientPlatform = width < 768 ?  "1" : "0";
            var URL = BASECONFIG.MySlotty.URL + 
            "action=" + "real_play" +
            "&secret=" + BASECONFIG.MySlotty.RPCSecret +
            "&game_id=" + gamedata.ID +
            "&player_id=" + account.id +
            "&currency=" + currency +
            "&mobile=" + clientPlatform;

            var options = {
                'method': 'GET',
                'url': URL,
                'headers': {
                }
              };
              request(options, function (error, response) {
                if (error) {
                    callback({status : false,data : "We are sorry. You can't play"});                
                } else{
                    var outdata = JSON.parse(response.body);
                    if (outdata.status != 200){
                        callback({status : false,data : outdata.message});
                    }else{
                        var game_url = outdata.response.game_url;
                        callback({status : true,url : game_url});
                    }
                }
            });
            break;
        }
        case "9" : {
            var projectid = BASECONFIG.EVOPLAY.projectId;
            var signature = BASECONTROL.md5convert(projectid + "*" + "1" +"*" + token.token +"*" +gamedata.ID + "*" +  account.id + ":" + 
            HOMECONFIG.homedomain + ":" + HOMECONFIG.homedomain + ":" + "en" + ":" + "1" + "*" + "1" + "*" + currency + "*" + "1" + "*" + "2" + "*" + BASECONFIG.EVOPLAY.secret_key);
            var url = BASECONFIG.EVOPLAY.getURL + 
            "project=" + projectid +
            "&version=1" + 
            "&signature=" + signature +
            "&token=" + token.token +
            "&game=" + gamedata.ID +
            "&settings[user_id]=" + account.id +
            "&settings[exit_url]=" + HOMECONFIG.homedomain +
            "&settings[cash_url]=" + HOMECONFIG.homedomain +
            "&settings[language]=" + "en" +
            "&settings[https]=" + "1" +
            "&denomination=" + "1" +
            "&currency=" + currency +
            "&return_url_info=" + "1" +
            "&callback_version=" + "2";
            var options = {
                'method': 'GET',
                'url': url,
                'headers': { }
              };
            request(options, function (error, response) {
                if (error) {
                    callback({status : false,data : "We are sorry. You can't play"});
                }else{
                    var rdata = JSON.parse(response.body);
                    if (rdata.status == "ok"){
                        callback({status : true,url : rdata.data.link});
                    }else{
                        callback({status : false,data : rdata.error.message});
                    }
                }
              });
            break;              
        }
        case "10" : {
            var url =  BASECONFIG.winnerpoker.URL+
            "token="+token.token +
            "&operator="+BASECONFIG.winnerpoker.operator + 
            "&gameid=" + gamedata.ID;
            callback({status : true,url : url})
        }

        case "12" : {
            var host = gamedata.WITHOUT.casino ? "host=https://demo-slots-engine.7mojos.com" : "host=https://demo-live-casino-engine.7mojos.com";
            var gametype = gamedata.WITHOUT.casino ? "slots" : "live";
            var url = "https://demo-games.7mojos.com?" + host +
            "&gameType=" + gametype +
            "&gameToken=" + gamedata.WITHOUT.gameToken +
            "&playerToken=" +  token.token +
            "&operatorToken=d61ae8587d034c1cbf6578f3714b23eb";
            console.log(url);
            callback({status : true,url : url});
        }
    }
}
 
async function make_token(account){
    var row = {};
    row['intimestamp'] = (new Date()).valueOf();
    row['id'] = account.id;
    row['username'] = account.username;
    row['email'] = account.email;
    row['currency'] = account.currency;
    row['lastname'] = account.lastname;
    row['firstname'] = account.firstname;
    var token = BASECONTROL.md5convert(JSON.stringify(row));
    row['token'] = token;
    await BASECONTROL.data_save({email:account.email},totalgamesusermodel);    
    return row;
}
 
function xpg_token(rdata,game,callback){
    var username =rdata.username;
    var accessPassword = "";
    var registerToken ="";
    var serverurl = BASECONFIG.xpg.serverurl + "registerToken";
    var parameter = "";
    var privatekey = BASECONFIG.xpg.passkey;
    var operatorId = BASECONFIG.xpg.operatorid;
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};// method: 'POST', 'cache-control': 'no-cache', 
    var ap_para  = '';
    ap_para = {
        operatorId : operatorId,
        username : username,
        props : ""
    } 
    accessPassword = BASECONTROL.get_accessPassword(privatekey,ap_para);
    parameter = {
        accessPassword : accessPassword,
        operatorId : operatorId,
        username : username,
        props : ""
    }
    request.post(serverurl,{ form : parameter, headers: headers, },async (err, httpResponse, body)=>{
        if (err) {
            callback({status : false});
        }else{
            var xml =parse(body);
            var xmld = xml.root;
            var errorcode = xmld['children'][0]['content'];
            switch(errorcode){
                case "0" :
                    var registerToken = xmld['children'][1]['content'];
                    // var Security = BASECONTROL.md5convert(privatekey+"operatorId="+operatorId+"&loginToken="+registerToken);
                    // var SecurityCode = Security.toLocaleUpperCase();
                    var livecasino_url_ = BASECONFIG.xpg.url+'operatorId='+operatorId+'&token='+registerToken+'&username='+username+'&gameId='+game.ID+'&gameType='+game.TYPE +"&limitId="+game.WITHOUT.limitId+'&DefaultCategory=Roulette';
                    callback({status : true,url : livecasino_url_});
                break;
                default :
                callback({status : false});
                break;
            }
        }    
    });
}
 
async function get_gameaccount(req,limits){
    var reqdata = req.body;
    var user = reqdata.user;
    var limitMinvalue = limits && limits.limitMin ? limits.limitMin : 50;
    var rdata = await BASECONTROL.BfindOne(playersUser,{email : user.email});
    if(rdata){ 
        if(rdata.balance > limitMinvalue){
            return {status : true,data : rdata} 
        }else{
            return {status : false,data : "please deposit",bool : 1}
        }
    }else{
        return {status : false,data : " server error",bool : 0}
    }
}

function guset_launch_url(gamedata,width,callback){
    var LAUNCH_FLAG = gamedata.LAUNCHURL;
    switch(LAUNCH_FLAG){
        case "1" :{
            var url = BASECONFIG.betsoft.guest+"bankId="+BASECONFIG.betsoft.bankId+"&gameId="+gamedata.ID+"&lang=en&homeUrl="+HOMECONFIG.homedomain;
            callback({status : true,data : url})
            break;
        }
        case "5" :{
            //wac
            // https://pi-test.njoybingo.com/game.do?token=934fc6cc086a0bba00a8fe9bda626de2&pn=kasino9&lang=en&game=1X2-8008&type=CHARGED
            var url = BASECONFIG.wac.url + "token=934fc6cc086a0bba00a8fe9bda626de2&pn="+ BASECONFIG.wac.pn + "&lang=en&game="+ gamedata.ID+"&type=FREE";
            callback({status : true,data : url});
            break;
        }

        case "6" : {
            var clientPlatform = width < 768 ?  "mobile" : "desktop";
            var mode = "0";
            var hashstring = gamedata.ID+HOMECONFIG.homedomain+mode+"enmaster"+clientPlatform+HOMECONFIG.homedomain+BASECONFIG.xpress.hashkey;
             var hash = BASECONTROL.md5convert(hashstring);
             var url = BASECONFIG.xpress.url + 
             "token="+ 
             "&game=" + gamedata.ID + 
             "&backurl="+HOMECONFIG.homedomain+
             "&mode="+ mode +
             "&language=en"+
             "&group=master"+
             "&clientPlatform="+clientPlatform +
             "&cashierurl="+HOMECONFIG.homedomain+
             "&h="+hash;
             callback({status : true,data : url});
             break;
        }

        case "7" :{
            var URL = BASECONFIG.betgames.url +
            "/ext/client/index/" + BASECONFIG.betgames.apicode +
            "/" + "-" + 
            "/" + "en" +
            "/" + "0" + 
            "/" + "0" + 
            "/" + gamedata.ID + 
            "/" + "india" + 
            "?" + HOMECONFIG.homedomain;
            callback({status : true,data : URL});
            break;
        }

        case "8" : {
            if ( gamedata.WITHOUT.is_demo_supported){
                var url = gamedata.WITHOUT.demo_url
                callback({status : true,data : url});
            }else{
                callback({status : false,data : "We are sorry . Demo is not supported"});
            }
            break;
        }        
        
        default :{
            callback({status : false,data : "We are sorry You can't play"})
            break;
        }
    }
}

exports.get_kycmenuLoad = async(req,res,next)=>{
    var status =req.body.status;
    var rdata = await BASECONTROL.Bfind(documentModel,{status : status});
    var role = BASECONTROL.get_useritem_fromid(req)
    var userslist = await UsersControl.get_users_items(role);
    var rows = [];
    for(var i = 0 ; i < rdata.length ; i++){
        var item = userslist.find(obj=>obj.email == rdata[i].email);
        if(item){
            rows.push(rdata[i])
        }
    }
    if(!rdata){
        res.json({status : false});
        return next();
    }else{
        res.json({status : true,data : rows})
        return next();
    }
}

exports.update_kycmenu = async(req,res,next)=>{
    var bool = req.body.data.bool;
    var email = req.body.data.email;
    var rdata =await BASECONTROL.BfindOneAndUpdate(documentModel,{email : email},{status : req.body.data.bool})
    if(!rdata){
        res.json({status : false});
        return next();
    }else{
        if(bool == "2"){
            var udata = await BASECONTROL.BfindOneAndUpdate(Users,{email : email},{idverify : true });
            if(!udata){
                res.json({status : false});
                return next();
            }else{
               this.get_kycmenuLoad(req,res,next) 
            }
        }else{
            this.get_kycmenuLoad(req,res,next)             
        }
    }
}

exports.playerlimit_load = async (req,res,next) =>{
    var news = await BASECONTROL.Bfind(playerlimits);
    res.json({ status : true, data : news });
    return next();
}

exports.get_playerlimit = async(req,res,next)=>{
    var role = BASECONTROL.get_useritem_fromid(req);
    var userslist = await UsersControl.get_users_items(role);
    for(var i = 0 ; i < userslist.length ; i++){
        if(userslist[i].permission === MAINCONFIG.USERS.player){
            var data = await BASECONTROL.BfindOne(playerlimits,{email : userslist[i].email});
            if(data){
                // var row= Object.assign({},userslist[i]._doc ? userslist[i]._doc : userslist[i] ,data._doc ? data._doc : data);
                // news.push(row)
            }else{
                var newrow = {daylimit : MAINCONFIG.USERS.daylimit,
                    weeklimit : MAINCONFIG.USERS.weeklimit,
                    email : userslist[i].email,
                    monthlimit :MAINCONFIG.USERS.monthlimit ,
                    userid : userslist[i]._id
                }
                var shandle = await BASECONTROL.data_save(  newrow,playerlimits);
                // var row = Object.assign({},
                //     userslist[i]._doc ? userslist[i]._doc : userslist[i] ,
                //     {daylimit : MAINCONFIG.USERS.daylimit},
                //     {weeklimit : MAINCONFIG.USERS.weeklimit},
                //     {monthlimit :MAINCONFIG.USERS.monthlimit }
                // );
                // news.push(row);
            }

        }
    }

    this.playerlimit_load(req, res,next);
    // if(!news){ 
    //     res.json({ status : false });
    //     return next();
    // }else{
    //     res.json({ status : true, data : news });
    //     return next();
    // }
}

exports.update_playerlimit = async(req,res,next)=>{
    var email = req.body.data.email;
    var data = await BASECONTROL.BfindOneAndUpdate(playerlimits,{email : email},req.body.data);
    if(!data){
        res.json({status :false});
        return next()
    }else{
        this.playerlimit_load(req, res,next);
    }
}

exports.get_wallet_mainuser = async (req,res,next) =>{
    var total = {};
    var u_item = req.body.user;
    if(!u_item){
        u_item = req.user;
    }
    var user = await BASECONTROL.BfindOne(Users,{email: u_item.email});
    var start = BASECONTROL.get_stand_date_first(req.body.startDate);
    var end = BASECONTROL.get_stand_date_end(req.body.endDate);
    var mainuser =await BASECONTROL.get_useritem_fromid(req);
    var playerslist = await UsersControl.get_users_items(user);
    var betsinfor = await get_betting_infor(playerslist,start,end);
    total = await DashboardControl.get_revenue_from_user(user,start,end);
    var matka = await this.get_bazaars_revenus(playerslist,start,end);
    total = Object.assign(total,{matka : matka});
    var positiontaking = parseInt(user.positiontaking);
    var c_pos_tak = positiontaking > 0 && positiontaking < 100 ? (100 - positiontaking) : 0;
    total = Object.assign(total,{BET : betsinfor.BET - betsinfor.CANCELED_BET,WIN : betsinfor.WIN,positiontaking : c_pos_tak,betindex : betsinfor.betindex})
 
    await balance_histoy.aggregate([
        {$match: { $and: [{amounttype : 1},{cemail : mainuser.email},{email : user.email},{ "createDate": { $gte: start } }, { "createDate": { $lte:end} },]}},
        {$group: { _id: null, AMOUNT: {$sum: '$amount'},}},
    ]).then(rdata =>{
        if(rdata.length > 0){
            total = Object.assign(total,{receive : rdata[0].AMOUNT})
        }else{
            total = Object.assign(total,{receive : 0})
        }
    });

    await balance_histoy.aggregate([
        {$match: { $and: [{amounttype : 1},{cemail :  user.email},{ "createDate": { $gte: start } }, { "createDate": { $lte:end} },]}},
        {$group: {_id: null,AMOUNT: {$sum: '$amount'},}},
        ]).then(rdata =>{
            if(rdata.length > 0){
                total = Object.assign(total,{given : rdata[0].AMOUNT})
            }else{
                total = Object.assign(total,{given : 0})
            }
    });

    await balance_histoy.aggregate([
        {$match: { $and: [{amounttype : 2},{cemail :  user.email},{ "createDate": { $gte: start } }, { "createDate": { $lte:end} },]}},
        {$group: {_id: null,AMOUNT: {$sum: '$amount'},}},
        ]).then(rdata =>{
            if(rdata.length > 0){
                total = Object.assign(total,{withdrawls : rdata[0].AMOUNT})
            }else{
                total = Object.assign(total,{withdrawls : 0})
            }
    });
    res.json({status : true,data :total })
    return next();

    async function get_betting_infor(userslist,start,end){
        var ddd =  DashboardControl.get_Months(start,end);
        var array = [];
        for(var i in userslist){
            for(var j = 0;  j < ddd; j++){
                await DashboardControl.BettingHistory_model( DashboardControl.get_bettingtable_prefix(start,j)).find({ $and: [ { "DATE": { $gte: start } }, { "DATE": { $lte:end} },{USERID : userslist[i]._id}] }).then(async betts=>{
                    array.push(betts);
                });
            }
        }
        var betindex =0;
        var totalbets = {BET : 0,WIN : 0,CANCELED_BET: 0};
        for(var i in array){
            for(var j in array[i]){
                betindex ++;
                totalbets[array[i][j].TYPE] += array[i][j].AMOUNT ? array[i][j].AMOUNT : 0 ;
            }
        }
        totalbets = Object.assign({},totalbets,{betindex : betindex})
        return totalbets
    }
}

exports.get_bazaars_revenus = async (userslist,start,end) =>{

    var datas = await BASECONTROL.Bfind(BazaarModel,{status : true});
    var row = {}
        for(var j in datas){
            if(!row[datas[j].bazaartype]){
                row[datas[j].bazaartype] = {
                    BET : 0,
                    WIN : 0,
                    COUNT : 0,
                    PROFIT : 0
                };
            }else{

            }
            let bet = 0;
            let win = 0;
            let count = 0;
            for(var k in userslist){
                var dd = await BASECONTROL.Bfind(matka_betmodels,{USERID : userslist[k]._id,bazaarid : datas[j]._id, $or : [{status : "2"},{status : "1"}] ,"DATE": { $gte: start ,$lte:end}});
                count += dd.length;
                if(dd.length > 0){
                    for(var i in dd){
                        bet += dd[i].amount;
                    }
                }

                dd = await BASECONTROL.Bfind(matka_betmodels,{USERID : userslist[k]._id,bazaarid : datas[j]._id,status : "3","DATE": { $gte: start ,$lte:end}});
                count += dd.length;
                if(dd.length > 0){
                    for(var i in dd){
                        win += dd[i].amount;
                    }
                }
            }

            row[datas[j].bazaartype].BET += bet;
            row[datas[j].bazaartype].WIN += win;
            row[datas[j].bazaartype].COUNT += count;
        }
        
        for(var i  in row){
            row[i].PROFIT = row[i].BET - row[i].WIN;
        }
        return row;
}

exports.get_wallet_profit = async (req,res,next) =>{
    let data = req.body;
    let user = req.body.user;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);
    var deposit1=  await balance_histoy.aggregate([
        {$match: { $and: [ {email:user.email,status:"success",type : PAYMENTCONFIG.WalletType.Deposit, "createDate": { $gte: start ,$lte: end} }]}},
        {$group: { _id: { "email": "$email"}, AMOUNT: {$sum: '$amount'},}}]);
    var withdrawl1 =  await balance_histoy.aggregate([
        {$match: { $and: [ {email:user.email,status:"success",type : PAYMENTCONFIG.WalletType.Withdrawl , "createDate": { $gte: start ,$lte: end}}]}},
        {$group: { _id: { "email": "$email"}, AMOUNT: {$sum: '$amount'},}}]);
    var deposit2 =  await TransactionsHistory.aggregate([
        {$match: { $and: [ {email:user.email,status : PAYMENTCONFIG.WalletType_STRING.Deposit , "createDate": { $gte: start ,$lte: end}}],
            $or: [{'resultData.status': "2"}, {"resultData.status": 'APPROVED'}] }},
        {$group: { _id: { "email": "$email"}, AMOUNT: {$sum: '$amount'},}}]);
    var withdrawl2 =  await TransactionsHistory.aggregate([
        {$match: { $and: [ {email:user.email,status : PAYMENTCONFIG.WalletType_STRING.Withdrawl , "createDate": { $gte: start ,$lte: end}}],
            $or: [{'resultData.status': "2"}, {"resultData.status": 'APPROVED'}] }},
        {$group: { _id: { "email": "$email"}, AMOUNT: {$sum: '$amount'},}}]);
    var currentplay = await BASECONTROL.BfindOne(playersUser,{email:user.email});
    var deposit = 0;
    var withdrawl = 0;
    var netprofit = 0;

    if(deposit1.length > 0){
        deposit += deposit1[0].AMOUNT;
    }
    if(withdrawl1.length > 0){
        withdrawl += withdrawl1[0].AMOUNT;
    }
    if(deposit2.length > 0){
        deposit += deposit2[0].AMOUNT;
    }
    if(withdrawl2.length > 0){
        withdrawl += withdrawl2[0].AMOUNT;       
    }

    netprofit = deposit - withdrawl - currentplay.balance;
    var row = Object.assign({},{deposit : deposit.toFixed(0),withdrawl : withdrawl.toFixed(0),netprofit : netprofit.toFixed(0),netbalance : currentplay.balance.toFixed(0)})
    res.json({status : true,data :row});
    return next();
}

exports.get_bets_profit = async (req,res,next) =>{
    let data = req.body;
    let user = req.body.user;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);

    var ddd =  DashboardControl.get_Months(start,end);
    var array = [];
    for(var j = 0;  j < ddd; j++){
        await DashboardControl.BettingHistory_model( DashboardControl.get_bettingtable_prefix(start,j)).find({ $and: [ { "DATE": { $gte: start, $lte:end } ,USERID : user._id}] }).then(async betts=>{
            array.push(betts);
        });
    }
    var casinobets = {BET : 0,WIN : 0,CANCELED_BET: 0};
    for(var i in array){
        for(var j in array[i]){
            casinobets[array[i][j].TYPE] += array[i][j].AMOUNT ? array[i][j].AMOUNT : 0 ;
        }
    }

    var totalgrand = (  (casinobets.WIN - casinobets.BET - casinobets.CANCELED_BET)).toFixed(0)

    var sports = {type:"Sportsbook","win-loose" : 0 , Total:0};
    var exchange = {type:"Exchange","win-loose" : 0, Total:0};
    var cardgames = {type:"Card Games","win-loose" : 0, Total:0};
    var ca_bets = {type : "casino","win-loose" :casinobets.WIN +" - " + (casinobets.BET + casinobets.CANCELED_BET).toFixed(0) , "Total" : (casinobets.WIN - casinobets.BET - casinobets.CANCELED_BET).toFixed(0)};
    var grands = {type : "Grand Total","win-loose": "-",Total : totalgrand};
    
    var rows = [sports,exchange,cardgames,ca_bets,grands];
    res.json({ status : true,data : rows });
    return next();

    async function get_bazzars_bets(BazaarType){
        var datas = await BASECONTROL.Bfind(BazaarModel,{status : true,bazaartype : BazaarType});
        var row = {BET : 0,WIN : 0,CANCELED_BET : 0}
        for(var j in datas){
            let bet = 0;
            let win = 0;
            var dd = await BASECONTROL.Bfind(matka_betmodels,{USERID : user._id,bazaarid : datas[j]._id, $or : [{status : "2"},{status : "1"}] ,"DATE": { $gte: start ,$lte:end}});
            if(dd.length > 0){
                for(var i in dd){
                    bet += dd[i].amount;
                }
            }
            dd = await BASECONTROL.Bfind(matka_betmodels,{USERID : user._id,bazaarid : datas[j]._id,status : "3","DATE": { $gte: start ,$lte:end}});
            if(dd.length > 0){
                for(var i in dd){
                    win += dd[i].amount;
                }
            }
            row.BET += bet;
            row.WIN += win;
        }

        return row     
    }
}


exports.get_accountstatement = async (req,res,next) =>{
    let data = req.body.row;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);
    let userdata= await BASECONTROL.BfindOne(Users,{email:data.email});
    // var total ={};
    // console.log(userdata._id);
    // console.log(start);
    // console.log(end);
    // var tt_data =  await wallethistory.aggregate([
    //     {$match: { $and: [{updated: { $gte: start ,$lte:end}}]}},
    //     {$group: { _id: { "USERID": "$USERID"}, 
    //         debited: {$sum: '$debited'},
    //         credited: {$sum: '$credited'},
    //     }}
    // ]);

    // console.log(tt_data);

    // if(tt_data && tt_data.length > 0){
    //     tdata = tt_data.find(obj=>obj.USERID == userdata._id);
    //     if(tdata){
    //         total = {
    //             created : tdata.created,
    //             debited : tdata.debited,
    //         }
    //     }
    // }

    var resdata =  await BASECONTROL.BSortfind(wallethistory,{updated: { $gte: start ,$lte:end},USERID : userdata._id},{updated : -1});
    var rows = [];
    for(var i in resdata){
        var row = {};
        let w_item = resdata[i]._doc;
        switch(w_item.LAUNCHURL){
            case "cash":
                row = Object.assign({},w_item,{TYPE : w_item.LAUNCHURL},{NAME : w_item.GAMEID},{PROVIDERID : w_item.GAMEID});
                rows.push(row);
            break;
            case "matka":
                let ms = (w_item.GAMEID).split(":");
                let items = await BASECONTROL.BfindOne(BazaarModel,{_id : ms[2]});
                if(items){
                    row = Object.assign({},w_item,{TYPE : items.bazaarname},{NAME : ms[0]},{PROVIDERID : "MATKA"});
                    rows.push(row);
                }
            break;
            default :
                var g_detail = await BASECONTROL.BfindOne(GAMELISTMODEL,{LAUNCHURL : w_item.LAUNCHURL,ID : w_item.GAMEID });
                if(g_detail){
                    let arr = g_detail._doc;
                    row = Object.assign({},w_item,{TYPE : arr.TYPE},{NAME : arr.NAME},{PROVIDERID : arr.PROVIDERID});
                    rows.push(row);
                }
            break;


        }

    }
    res.json({status : true,data : rows});
    return next();
}


