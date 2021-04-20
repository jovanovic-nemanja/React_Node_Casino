const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Paymentconfig = ()=>{
    var  UserSchema = new Schema({
        type           : { type : String,  default : '' },
        configData     : { type : Object,  default : {} },
        state          : { type : Boolean, default : false },
        createDate     : { type : Date,    default: Date.now },
    });
    return mongoose.model("Payment_config", UserSchema)
}

const Payment_history = ()=>{
    var  UserSchema = new Schema({
        type           : { type : String,  default : '' },
        order_no       : { type : String,  required : true },
        amount         : { type : Number,  default : 0 },
        lastbalance         : { type : Number,  default : 0 },
        updatedbalance         : { type : Number,  default : 0 },
        comment         : { type : String,  default : "" },
        email          : { type : String,  default : '' },
        userid: {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        status         : { type : String,  default : '' },
        wallettype         : { type : String,  required:true },
        requestData    : { type : Object,  default : {} },
        resultData     : { type : Object,  default : {} },
        createDate     : { type : Date,    default: Date.now },        
        commission : { type : Number, default : 0 },
        transactionDate    : { type : Date,    default: Date.now },
    });
    return mongoose.model("Payment_history", UserSchema)
}

const Payment_withdrawlrequest = ()=>{
    var  UserSchema = new Schema({
        payoutData    : {type : Object, default:{}},
        amount        : {type : Number, default:0},
        email         : {type : String, default:''},
        first_name    : {type : String, default:''},
        last_name     : {type : String, default:''},
        type          : {type : String, default:''},
        currency      : {type : String, default:''},
        bankType      : {type : String, default:''},
        verify      : {type : Boolean, default:false},
        status        : { type : String,  default : 'pending' },
        comment        : { type : String,  default : '' },
        createDate    : { type : Date,    default: Date.now },
        transactionDate    : { type : Date,    default: Date.now },
        updated_mail : {type : String,default : ""},
        lastbalance : { type : Number,required : true },
        updatedbalance : { type : Number, required : true },
        commission : { type : Number, default : 0 },
        order_no : {type:String,required : true}
    });
    return mongoose.model("Payment_withdrawlrequest", UserSchema)
}

const Payment_ourinfor = () =>{
    var  UserSchema = new Schema({
        name             : {type : String,  default:''},
        type             : {type : String,  default:''},
        paymentType      : {type : String,  default:''},
        paymentMethodType: {type : Object,  default:{}},
        currency         : {type : String,  default:''},
        date             : {type : String,  default:''},
        info             : {type : String,  default:''},
        image            : {type : String,  default:''},
        min              : {type : Number,  default:0},
        max              : {type : Number,  default:0},
        fee              : {type : Number,  default:0},
        order            : {type : Number,  default:0},
        depositBankCode  : {type : Object,  default:[{ value:'', label:'Select...'}]},
        status           : {type : Boolean, default : false},
        createDate       : {type : Date,    default: Date.now },
    });
    return mongoose.model("Payment_ourinfor", UserSchema)
}

const Payment_withdrawl_infor = () =>{
    var  UserSchema = new Schema({
        email            : {type : String,  default:''},
        type             : {type : String,  default:''},
        paymentData      : {type : Object,  default:''},
        createDate       : {type : Date,    default: Date.now },
    });
    return mongoose.model("Payment_withdrawl_infor", UserSchema)
}
const Payment_FTD_model = () =>{
    var  UserSchema = new Schema({
        email            : {type : String,  required : true},
        bonusamount            : {type : String,  required : true},
        date       : {type : Date,    default: Date.now },
    });
    return mongoose.model("payment_FTD_model", UserSchema)
}

module.exports  = {
    PaymentMethod : Payment_withdrawl_infor(),
    Paymentconfig : Paymentconfig(),
    // WithdrawHistory : Payment_withdrawlrequest(),
    PaymentMenuModel : Payment_ourinfor(),
    TransactionsHistory : Payment_history(),
    Payment_FTD_model : Payment_FTD_model()
}