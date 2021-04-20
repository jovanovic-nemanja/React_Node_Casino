const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ListSchema = new Schema({
    sport_id        : { type : String , required : true },
    sport_name      : { type : String , required : true },
    viewBox         : { type : String , default : "" },
    icon            : { type : String , default : "" },
    color           : { type : String , default : "" },
    category_len    : { type : Number , required : true },
    order           : { type : Number , default : 0 },
    category        : { type : Array , required : true },
    status          : { type : Boolean , default : false },
});

var BetSchema = new Schema({
    GAMEID          : { type : String , required : true },
    USERID          : { type : String , required : true },
    LAUNCHURL       : { type : String , required : true }, 
    TYPE            : { type : String , default : "BET" },
    AMOUNT          : { type : Number , required : true },
    betting         : { type : Object , required : true },
    DATE            : { type : Date , default : Date.now },
});

var OddSchema = new Schema({
    event_id        : { type : String , default : "" },
    event_name      : { type : String , default : "" },
    sportid         : { type : String , default : "" },
    ScheduledTime   : { type : String , default : "" },
    EventStatus     : { type : String , default : "" },
    HomeCompetitor  : { type : String , default : "" },
    AwayCompetitor  : { type : String , default : "" },
    Status          : { type : Object , default : {} },
    Venue           : { type : Object , default : {} },
    Season          : { type : Object , default : {} },
    market          : { type : Object , default : {} },
    permission      : { type : Boolean , default : true },
    produceStatus   : { type : Boolean , default : true },
});

var TimeSchema = new Schema({
    key             : { type : String , required : true },
    timestamp       : { type : String },
});

var TestSchema = new Schema({
    data            : { type : Object , default : {} }
});

module.exports = {
    sports_list : mongoose.model('sports_list', ListSchema),
    user_bet : mongoose.model('sports_bethistory', BetSchema),
    odds_change : mongoose.model('sports_oddsChange', OddSchema),
    sporttemp : mongoose.model('sports_timestamp', TimeSchema),
    sporttest : mongoose.model("sports_test" , TestSchema)
}