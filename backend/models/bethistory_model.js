const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseCon = require("../controller/basecontroller");
const nowdate = BaseCon.get_date();

module.exports.BettingHistory_model =(dt = nowdate)=>{
    var  UserSchema = new Schema({
        GAMEID : {
            type : String,
            required : true,
        },
        USERID : {
            type : String,
            required : true  
        },
        LAUNCHURL : {
            type : String,
            required : true
        },
        AMOUNT : {
            type : Number,
            required : true
        },
        betting : {
            type :Object,
            required : true,
            default : {
                prevbalance : 0
            }
        },
        TYPE : {
            type : String,
            required : true
        },
        DATE: {
            type: Date,
            default: Date.now
        },
    });
    try {
        return mongoose.model(dt + "_Betting_history", UserSchema);
    } catch (e) {
        return mongoose.model(dt + "_Betting_history");
    }
}