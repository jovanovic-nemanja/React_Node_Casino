const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BazaarModel = ()=>{
    var bazaarSchema = new Schema({
        bazaarname : {type : String,required : true},
        bazaartype : {type : String,required : true},
        ownership : {type : String,required : true},
        status : {type : Boolean,default : false},
        postCalled : {type : String,required : true},
        timers : {type : Object,required : true},
        updated_at: { type: Date, default: Date.now,},
        gamelink : {type : Object,default :{}}
    });
    return  mongoose.model("matka_Bazaar", bazaarSchema)
}

const GamesModel = () =>{
    var gameSchema = new Schema({
        name: { type: String, max: 50, min: 2 },
        image: String,
        bool : {type : String,required : true},
        status: Boolean,
        updated_at: { type: Date,default: Date.now, },
    });
    return  mongoose.model("matka_Game", gameSchema)
}

const ApplicationsModel = () =>{
    var gameSchema = new Schema({
        applicationsname: { type: String, required : true },
        status: Boolean,
        bazaarlink : {type : Object,default :{}},
        updated_at: { type: Date,default: Date.now, },
    });
    return  mongoose.model("matka_application", gameSchema)
}

const NumbersModel = () =>{
    var gameSchema = new Schema({
        gamenumbers: { type: Object, default : {} },
        bool : {type : String,required: true},
        updated_at: { type: Date,default: Date.now, },
    });
    return  mongoose.model("matka_numbers", gameSchema)
}

const matka_betmodels = () =>{
    var gameSchema = new Schema({
        DATE: { type: Date,default: Date.now, },
        amount: { type: Number, required : true },
        betnumber: { type: String, required : true },
        bazaarid: { type: String, required : true },
        gameid: { type: String, required : true },
        roundid: { type: String, required : true },
        transactionid: { type: String, required : true },
        type: { type: String, required : true },
        status: { type: String, required : true },
        USERID: { type: String, required : true },
        time_flag : {type : String,required : true}
    });
    return  mongoose.model("matka_betmodels", gameSchema)
}

const Result_model = () =>{
    var gameSchema = new Schema({
        jodiresult: { type: String, required : true },
        closeresult: { type: String, required : true },
        openresult: { type: String, required : true },
        bazaarid: { type: String, required : true },
        resultdate: { type: Date, required : true },
        createdby: { type: String, required : true },
        DATE: { type: Date,default: Date.now, },
        update :{type : Boolean,default : false}
    });
    return  mongoose.model("matka_result", gameSchema)
}

module.exports = {
    BazaarModel : BazaarModel(),
    GamesModel : GamesModel(),
    ApplicationsModel : ApplicationsModel(),
    NumbersModel : NumbersModel(),
    matka_betmodels : matka_betmodels(),
    result_model : Result_model()
}
