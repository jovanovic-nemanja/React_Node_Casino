const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BonusMenumodel = () =>{
    var  UserSchema = new Schema({
        bonusname : {
            type : String,
            required : true
        },
        order : {
            type : Number,
            required : true,
            unique : true
        },
        status : {
            type : Boolean,
            default :false
        },
        maxdeposit : {
            type : Number,
            required : true
        },
        mindeposit : {
            type : Number,
            required : true
        },
        Wageringreq : {
            type : Number,
            required : true
        },
        startdate : {
            type : Date,
            required : true
        },
        enddate : {
            type : Date,
            required : true
        },
        date: {
            type: Date,
            default: Date.now
        },
    });
    return mongoose.model("promotion_bonusmodel", UserSchema)
}

const BonusHistory = () =>{
    var  UserSchema = new Schema({
        bonusid : {
            type : String,
            required  : true 
        },
        email : {
            type : String,
            required : true
        },
        amount : {
            type : String,
            required : true
        },
        date: {
            type: Date,
            default: Date.now
        },
    });
    return mongoose.model("bonus_history_model", UserSchema)
}


module.exports ={
    BonusMenumodel : BonusMenumodel(),
    BonusHistory : BonusHistory()
}
