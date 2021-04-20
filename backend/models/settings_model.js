const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const provider_credential = () =>{
    var  UserSchema = new Schema({
        ProviderName : {
            type : String,
            required : true
        },
        operatorid : {
            type : String,
            required : true
        },
        passkey : {
            type : String,
            default : ""
        },
        detail : {
            type : Object,
            required : true
        },
        launchID : {
            type : String,
            required : true,
            unique : true
        }
    });
    return mongoose.model("setting_providercredential", UserSchema)
}

module.exports ={
    provider_credential : provider_credential()
}