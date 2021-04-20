const CryptoJS = require('crypto-js');
const BASECONTROL = require("../basecontroller");
const moment= require('moment');
const { BalanceUpdate, PayoutOrder } = require("./init")
const { GamePlay } = require("../../models/users_model");
const { Paymentconfig, TransactionsHistory, WithdrawHistory, PaymentMethod } = require("../../models/paymentGateWayModel");
const PAYMENTCONFIG = require("../../config/paymenterror.json");
var mongoose = require('mongoose');

exports.YaarPayCheckOut = async(req,res,next)=>{

    var { type, depositBankCode, bankType, amount, first_name, last_name, email } = req.body.params;
    var yarpayconfig = await BASECONTROL.BfindOne(Paymentconfig,{type : PAYMENTCONFIG.PaymentconfigType.YaarPay,state : true});
    if(!yarpayconfig){
        return res.json({ status : false, data: 'We are sorry. Please contact to administrator.' });
    }else{
        var { merchant_id, merchant_key, application_id, request_url, notify_url2, notify_url, return_url2, return_url } = yarpayconfig.configData;
        var currency = 'inr';
        var version = '1.0';
        var orderNO = "yaarpay-" + new Date().valueOf();
        var hashstring='';
        var transactiondata = {  type,  email,  order_no : orderNO, status : PAYMENTCONFIG.PaymentStatus_bool.pending,
            amount, requestData : req.body.params,wallettype : "DEPOSIT",
            userid : mongoose.Types.ObjectId(req.user._id)
        }
        var yaar_amount =  (parseInt(amount)*100).toString();
        switch (bankType){
            // case PAYMENTCONFIG.PAYMENTS.YaarPay1:
            //     var notify_urls =  notify_url2;
            //     var return_urls = depositBankCode=='YP_AXIS'? return_url2 : return_url;
            //     hashstring='amount='+(parseInt(amount)*100)+
            //     '&appId='+application_id+
            //     "&channelId="+bankType+
            //     "&currency="+currency+
            //     "&depositBankCode="+depositBankCode+
            //     "&depositName="+first_name+" "+last_name+
            //     "&mchId="+merchant_id+
            //     "&mchOrderNo="+orderNO+
            //     "&notifyUrl="+notify_urls+
            //     "&returnUrl="+return_urls+
            //     "&version="+version+
            //     "&key="+merchant_key;
            //     transactiondata = Object.assign({}, transactiondata, {resultData:{
            //         orderAmount : amount,
            //         currency,
            //         status : PAYMENTCONFIG.PAYMENTSTATUS.processing,
            //         depositBankCode : depositBankCode
            //     }});

            // break;
            case PAYMENTCONFIG.PAYMENTS.YaarPay:
                var notify_urls = notify_url;
                var return_urls = return_url + "?order_no=" + orderNO;
                hashstring= 'amount=' +yaar_amount +
                '&appId=' + application_id +
                "&channelId=" + bankType +
                "&currency=" + currency +
                "&depositBankCode=" + depositBankCode +
                "&mchId=" + merchant_id +
                "&mchOrderNo=" + orderNO +
                "&notifyUrl=" + notify_urls +
                "&returnUrl=" + return_urls +
                "&version=" + version +
                "&key=" + merchant_key;
            break;
        }
        
        let sign = CryptoJS.MD5(hashstring).toString().toUpperCase();
        let successData={ mchOrderNo:orderNO, version,  channelId:bankType, amount: yaar_amount, currency:currency,
            mchId:merchant_id, appId:application_id, notifyUrl:notify_urls, returnUrl:return_urls,
            sign, depositBankCode, }

        var error = await BASECONTROL.data_save(transactiondata,TransactionsHistory)
        if(!error){
            return res.json({status : false, data : "failed"})
        }else{
            return res.json({status : true, data : successData, request_url: request_url})
        }
    }
}

exports.YaarReturn = async(req,res,next)=>{

    console.log(req.url);
    var indata = BASECONTROL.urlparse(req.url);
    var yaarconfig = await BASECONTROL.BfindOne(Paymentconfig,{type : PAYMENTCONFIG.PaymentconfigType.YaarPay});
    var txnhis = await BASECONTROL.BfindOne(TransactionsHistory,{order_no : indata.order_no});
    if(yaarconfig && txnhis){
        var redirect = new URL(yaarconfig.configData.redirect_url);
        redirect.searchParams.append("order_no", txnhis.order_no);
        redirect.searchParams.append("amount", txnhis.amount);
        redirect.searchParams.append("status", txnhis.status);
        res.writeHead(301,{ Location :redirect});
        return res.end();
    }
}

exports.YaarNotyfy = async(req,res,next)=>{
    var { mchOrderNo, status } = req.body;
    var updata = { resultData : req.body };
    status += "";
    var tnshi = await BASECONTROL.BfindOne(TransactionsHistory,{order_no : mchOrderNo});
    var userdata = await BASECONTROL.BfindOne(GamePlay,{email :tnshi.email });
    if(tnshi && userdata){
        if(status == "2"){

            if(tnshi.status != PAYMENTCONFIG.PaymentStatus_bool.Approve){
                updata["status"] = PAYMENTCONFIG.PaymentStatus_bool.Approve;
                updata["lastbalance"] = userdata.balance;
                // const { fee } = await PaymentMenuModel.findOne({type :"YaarPay"})
                // var amount = parseFloat(tnshi.amount) - parseFloat(tnshi.amount) * parseFloat(fee)/100
                
                var wallets = {
                    commission:0,
                    status :"DEPOSIT",
                    roundid :mchOrderNo,
                    transactionid : mchOrderNo,
                    LAUNCHURL : "cash",
                    GAMEID : "YaarPay",
                    USERID : userdata.id,
                    credited : tnshi.amount,
                    debited : 0,
                    lastbalance : userdata.balance
                }
                
                var current = await BASECONTROL.email_balanceupdate(email, tnshi.amount,wallets);
                updata["updatedbalance"] = current;
            }
            //  await BalanceUpdate(tnshi.email, tnshi.amount,mchOrderNo,wallets_);
        }else{
            updata["status"] = PAYMENTCONFIG.PaymentStatus_bool.Reject;
            updata["lastbalance"] = userdata.balance;
            updata["updatedbalance"] = userdata.balance;
        }
        await BASECONTROL.BfindOneAndUpdate(TransactionsHistory,{ order_no : mchOrderNo}, updata);
    }
    return res.send('OK')
}

exports.YaarResults = async(req,res,next)=>{
    const { order_no } = req.body
    let transactionsHistory = await TransactionsHistory.findOne({ 'resultData.payOrderId' : order_no, type:'YaarPay' })
    if(!transactionsHistory){
        return res.json({ status : false, data: 'failed' })
    }else{  
        return res.json({ status : true, data : transactionsHistory })
    }
}

exports.YaarPayWithdraw = async(req,res,next)=>{
    var data = req.body;
    let balanceData = await BASECONTROL.BfindOne(GamePlay,{email : data.email});
    if(parseFloat(balanceData.balance)>parseFloat(data.amount)){

        let type = data.type+'-'+ data.bankType;
        let paymentMethodData = { email:data.email, type, paymentData:data };
        await PaymentMethod.findOneAndUpdate({type, email:data.email}, paymentMethodData, { upsert: true }, async(err)=>{
            if(err){
                return res.json({status:false, data:"failed"})
            }else{
                var  err1 = await BASECONTROL.data_save(data,WithdrawHistory);
                if(!err1){
                    return res.json({status : false, data : "failed"})
                }else{
                    return res.json({status : true, data : "Success"})
                }
            }
        })
    }else{
        return res.json({status : false, data : "You cannot withdraw many than the balance amount."})
    }
}

exports.YaarNotyfy3 = async(req,res,next)=>{
    // var data = req.body
    // let resultData = await TransactionsHistory.findOneAndUpdate({order_no:data.mchOrderNo, resultData:null}, {resultData:Object.assign({}, data, {completedTime:(new Date)})})
    // if(!resultData){
    //     return res.status(500)
    // }else{
    //     var status = data.status.toString().toLowerCase()
    //     if(status==2){
    //         // const { fee } = await PaymentMenuModel.findOne({type :"YaarPay"})
    //         // var amount = parseFloat(transactionsHistory.amount) - parseFloat(transactionsHistory.amount) * parseFloat(fee)/100
    //         var amount = parseFloat(transactionsHistory.amount);
    //         var userdata = await BASECONTROL.BfindOne(GamePlay,{email : transactionsHistory.email})
    //         var wallets_ = {
    //             commission:0,
    //             status :"DEPOSIT",
    //             roundid :mchOrderNo,
    //             transactionid : mchOrderNo,
    //             LAUNCHURL : "cash",
    //             GAMEID : "YaarPay",
    //             USERID : userdata.id,
    //             credited : amount,
    //             debited : 0,
    //             lastbalance : userdata.balance
    //         }

    //         await BalanceUpdate(transactionsHistory.email, amount,data.mchOrderNo,wallets_)
    //     }
    //     return res.status(200)
    // }
}

exports.YaarPayPayout = async(req,res,next,mainuser)=>{
    var data = req.body;
    const { status, email, amount } = req.body;
    if(status=="payout"){
        let balanceData = await BASECONTROL.BfindOne(GamePlay,{email : email});
        if(parseFloat(balanceData.balance) > parseFloat(amount)){
            var pay_ConFig = await BASECONTROL.BfindOne(Paymentconfig,{ type : data.type });
                if(!pay_ConFig){
                    res.json({ status : false, data: 'fail' })
                    return next()
                }else if(!pay_ConFig.state){
                    res.json({ status : false, data: 'YaarPay has been disabled.' })
                    return next()
                }else{
                    var reqTime = new Date().valueOf();
                    var orderNO = "YaarPayOut-" + moment(new Date()).format('YYYYMMDDhhmmss')
                    const { merchant_id, merchant_key, request_url, notify_url } = pay_ConFig.configData
                    var rawSign=
                        'accountName='+data.payoutData.accountName+
                        '&accountNo='+data.payoutData.accountNo+
                        "&amount="+(parseFloat(amount)*100)+
                        "&ifscCode="+data.payoutData.ifscCode+
                        "&mchId="+merchant_id+
                        "&mchOrderNo="+orderNO+
                        "&notifyUrl="+notify_url+
                        "&payoutBankCode="+data.payoutData.payoutBankCode+
                        "&reqTime="+reqTime+
                        "&key="+merchant_key
        
                    var sign = CryptoJS.MD5(rawSign)
                        sign = sign.toString().toUpperCase()  
                    var successData={
                        mchId:merchant_id,
                        notifyUrl:notify_url,
                        mchOrderNo:orderNO,
                        reqTime:reqTime,
                        sign:sign,
                        accountName:data.payoutData.accountName,
                        accountNo:data.payoutData.accountNo,
                        amount:""+(parseFloat(amount)*100),
                        payoutBankCode:data.payoutData.payoutBankCode,
                        ifscCode:data.payoutData.ifscCode,
                    }
                    var transactiondata = {
                        type : data.type,
                        email : data.email,
                        order_no : orderNO,
                        status : PAYMENTCONFIG.WalletType_STRING.Withdrawl,
                        amount : amount,
                        requestData : data
                    }
                    var options = {
                        'method': 'POST',
                        'url': request_url,
                        "accept-charset":"UTF-8",
                        'headers': {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        form:successData
                    }
                    request.post(options, async (error, response) => {
                        if (error){
                            res.json({ status : false, data: 'fail' })
                            return next()
                        }else{
                            var outdata = JSON.parse(response.body)
                            if(outdata.retCode=="101"){
                                res.json({ status : false,  data: ERRORCONFIG.yaarpayouterrcode[outdata.errCode]})
                                return next()
                            }else if(outdata.retCode=="100"){
                                var s_data = await BASECONTROL.data_save(transactiondata,TransactionsHistory)
                                if(!s_data){
                                    return res.json({status : false, data : "failed"});
                                }else{
                                    await BASECONTROL.BfindOneAndUpdate(WithdrawHistory,{ _id : data._id},{status: 'processing',updated_mail : mainuser.email}, )
                                    await BASECONTROL.email_balanceupdate(data.email, parseFloat(amount) * -1);
                                    return res.json({ status : true, data:'processing'})
                                }
                            }else{
                                res.json({status :false ,data : "error"});
                                return next();
                            }
                        }  
                    })
                }
        }else{
            res.json({status : false, data : "You cannot Payout many than the balance amount."})
            return next()
        }
    }else{
        await PayoutOrder(req,res,next,mainuser)
    }
}