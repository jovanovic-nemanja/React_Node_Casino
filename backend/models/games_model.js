const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pokerConfig = require('../config/winpokerConfig/winpokerConfig');

const PROVIDERMODELS = ()=>{
    var  UserSchema = new Schema({
        type: {
            type: Object,
            default : {}
        },  
        provider: {
            type: String,
            required  :true,
        },
        text: {
            type: String,
            required  :true,
        },
        bool : {
            type : Object,
            required : true
        },
        order : {
            type : Number,
            default : 0
        },
        status : {
            type : Boolean,
            default : false
        },
        Route : {
            type : Boolean,
            default : false
        },
        Money : {
            type : String,
            required : true
        },
        Percentage : {
            type : String,
            required : true
        },
        currency : {
            type : String,
            required : true
        },
        Type : {
            type : String,
            required : true
        },
        LAUNCHURL : {
            type : String,
            required : true
        },
        Agregator : {
            type : String,
            required : true
        }

    });
  return  mongoose.model("game_gameprovider", UserSchema)
}

const GAMELISTMODEL = () =>{
    var  UserSchema = new Schema({
        TYPE: {
            type: String,
            default : ''
        },
        ID : {
            type : String,
            default : ''
        },
        NAME : {
            type : String,
            default : ''
        },    
        status : {
            type : Boolean,
            default : false
        },
        backImage : {
            type : String,
            default : "",
        },
        gameImage : {
            type : String,
            default : "",
        },
        fpstatus : {
            type : Boolean,
            default : false
        },
        PROVIDERID :{
            type : String,
            default : ""
        },
        WITHOUT : {
            type:Object,
            default :{
                maxbet : 0,
                minbet : 0
            }
        },
        LAUNCHURL : {
            type : String,
            required : true
        },
        image : {
            type : String,
            default : ""
        },
        order :{
            type : Number,
            required : true
        }
    });
    return mongoose.model("game_game_list", UserSchema)
}


const FIRSTPAGE_GAMELIST_MODEL = ()=>{
    var  UserSchema = new Schema({
        gameid : {
            type : String,
            required : true
        },
        order : {
            type : Number,
            default : 0
        },
        status : {
            type : Boolean,
            default : false
        },
        type : {
            type : String,
            required : true
        }
    });
  return  mongoose.model("game_firstpage_list", UserSchema)
}

const POKERROOMMODEL = ()=>{
    const RoomSchema = new Schema({
        roomName        : { type : String , required : true },
        roomType        : { type : String , required : true },
        operator        : { type : String , required : true },
        status          : { type : String , default : pokerConfig.WAITING },
        roundname       : { type : String , default : pokerConfig.DEAL },
    
        minplayers      : { type : Number , required : true },
        maxplayers      : { type : Number , required : true },
        minbuyin        : { type : Number , required : true },
        maxbuyin        : { type : Number , required : true },
        smallblind      : { type : Number , required : true },
        bigblind        : { type : Number , required : true },
        allPot          : { type : Number , default : 0 },
        timeout         : { type : Number , default : 0 },
        lastActionamount: { type : Number , default : 0 },
    
        board           : { type : Array , default : [] },
        deck            : { type : Array , default : [] },
    
        lastActionTime  : { type : Date , default : 0 },
    });
  return  mongoose.model("poker_rooms", RoomSchema)
}



module.exports = {
    PROVIDERMODELS : PROVIDERMODELS(),
    GAMELISTMODEL : GAMELISTMODEL(),
    FIRSTPAGE_GAMELIST_MODEL : FIRSTPAGE_GAMELIST_MODEL(),
    POKERROOMMODEL: POKERROOMMODEL()
}
