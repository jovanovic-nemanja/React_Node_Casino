
const { adminUser, balance_histoy,GamePlay } = require("../../models/users_model")
const {TransactionsHistory, WithdrawHistory, PaymentMenuModel} = require("../../models/paymentGateWayModel")
const BASECONTROL = require("../basecontroller")
const PAYMENTCONFIG = require("../../config/paymenterror.json")
const UsersControl = require("../userscontroller")
var mongoose = require('mongoose');
const CONFIG = require("../../config/index.json");

exports.Payout = async(req,res,next)=>{
    let data = req.body.data;
    var mainuser =await BASECONTROL.get_useritem_fromid(req);
    let {status,amount} = data;
    let last_item = await BASECONTROL.BfindOne(WithdrawHistory,{_id : data._id});
    if(last_item.status == PAYMENTCONFIG.PaymentStatus_bool.pending || last_item.status == PAYMENTCONFIG.PaymentStatus_bool.OnHold){
        if(status == PAYMENTCONFIG.PaymentStatus_bool.Reject){
                var error1 =  await BASECONTROL.BfindOneAndUpdate(WithdrawHistory,{ _id : data._id}, {status: data.status,updated_mail :mainuser.email,comment : data.comment,verify : data.verify} );
                    var p_item = await BASECONTROL.BfindOne(GamePlay,{email : data.email});
                
                if(error){
                    var wallets_ = {
                        commission:0,
                        status :"WITHDRAWl",
                        roundid :error1.order_no,
                        transactionid : error1.order_no,
                        LAUNCHURL : "cash",
                        GAMEID : "CASh",
                        USERID : p_item.id,
                        credited : 0,
                        debited : amount,
                        lastbalance : p_item.balance
                    }
                    var error2 =  await BASECONTROL.email_balanceupdate(data.email,(amount),wallets_);
                    this.admin_WithdrawHistoryLoad(req,res,next);

                }else{
                    res.json({status : false, data : "error"});
                    return next();
                }
        }else{
            switch(data.type){
                // case "YaarPay":
                //     return await YaarPayPayout(req,res,next,mainuser)
                case "CASH" : 
                    this.cashpayout_action(req,res,next,mainuser); 
                break;
                // case "netcents":
                //     return await netcentsPayout(req,res,next)
                // case "Qpay":
                //     return await QpayPayout(req,res,next)
                // case "Razorpay":
                //     return await RazorpayPayout(req,res,next)
                // case "Paygate10":
                //     return await Paygate10Payout(req,res,next);
                default:
                    res.json({status : false,data : "fail"});
                    return next();
            }
        }
    }else{
        res.json({status : false,data : "fail"});
        return next();
    }
}

exports.deposittransactionHistoryLoad = async(req,res,next)=>{
    let data = req.body.params;
    let email = req.user.email;
    let start = data.start;
    let end = data.end;
    start = BASECONTROL.get_stand_date_end(start);
    end = BASECONTROL.get_stand_date_end(end);
    let rdata = await BASECONTROL.BSortfind(TransactionsHistory,{ createDate :{$gte: start, $lte:end},email:email,wallettype : "DEPOSIT"},{createDate : -1});
    return res.json({ status : true, data: rdata });
}


exports.admindeposittransactionHistoryLoad = async(req,res,next)=>{
    let data = req.body;
    let start = BASECONTROL.get_stand_date_end(data.start)
    let end = BASECONTROL.get_stand_date_end(data.end);
    var mainuser =await BASECONTROL.get_useritem_fromid(req);
    var playerslist = await UsersControl.get_users_items(mainuser);
    let resultData = [];
    
    for(var k in playerslist){
        //getting without adminwithdrawal depositing and withdrawal
        if(playerslist[k].permission === CONFIG.USERS.player){
            let rows = await BASECONTROL.BSortfindPopulate(TransactionsHistory,{ createDate :{$gte: start, $lte:end},email:playerslist[k].email,type :{$ne : "admin"}},{createDate : -1},"userid");
            if(rows.length > 0){
                resultData = [...resultData,...rows];
            }
        }
    }
   
    resultData.sort(function(resultData,b){
        return new Date(b.createDate) - new Date(resultData.createDate)
    })
    return res.json({ status : true, data : resultData})
}

exports.WithdrawHistoryLoad = async(req,res,next)=>{
    let data = req.body.params;
    let email = req.user.email;
    let start = data.start;
    let end = data.end;
    start = BASECONTROL.get_stand_date_end(start);
    end = BASECONTROL.get_stand_date_end(end);
    let rdata = await BASECONTROL.BSortfind(TransactionsHistory,{ createDate :{$gte: start, $lte:end},email:email,wallettype : "WITHDRAWL"},{createDate : -1});
    return res.json({ status : true, data: rdata });
}


exports.get_tran_fromemail = async (email,wallettype,start,end) =>{
    let  trandata =  await TransactionsHistory.aggregate([
        {$match: { $and: [{email:email},{wallettype : wallettype},{createDate :{$gte: start, $lte:end}}]}},
        {$group: {
            _id: { "status": "$status", },
            AMOUNT: {$sum: '$amount'},
            COUNT: {$sum: 1},
        }},
    ]);
    
    let PB = PAYMENTCONFIG.PaymentStatus_bool;
    let detotals = {};
    detotals[PB.Approve] = {index : 0,amount : 0};
    detotals[PB.Reject] = {index : 0,amount : 0};
    detotals[PB.Paid] = {index : 0,amount : 0};
    detotals[PB.pending] = {index : 0,amount : 0};
    detotals[PB.OnHold] = {index : 0,amount : 0};
    for(var i in trandata){

        detotals[trandata[i]["_id"]["status"]]["index"] = trandata[i].COUNT
        detotals[trandata[i]["_id"]["status"]]["amount"] = trandata[i].AMOUNT
    }
    return detotals;
}

exports.adminwithdrawal_total =  async (req,res,next) =>{
    let data = req.body;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);
    var mainuser = BASECONTROL.get_useritem_fromid(req);
    var playerslist = await UsersControl.get_users_items(mainuser);

    var total ={};
    let detotals = {};
    let wdtotals = {};

    let PB = PAYMENTCONFIG.PaymentStatus_bool;
    detotals[PB.Approve] = {index : 0,amount : 0};
    detotals[PB.Reject] = {index : 0,amount : 0};
    detotals[PB.Paid] = {index : 0,amount : 0};
    detotals[PB.pending] = {index : 0,amount : 0};
    detotals[PB.OnHold] = {index : 0,amount : 0};

    wdtotals[PB.Approve] = {index : 0,amount : 0};
    wdtotals[PB.Reject] = {index : 0,amount : 0};
    wdtotals[PB.Paid] = {index : 0,amount : 0};
    wdtotals[PB.pending] = {index : 0,amount : 0};
    wdtotals[PB.OnHold] = {index : 0,amount : 0};


    for(var i in playerslist){

        if(playerslist[i].permission === CONFIG.USERS.player){
            let depositdata =  await this.get_tran_fromemail(playerslist[i].email,"DEPOSIT",start,end);
            let withdrwaldata =  await this.get_tran_fromemail(playerslist[i].email,"WITHDRAWL",start,end);
    
            detotals[PB.Approve].index += depositdata[PB.Approve].index;
            detotals[PB.Approve].amount += depositdata[PB.Approve].amount;
    
            detotals[PB.Reject].index += depositdata[PB.Reject].index;
            detotals[PB.Reject].amount += depositdata[PB.Reject].amount;
    
            detotals[PB.Paid].index += depositdata[PB.Paid].index;
            detotals[PB.Paid].amount += depositdata[PB.Paid].amount;
    
            detotals[PB.pending].index += depositdata[PB.pending].index;
            detotals[PB.pending].amount += depositdata[PB.pending].amount;
    
            detotals[PB.OnHold].index += depositdata[PB.OnHold].index;
            detotals[PB.OnHold].amount += depositdata[PB.OnHold].amount;

            wdtotals[PB.Approve].index += withdrwaldata[PB.Approve].index;
            wdtotals[PB.Approve].amount += withdrwaldata[PB.Approve].amount;
    
            wdtotals[PB.Reject].index += withdrwaldata[PB.Reject].index;
            wdtotals[PB.Reject].amount += withdrwaldata[PB.Reject].amount;
    
            wdtotals[PB.Paid].index += withdrwaldata[PB.Paid].index;
            wdtotals[PB.Paid].amount += withdrwaldata[PB.Paid].amount;
    
            wdtotals[PB.pending].index += withdrwaldata[PB.pending].index;
            wdtotals[PB.pending].amount += withdrwaldata[PB.pending].amount;
    
            wdtotals[PB.OnHold].index += withdrwaldata[PB.OnHold].index;
            wdtotals[PB.OnHold].amount += withdrwaldata[PB.OnHold].amount;
    
        }

    }

    total = {
        "deposit" : detotals,
        "withdrawl" : wdtotals
    };

    res.json({status : true,data : total})
    return next();
}

exports.admin_WithdrawHistoryLoad = async(req,res,next)=>{

    let data = req.body;
    let start = BASECONTROL.get_stand_date_end(data.start);
    let end = BASECONTROL.get_stand_date_end(data.end);
    var mainuser = BASECONTROL.get_useritem_fromid(req);
    var playerslist = await UsersControl.get_users_items(mainuser);
    var resdata = [];
    for(var i in playerslist){
        if(playerslist[i].permission === CONFIG.USERS.player){
            let rdata = await BASECONTROL.BSortfindPopulate(TransactionsHistory,{ createDate :{$gte: start, $lte:end},email:playerslist[i].email,wallettype : "WITHDRAWL"},{createDate : -1},"userid");
            resdata = [...resdata,...rdata];
        }
    }

    resdata.sort(function(resdata,b){
        return new Date(b.createDate) - new Date(resdata.createDate)
    })

    res.json({status : true,data : resdata})
    return next();
}

exports.cashpayout = async (req,res,next) =>{

    var order_no = new Date().valueOf();
    var indata = req.body.params;
    var email = req.user.email;
    var p_item = await BASECONTROL.BfindOne(GamePlay,{email : email});
    var wallets_ = {
        commission:0,
        status :"WITHDRAWL",
        roundid :order_no,
        transactionid : order_no,
        LAUNCHURL : "cash",
        GAMEID : "CASH",
        USERID : p_item.id,
        credited : 0,
        debited : indata.amount,
        lastbalance : p_item.balance
    }

    let row ={};
    row["type"] = "cash";
    row["email"] = email;
    row["order_no"] = order_no;
    row["status"] = PAYMENTCONFIG.PaymentStatus_bool.pending;
    row["amount"] = indata.amount;
    row["wallettype"] = "WITHDRAWL";
    row["lastbalance"] = p_item.balance;
    row["updatedbalance"] = p_item.balance;
    row["userid"] = mongoose.Types.ObjectId(req.user._id);

    var u_data = await BASECONTROL.email_balanceupdate(email,indata.amount * -1,wallets_);
    var rdata = await BASECONTROL.data_save(row,TransactionsHistory);
    if(u_data && rdata){
        this.WithdrawHistoryLoad(req,res,next);
    }else{
        res.json({ status : false, data: 'fail' })
        return next()
    }
}

exports.cashpayout_action = async(req,res,next,mainuser) =>{
    var indata = req.body.data;
    var error =  await BASECONTROL.BfindOneAndUpdate(WithdrawHistory,{ _id : indata._id},{status: indata.status,updated_mail : mainuser.email,comment : indata.comment,verify : indata.verify})
    if(error){
        this.admin_WithdrawHistoryLoad(req,res,next);
    }else{
        res.json({status : false});
        return next();
    }
}

exports.deposit_withdrawl_historyload = async (req,res,next) =>{
    var data = req.body;
    let start = data.start;
    let end = data.end;
    let email = data.email;
    start = BASECONTROL.get_stand_date_end(start);
    end = BASECONTROL.get_stand_date_end(end);
    let rdata = await BASECONTROL.BSortfind(TransactionsHistory,{ createDate :{$gte: start, $lte:end},email:email},{createDate : -1});
    res.json({status : true, data :rdata});
    return next();
}