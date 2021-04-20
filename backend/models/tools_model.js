const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toolgetoipblock_model = () =>{
    var  UserSchema = new Schema({
        ipaddress : {
            type : String,
            required : true
        },
        date: {
            type: Date,
            default: Date.now
        },
    });
    return mongoose.model('ipblock_model', UserSchema)
}

module.exports ={
    toolgetoipblock_model : toolgetoipblock_model(),
}