const md5 = require('md5')
const Request = require("request")
const BASECON = require("../basecontroller")
const { BalanceUpdate, PayoutOrder } = require('./init')
const { GamePlay, adminUser } = require("../../models/users_model")
const { Paymentconfig, TransactionsHistory, PaymentMenuModel, WithdrawHistory, PaymentMethod } = require("../../models/paymentGateWayModel")
const PAYMENTCONFIG = require("../../config/paymenterror.json");

var mongoose = require('mongoose');

exports.Paygate10Callback = async(req,res,next)=>{
    var updata = { resultData : req.body };
    var txnhis = await BASECON.BfindOne(TransactionsHistory,{order_no : req.body.txid});
    var userdata = await BASECON.BfindOne(GamePlay,{email :txnhis.email });
    if(txnhis && userdata){
        if(req.body.status == "APPROVED" ){
        // const { fee } = await PaymentMenuModel.findOne({type})
        // let balance = parseFloat(amount) - parseFloat(amount) * parseFloat(fee)/100

            if(txnhis.status != PAYMENTCONFIG.PaymentStatus_bool.Approve){
                var wallets = {
                    commission:0,
                    status :"DEPOSIT",
                    roundid :req.body.txid,
                    transactionid : req.body.txid,
                    LAUNCHURL : "cash",
                    GAMEID : "RuPeePay",
                    USERID : userdata.id,
                    credited : amount,
                    debited : 0,
                    lastbalance : userdata.balance
                }
                updata["status"] = PAYMENTCONFIG.PaymentStatus_bool.Approve;
                updata["lastbalance"] = userdata.balance;
                var current = await BASECON.email_balanceupdate(email, txnhis.amount,wallets);
                updata["updatedbalance"] = current;
            }

        }else{
            updata["status"] = PAYMENTCONFIG.PaymentStatus_bool.Reject;
            updata["lastbalance"] = userdata.balance;
            updata["updatedbalance"] = userdata.balance;
        }
        await BASECON.BfindOneAndUpdate(TransactionsHistory,{ order_no : txnhis.order_no}, updata);

    }
    return res.status(200)
}

exports.Paygate10CallbackW = async(req,res,next)=>{
    return next()
}
exports.Paygate10CallbackC = async(req,res,next)=>{
    return next()
}
exports.Paygate10CallbackCW = async(req,res,next)=>{
    return next()
}

exports.Paygate10Withdraw = async(req,res,next)=>{
    var data = req.body
    let withdrawHistory = await WithdrawHistory.findOne({ "email": data.email, $or: [ { "status": "processing" }, { $or: [ { "status": "pending" } ] } ] })
    if(!withdrawHistory){
        let balanceData = await GamePlay.findOne({email:data.email})
        if(parseFloat(balanceData.balance)>parseFloat(data.amount)){
            let type = data.type
            let paymentMethodData = { email:data.email, type, paymentData:data }
            await PaymentMethod.findOneAndUpdate({type, email:data.email}, paymentMethodData, { upsert: true }, async(err)=>{
                if(err){
                    return res.json({status:false, data:"failed"})
                }else{
                    const withdrawHistoryData = new WithdrawHistory(data)
                    withdrawHistoryData.save((err)=>{
                        if(err){
                            return res.json({status : false, data : "failed"})
                        }else{
                            return res.json({status : true, data : "Success"})
                        }
                    })
                }
            })
        }else{
            return res.json({status : false, data : "You cannot withdraw many than the balance amount."})
        }
    }else{
        return res.json({status : false, data : "There has been a recent change to the withdrawal process, users are allowed to have only 1 pending withdrawal at a time. Please cancel and resubmit your withdrawal request."})
    }
}

exports.Paygate10CheckOut = async(req,res,next)=>{
    var { first_name, last_name, email, amount, type, bankType, mobile, address, city, postcode } = req.body;
    var ruppeconfig = await BASECON.BfindOne(Paymentconfig,{type : PAYMENTCONFIG.PaymentconfigType.Ruppe});
    if(!ruppeconfig){
        return res.json({ status : false, data: 'fail' })
    }else{
        var { midcode, midsecret, apikey, apisecret, callbackurl, return_url, request_url, callbackurl_c } = ruppeconfig.configData;
        let ipaddress = BASECON.get_ipaddress(req);
        let requesttype = PAYMENTCONFIG.WalletType_STRING.Deposit;
        let order_no = Math.floor(new Date().valueOf()/1000);
        amount =  amount.toFixed(2);
        let form = {
            requesttype: requesttype,
            requestfor: bankType,
            mobile,
            address,
            city,
            postcode,
            email,
            amount: amount,
            timestamp: order_no,
            currency: "INR",
            reference1: "",
            reference2: "",
            reference3: "",
            reference4: "",
            reference5: "",
            firstname:first_name,
            lastname:last_name,
        }    
        let options = {'method': 'POST', 'url': request_url,
            'headers': { 'Content-Type': 'application/json' }, }

        if(bankType=='netbanking'){
            var encrypthash = md5(midcode + order_no + amount + midsecret);
            form = Object.assign({}, form, 
            {
                midcode,
                state: "IN",
                countrycode: "IN",
                encrypthash,
                ipaddress,
                callbackurl,
                returnurl: return_url
            })

            Request.post({...options, body:JSON.stringify(form)}, async (error, response) => {
                if (error){
                    return res.json({ status : false, data : "failed"})
                }else{
                    if(response.statusCode == 400){
                        return res.json({ status : false, data : "failed"})
                    }else{
                        let resultData = JSON.parse(response.body);
                        let transactionData = { 
                            type, email, amount, status : PAYMENTCONFIG.PaymentStatus_bool.pending, 
                            requestData: resultData,
                            order_no: resultData.transactionid, 
                            wallettype : "DEPOSIT",
                            userid : mongoose.Types.ObjectId(req.user._id)

                        }
                        var txnsave = await BASECON.data_save(transactionData,TransactionsHistory);
                        if(txnsave){
                            return res.json({ status : true, data:resultData})
                        }else{
                            return res.json({ status : false, data : "failed"})
                        }
                    }
                }
            })
        }else if(bankType=='cod'){
            
            var encrypthash = md5(apisecret+order_no+email+amount.toFixed(2))
            form = Object.assign({}, form, {
                apikey,
                encrypthash,
                callbackurl:callbackurl_c,
            })
            Request.post({...options, body:JSON.stringify(form)}, async (error, response) => {
                if (error){
                    return res.json({ status : false, data : "failed"})
                }else{
                    let resultData = JSON.parse(response.body)
                    if(response.statusCode==400){
                        return res.json({ status : false, data : "failed"})
                    }else if(resultData.status.toLocaleLowerCase()=='approved'){

                        var userdata = await BASECON.BfindOne(GamePlay,{email : email})
                        
                        let transactionData = { 
                            type, email, amount, status,
                            requestData:form, resultData,
                            order_no: resultData.transactionid,
                            wallettype : "DEPOSIT"
                        }

                        var wallets_ = {
                            commission:0,
                            status :"DEPOSIT",
                            roundid :resultData.transactionid,
                            transactionid : resultData.transactionid,
                            LAUNCHURL : "cash",
                            GAMEID : "RuPeePay",
                            USERID : userdata.id,
                            credited : amount,
                            debited : 0,
                            lastbalance : userdata.balance
                        }
                        // const transactionsHistory = new TransactionsHistory(transactionData)
                        // await transactionsHistory.save(async (err)=>{
                            var err = await BASECON.data_save(transactionData,TransactionsHistory)
                            if(!err){
                                return res.json({ status : false, data : "failed"})
                            }else{
                                // const { fee } = await PaymentMenuModel.findOne({type})
                                // let balance = parseFloat(amount) - parseFloat(amount) * parseFloat(fee)/100
                                let balance = parseFloat(amount)
                                await BalanceUpdate(email, balance,resultData.transactionid,wallets_);
                                const redirect = new URL(return_url)
                                redirect.searchParams.append("amount", amount)
                                redirect.searchParams.append("currency", 'INR')
                                redirect.searchParams.append("status", resultData.status)
                                return res.json({ status : true, data : {paymenturl:redirect}})
                            }
                        // })
                    }else if(resultData.status.toLocaleLowerCase()=='declined'){
                        if(resultData.message){
                            let message = ''
                            let str = resultData.message
                            while (str.length > 0) {
                                message += str.substring(0, 20) + '\n'
                                str = str.substring(20)
                            }
                            return res.json({ status : false, data : message})
                        }
                        return res.json({ status : false, data : 'faild'})
                    }
                }
            })
        }
    }
}

exports.Paygate10Payout = async(req,res,next)=>{
    var data = req.body
    const { status, email, amount, bankType, payoutData, first_name, last_name } = req.body
    const { username, accountname, accountnumber, bankname, bankifsc, bankbranch, bankaddress,   mobile, address, city, postcode } = payoutData
    if(status=="payout"){
        let balanceData = await GamePlay.findOne({email})
        if(parseFloat(balanceData.balance)>parseFloat(amount)){
            const paymentconfig = await Paymentconfig.findOne({ type : data.type })
            if(!paymentconfig){
                return res.json({ status : false, data: 'fail' })
            }else if(!paymentconfig.state){
                return res.json({ status : false, data: paymentconfig.type+' has been disabled.' })
            }else{
                const status = 'withdrawal'
                const timestamp = Math.floor(new Date().valueOf()/1000)
                const { midcode, midsecret, apikey, apisecret, request_url, callbackurl2 } = paymentconfig.configData
                let balance = parseFloat(amount).toFixed(2)
                let options = {
                    'method': 'POST',
                    'url': request_url,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                }
                if(bankType=='netbanking'){
                    const encrypthash = md5(midsecret+timestamp+balance)
                    const requestcode = md5(timestamp)
                    let form = {
                        requesttype: status,
                        requestfor: bankType,
                        countrycode: "IN",
                        amount:balance,
                        timestamp,
                        currency: "INR",
                        reference1: "",
                        reference2: "",
                        reference3: "",
                        reference4: "",
                        reference5: "",
                        midcode,
                        encrypthash,
                        requestcode,
                        username,
                        accountname,
                        accountnumber,
                        bankname,
                        bankifsc,
                        bankbranch,
                        bankaddress,
                        callbackurl:callbackurl2
                    }
                    
                    Request.post({...options, body:JSON.stringify(form)}, async (error, response) => {
                        if (error){
                            return res.json({ status : false, data : "failed"})
                        }else{
                            let transactiondata = {
                                type : data.type,
                                email : data.email,
                                order_no : timestamp,
                                status : 'payout',
                                amount : amount,
                                requestData : data,
                            }
                            let resultData = JSON.parse(response.body)
                            if(response.statusCode==400){
                                return res.json({ status : false, data : "failed"})
                            }else if(resultData.status.toLocaleLowerCase()=='approved'){
                                transactiondata = Object.assign({}, transactiondata, {resultData})
                                await BASECON.email_balanceupdate(data.email, -parseFloat(amount))
                            }
                            const transactionsHistory = new TransactionsHistory(transactiondata)
                            await transactionsHistory.save(async (err)=>{
                                if(err){
                                    return res.json({status : false, data : "failed"})
                                }else{
                                    await WithdrawHistory.updateOne({ _id : data._id}, {status: resultData.status} )
                                    return res.json({ status : true, data:resultData.status})
                                }
                            })
                        }
                    })
                }else if(bankType=='cod'){
                    const encrypthash = md5(apisecret+timestamp+email+balance)
                    let form = {
                        requesttype: status,
                        requestfor: bankType,
                        mobile,
                        address,
                        city,
                        postcode,
                        email,
                        amount:balance,
                        apikey,
                        timestamp,
                        currency: "INR",
                        reference1: "",
                        reference2: "",
                        reference3: "",
                        reference4: "",
                        reference5: "",
                        firstname:first_name,
                        lastname:last_name,
                        encrypthash,
                        callbackurl:callbackurl2,
                    }
                    Request.post({...options, body:JSON.stringify(form)}, async (error, response) => {
                        if (error){
                            return res.json({ status : false, data : "failed"})
                        }else{
                            let transactiondata = {
                                type : data.type,
                                email : data.email,
                                order_no : timestamp,
                                status : 'payout',
                                amount : amount,
                                requestData : data,
                            }
                            let resultData = JSON.parse(response.body)
                            if(response.statusCode==400){
                                return res.json({ status : false, data : "failed"})
                            }else if(resultData.status.toLocaleLowerCase()=='approved'){
                                transactiondata = Object.assign({}, transactiondata, {resultData})
                                await BASECON.email_balanceupdate(data.email, -parseFloat(amount))
                            }
                            const transactionsHistory = new TransactionsHistory(transactiondata)
                            await transactionsHistory.save(async (err)=>{
                                if(err){
                                    return res.json({status : false, data : "failed"})
                                }else{
                                    await WithdrawHistory.updateOne({ _id : data._id}, {status: resultData.status} )
                                    return res.json({ status : true, data:resultData.status})
                                }
                            })
                        }
                    })
                }
            }
        }else{
            return res.json({status : false, data : "You cannot Payout many than the balance amount."})
        }
    }else{
        await PayoutOrder(req,res,next)
    }
}