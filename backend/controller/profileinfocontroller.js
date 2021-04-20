const express = require('express');
const router = express.Router();
const adminUser = require("../models/users_model").adminUser;
const bethistory_model = require('../models/bethistory_model');  
const GAMELISTMODEL = require('../models/games_model').GAMELISTMODEL;  
const TransactionsHistory = require('../models/paymentGateWayModel').TransactionsHistory;  

function BettingHistory_model (dt){
    return bethistory_model.BettingHistory_model(dt);
}

router.post("/adminuserLoad", async (req,res,next) =>{
    var query = req.body;
    await adminUser.findOne({email:query.email}).then(rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' });
            return next();
        }else{  
            res.json({ status : true, data : rdata });
            return next();
        }
    })
});

router.post("/adminuserSave", async (req,res,next) =>{
    var query = req.body;
    await adminUser.findOneAndUpdate({email:query.email}, query).then(rdata =>{
        if(!rdata){
            res.json({ status : false, data: 'fail' });
            return next();
        }else{  
            res.json({ status : true, data : 'Success' });
            return next();
        }
    })
});

router.post("/PlayerKPIsShow", async (req,res,next) =>{
    var query = req.body;
    var resultData = {};
    Object.assign(resultData, { GamingTotalStakes : await getGamingAmount(query, 'BET')});
    Object.assign(resultData, { GamingTotalWinnings : await getGamingAmount(query, 'WIN')});
    Object.assign(resultData, { GamingLastBet : await getLastBet(query, 'BET')});
    Object.assign(resultData, { Deposits : await getTransactionAmount(query, 'deposit')});
    Object.assign(resultData, { DepositsCount : await getTransactionCount(query, 'deposit')});
    Object.assign(resultData, { FirstDepositDate : await getTransactionDate(query, 'deposit', 1)});
    Object.assign(resultData, { LastDepositDate : await getTransactionDate(query, 'deposit', -1)});
    Object.assign(resultData, { WithdrawAmount : await getTransactionAmount(query, 'payout')});
    Object.assign(resultData, { WithdrawalCount : await getTransactionCount(query, 'payout')});
    Object.assign(resultData, { LastWithdrawalDate : await getTransactionDate(query, 'payout', -1)});
    res.json({ status : true, data : resultData });
    return next();
});

async function getTransactionDate (query, status, order){
    var date = 'No data to display'; 
    await TransactionsHistory.findOne({status: status, "resultData.status": '2', email:query.email }).sort({createDate:order}).then(async amountData=>{
        if(amountData){
            date = amountData.createDate;
        }
    })
    return await date;
}

async function getTransactionAmount (query, status){
    var amount = 0; 
    await TransactionsHistory.find({status: status, "resultData.status": '2', email:query.email }).then(async amountData=>{
        if(amountData&&amountData.length){
            for(var i in amountData){
                amount += parseFloat(amountData[i].amount);
            }
        }
    })
    return await amount;
}

async function getTransactionCount (query, status){
    var count = 0;
    await TransactionsHistory.aggregate([
        {$match : { $and: [ {status: status}, {"resultData.status": '2'}, {email:query.email} ] }},
        {$group : {
            _id:null,
            count:{$sum:1}
        }}
    ]).then(async TransactionData=>{
        if(TransactionData&&TransactionData.length){
            count = TransactionData[0].count;
        }
    })
    return count;
}

function get_date (date, i=0){
    var d = new Date(date);
    var year = d.getFullYear();
    var month = parseInt(d.getMonth()) + 1 +i;
    var mh = month > 9 ? month : "0" + month;
    var datestring = year + "-"+mh;
    return datestring;
}


async function getGamingAmount(query, TYPE){
    var start = new Date('2020-01-01 0:0:1');
    var end = new Date('2020-12-31');
    var ddd = end.getMonth()+1 - start.getMonth();
    var amount = 0;
    for(var j = 0;  j < ddd; j++){
        await BettingHistory_model(get_date(start, j)).aggregate([
            {$match: { $and: [ { "DATE": { $gte: start } }, { "DATE": { $lte: end } }, {USERID:query.id}, {TYPE:TYPE} ] }},
            {$group : {
                _id:null,
                AMOUNT:{$sum:"$AMOUNT"}
            }},
        ]).then(async playersAmount=>{
            if(playersAmount.length){
                amount += await playersAmount[0].AMOUNT;
            }
        })
    }
    return amount;
}

async function getLastBet(query, TYPE){
    var start = new Date('2020-01-01 0:0:1');
    var end = new Date('2020-12-31');
    var ddd = end.getMonth()+1 - start.getMonth();
    var data = [];
    var resultData = null;
    for(var j = 0;  j < ddd; j++){
        await BettingHistory_model(get_date(start, j)).findOne({ DATE:{$gte: start, $lte: end}, USERID:query.id, TYPE:TYPE }).sort({DATE:-1})
        .then(async lastBetData =>{
            if(lastBetData){
                data.push(lastBetData);
            }
        })
    }
    if(data.length){
        var query1 = data.sort((a,b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime())[0];
        await GAMELISTMODEL.findOne({LAUNCHURL : query1.LAUNCHURL, ID: query1.GAMEID}).then(async rdt => {
            if(rdt){
                resultData = rdt;
            }
        })
        return resultData
    }
}

module.exports = router;