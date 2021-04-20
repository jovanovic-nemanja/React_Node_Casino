const BASECON = require("../basecontroller")
const { GamePlay, adminUser,wallethistory } = require("../../models/users_model")
const { Paymentconfig, WithdrawHistory, PaymentMenuModel, PaymentMethod, TransactionsHistory, Payment_FTD_model } = require("../../models/paymentGateWayModel")
const {WithdrawHistoryLoad } = require("./Transaction")
const PAYMENTCONFIG = require("../../config/paymenterror.json")
const CONFIG = require("../../config/index.json")


exports.BalanceUpdate = async(email, amount,order_no,wallets)=>{

    // var lastdeposit =  await TransactionsHistory.find({$and: [{ $or: [{'resultData.status': "2"}, {"resultData.status": 'APPROVED'}] }, { email }]})
    // var bonusamount = 0
    // if(lastdeposit.length == 1){
    //     if(CONFIG.BONUS.max <= amount){
    //         bonusamount = CONFIG.BONUS.max
    //     }else if( amount >= CONFIG.BONUS.min && amount <= CONFIG.BONUS.max){
    //         bonusamount = amount * CONFIG.BONUS.percent
    //     }
    // }

    // if(bonusamount > 0){
    //     var b_row = {
    //         bonusamount : bonusamount,email : email
    //     }
    //     var sdata = await BASECON.data_save(b_row,Payment_FTD_model);
    // }
    // var last_item = await BASECON.BfindOne(GamePlay,{email : email});
    // // let current = await BASECON.BfindOneAndUpdate(GamePlay,{email :email },{$inc : {balance : amount,bonusbalance  :bonusamount}});
    // let current = await BASECON.email_balanceupdate(email, amount,wallets);
    // if(last_item){
    //     // var row = Object.assign({},wallets,{updatedbalance :current.balance })
    //     // var dds = await BASECON.data_save(row,wallethistory);
    //     var dd = await BASECON.BfindOneAndUpdate(TransactionsHistory,{order_no : order_no},{lastbalance : last_item.balance,updatedbalance : current});
    //     if(!dd){
    //         return false;
    //     }else{
    //         return current;
    //     }
    // }else{
    //     return false
    // }
    
}

exports.PayoutOrder = async(req,res,next,mainuser)=>{

    // var data = req.body;
    // await BASECON.BfindOneAndUpdate(WithdrawHistory,{ _id : data._id}, {status: data.status,updated_mail :mainuser.email} );
    // WithdrawHistoryLoad(req,res,next)
    return res.json({ status:true,data : ""});
}

exports.PaymentconfigSave = async(req,res,next)=>{
    let data = req.body.params
    Paymentconfig.findOneAndUpdate({type:data.type}, data, { upsert: true }, (err)=>{
        if(err){
            return res.json({status:false, data:"failed"})
        }else{
            return res.json({status:true, data:"success"})
        }
    })
}

exports.PaymentconfigLoad = async(req,res,next)=>{
    let result = await Paymentconfig.findOne({ type:req.body.type })
    if(result){
        return res.json({ status:true, data:result })
    }else{
        return res.json({ status:false, data:'failed' })
    }
}

exports.paymentMethodLoad = async(req,res,next)=>{
    const { type, email } = req.body
    let result = await PaymentMethod.findOne({ type, email })
    if(result){
        return res.json({ status:true, data:result })
    }else{
        return res.json({ status:false, data:'failed' })
    }
}

exports.menuupdate = async(req,res,next)=>{
    var indata = req.body.data
    for(let i in indata)
    {
        let updatehandle = await PaymentMenuModel.findOneAndUpdate({_id : indata[i]._id},indata[i])
        if(!updatehandle){
            return res.json({status : false, data : "fail"})
        }
    }
    var findhandle = await PaymentMenuModel.find().sort({order : 1})
    if(!findhandle){
        return res.json({status : false,data : "fail"})
    }else{
        return res.json({status : true,data : findhandle})
    }
}

exports.menusave = async(req,res,next)=>{
    var indata = req.body.data
    var savehandle = await BASECON.data_save(indata,PaymentMenuModel)
    if(!savehandle){
        return res.json({status : false,data : "fail"})
    }else{
        var findhandle = await PaymentMenuModel.find().sort({order : 1})
        if(!findhandle){
            return res.json({status : false,data : "fail"})
        }else{
            return res.json({status : true,data : findhandle})
        }
    }
}

exports.menudelete = async(req,res,next)=>{
    var indata = req.body.data
    var outdata = null
    await PaymentMenuModel.findOneAndDelete({_id : indata._id}).then(rdata=>{
        if(!rdata){
            outdata =false
        }else{
            outdata = true
        }
    })
    if(!outdata){
        return res.json({status : false,data : "fail"})
    }else{
        var findhandle = await PaymentMenuModel.find().sort({order : 1})
        if(!findhandle){
            return res.json({status : false,data : "fail"})
        }else{
            return res.json({status : true,data : findhandle})
        }
    }
}

exports.menuload = async(req,res,next)=>{
    var findhandle = await PaymentMenuModel.find().sort({order : 1})
    if(!findhandle){
        return res.json({status : false,data : "fail"})
    }else{
        return res.json({status : true,data : findhandle})
    }
}

exports.menuloads = async(req,res,next)=>{
    var type = req.body.type;
    if(type == PAYMENTCONFIG.WalletType.Withdrawl){
        let findhandle = await PaymentMenuModel.find({status:true, "paymentMethodType.value":'payout'}).sort({order : 1})
        if(!findhandle){
            return res.json({status:false, data:{bool:3, data:"server error"}})
        }else{
            return res.json({status:true, data:findhandle})
        }
    }else{
        let findhandle = await PaymentMenuModel.find({status:true, "paymentMethodType.value":'deposit'}).sort({order : 1})
        if(!findhandle){
            return res.json({status:false, data:{bool:3, data:"server error"}})
        }else{
            return res.json({status:true, data:findhandle})
        }
    }
}