const bethistory_model = require('../models/bethistory_model');  
const adminUser = require('../models/users_model').adminUser;  
const GamePlay = require('../models/users_model').GamePlay;  
const totalusermodel = require('../models/users_model').totalusermodel;  
const TransactionsHistory = require('../models/paymentGateWayModel').TransactionsHistory;  
const balance_histoy = require("../models/users_model").balance_histoy;
const CONFIG = require("../config/index.json");
const BASECONTROL = require("./basecontroller");
const UsersControl = require("./userscontroller");
const SessionModel = require("../models/users_model").sessionmodel;
const permission_model = require("../models/users_model").permission_model;


exports.BettingHistory_model = (dt) =>{
    return bethistory_model.BettingHistory_model(dt);
}

exports.get_bettingtable_prefix =(start,i) =>{
    var date = new Date(start);
    var year = date.getFullYear();
    var smonth = date.getMonth() + 1;
    var addyear = parseInt((i + smonth) / 13);
    var fullyear = year + addyear;
    var addmonth = (i + smonth) % 12;
    addmonth = addmonth == 0 ? "12" : addmonth
    var fullmonth = addmonth > 9 ? addmonth : "0" + addmonth;
    var datestring = fullyear + "-"+fullmonth;
    return datestring
}

exports.get_Months =(start,end) =>{
    var date1 = new Date(start);
    var date2 = new Date(end);
    var index1 = (date2.getMonth() + 1) + 1;
    var index2 = 12 - (date1.getMonth() + 1);
    var year = date2.getFullYear() - date1.getFullYear() - 1;
    var total = index1 + index2 + year * 12;
    return total;
}

exports.get_main_users = async (mainuser) =>{
    var m_users = [];
    m_users = await get_permissions(mainuser)
    return m_users;

    async function get_permissions(role){
        var data = [];
        async function recurse(email){
            var rows = await BASECONTROL.Bfind(adminUser,{isdelete : false,created : email, permission : {$ne : CONFIG.USERS.player }});
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
            let rows = await BASECONTROL.Bfind(adminUser,{isdelete : false, permission : {$ne : CONFIG.USERS.player }});
            data = rows;
        }else{
            data.push(role);
            await recurse(role.email);
        }
        return data;
    }
}

exports.get_user_load = async (req,res,next) =>{
    var mainuser = BASECONTROL.get_useritem_fromid(req);
    console.log(mainuser,"----");
    var m_users =  await this.get_main_users(mainuser);
    var roles = await BASECONTROL.Bfind(permission_model);
    let data = [];
    for(var i in m_users){
        var roleitem = roles.find(obj => obj.id == m_users[i].permission);
        data.push({value : m_users[i].email,label : m_users[i].email + "    " + roleitem.title + "    " + ( 100 - parseInt(m_users[i].positiontaking)) });
    }
    res.json({status : true,data : data});
    return next();
}

exports.get_revenue_from_user = async (user,start,end) =>{
    
    var role =await BASECONTROL.BfindOne(adminUser,{email : user.email });
    var Profit =  await this.get_profit(start,end,role)

    var total = {};
    var playersagentBalance = 0
    var childrole = await BASECONTROL.Bfind(permission_model,{pid : role.permission});
    var childusers=[];
    for(let i in childrole){

        if( childrole[i].permission != CONFIG.USERS.player ){
            let row = await BASECONTROL.Bfind(adminUser,{permission : childrole[i].id,created : user.email});

            if(row.length > 0){
                for(let j in row){
                    let newrow = await BASECONTROL.BfindOne(GamePlay,{id : row[j]._id});
                    playersagentBalance += newrow.balance;
                    childusers.push(newrow)
                }
            }
        }
    }

    total = await Object.assign(total, {playersagentBalance:playersagentBalance});    

    var userslist = await UsersControl.get_users_for_permission(role,start,end);
    total = await Object.assign(total, {playersRegistered:userslist.length});    
    userslist = await UsersControl.get_users_items(role);
    

    
    await totalusermodel.aggregate([
        {$match : { $and: [ { "date": { $gte: start } }, { "date": { $lte:end} }] }},
        {$group : { _id:{"email":"$email"}, totallogincount:{$sum:1} }}
    ]).then(async totallogincount=>{
        total = await Object.assign(total, {totallogincount:totallogincount.length});
    })
    
    var Playerslogged = [];
    var totalPlayerBalance = 0;
    var totalPlayerBonusBalance = 0;
    var DepostiObj = {};
    var MakingDepositsAmount = 0;
    var playersMakingWithdrawl = 0;
    var WithdrawlObj = {};
    var MakingWithdrawlAmount = 0;
    var playersMakingDeposit = 0;

    for(let i in userslist){
        let item = await BASECONTROL.BfindOne(SessionModel,{role : CONFIG.USERS.player,email : userslist[i].email});
        if(item){
            Playerslogged.push(item);
        }

        let pitem = await BASECONTROL.BfindOne(GamePlay,{email : userslist[i].email});
        if(pitem){
            totalPlayerBalance += pitem.balance;
            totalPlayerBonusBalance += pitem.bonusbalance;            
        }

        


        let trsdepositdata = await BASECONTROL.Bfind(TransactionsHistory,{ $and: [ {email : userslist[i].email},{ "createDate": { $gte: start } }, { "createDate": { $lte: end } }, { "status": 'deposit' }, { "resultData.status": '2' }]});
        for(let j in trsdepositdata){
            MakingDepositsAmount += parseFloat(trsdepositdata[j].amount);
            DepostiObj[trsdepositdata[j].email] = trsdepositdata[j].email;
        }

        let datasdeposit = await BASECONTROL.Bfind(balance_histoy,{ $and: [{email : userslist[i].email}, { "createDate": { $gte: start } }, { "createDate": { $lte: end } },{type : 1}]});
        for(let j in datasdeposit){
            MakingDepositsAmount += parseFloat(datasdeposit[j].amount);
        }


        let trsWithdrawldata = await BASECONTROL.Bfind(TransactionsHistory,{ $and: [{email : userslist[i].email}, { "createDate": { $gte: start } }, { "createDate": { $lte: end } }, { "status": 'payout' }, { "resultData.status": '2' }]});
        for(let j in trsWithdrawldata){
            MakingWithdrawlAmount += parseFloat(trsWithdrawldata[j].amount);
            WithdrawlObj[trsWithdrawldata[j].email] = trsWithdrawldata[j].email;
        }
    
        let dataswithdrawl = await BASECONTROL.Bfind(balance_histoy,{ $and: [{email : userslist[i].email}, { "createDate": { $gte: start } }, { "createDate": { $lte: end } },{type : 2}]});
        for(let j in dataswithdrawl){
            MakingWithdrawlAmount += parseFloat(dataswithdrawl[j].amount);
        }
    }
    
    
    
    
    playersMakingWithdrawl = Object.keys(WithdrawlObj).length;
    playersMakingDeposit = Object.keys(DepostiObj).length;    
    
    total = await Object.assign(total, 
    {Profit:Profit},
    {playersLoggedIn:Playerslogged.length},
    {playersBalance:totalPlayerBalance},
    {playersBonusBalance:totalPlayerBonusBalance},
    {playersMakingDeposit:playersMakingDeposit},
    {MakingDeposits:MakingDepositsAmount},
    {playersMakingWithdrawals:playersMakingWithdrawl},
    {MakingWithdrawals:MakingWithdrawlAmount});
    return total;
}

exports.revenue_load =async (req,res,next) =>{

    var start = BASECONTROL.get_stand_date_first(req.body.startDate);
    var end = BASECONTROL.get_stand_date_end(req.body.endDate);
    var user = req.body.user;
    var total =  await this.get_revenue_from_user(user,start,end);
    await res.json({status:true, data:total});
    return next();
}

exports.get_profit = async ( start,end, role) =>{
    var profit = 0;
    if(role.permission == CONFIG.USERS.superadmin){
        var roles = await BASECONTROL.Bfind(adminUser,{permission : CONFIG.USERS.supermaster,isdelete : false});
        for(var i in roles){
            let c_profit =  await this.get_profit_agent(start,end,roles[i]);
            var positiontaking = parseInt(roles[i].positiontaking);
            var c_pos_tak1 = positiontaking > 0 && positiontaking < 100 ? (100 - positiontaking)/100 : 0;
            var c_pos_tak2 = positiontaking > 0 && positiontaking < 100 ? positiontaking/100 : 0;
            // console.log((c_profit * c_pos_tak2 / c_pos_tak1))
            profit += (c_profit * c_pos_tak2 / c_pos_tak1);
        }
    }else{
        profit =  await this.get_profit_agent(start,end,role);
    }

    return profit;
}

exports.get_profit_agent = async ( start,end, role) =>{

    var positiontaking = parseInt(role.positiontaking);
    var c_pos_tak = positiontaking > 0 && positiontaking < 100 ? (100 - positiontaking)/100 : 0;
    var array = [];
    var userslist = await UsersControl.get_users_items(role);
    var ddd =  this.get_Months(start,end);
    for(let i in userslist){
        for(let j = 0;  j < ddd; j++){
            await this.BettingHistory_model( this.get_bettingtable_prefix(start,j)).find({ $and: [ { "DATE": { $gte: start } }, { "DATE": { $lte:end} },{USERID : userslist[i]._id}] }).then(async betts=>{
                array.push(betts);
                // console.log(betts.length)
            });
        }
    }

    var totalbets = {BET : 0,WIN : 0,CANCELED_BET: 0};
    for(let i in array){
        for(let j in array[i]){
            totalbets[array[i][j].TYPE] += array[i][j].AMOUNT ? array[i][j].AMOUNT : 0 ;
        }
    }
    // console.log(totalbets)
    var Profit = (totalbets.BET - totalbets.CANCELED_BET - totalbets.WIN) * c_pos_tak;
    return Profit
}

async function run(){
    var dd = await adminUser.find({ $or :[ {created : "superadmin@gmail.com",created : "players"}],permission : CONFIG.USERS.player});
    // console.log(dd);
    for(var i in dd){
        await BASECONTROL.BfindOneAndUpdate(adminUser,{_id : dd[i]._id},{created : "superweb@gmail.com"})
    }
}
