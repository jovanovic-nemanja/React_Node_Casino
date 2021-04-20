const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SliderIMGModel = () =>{
    var  UserSchema = new Schema({
        order: {
            type: Number,
            default : 0
        },
        image: {
            type: String,
            required : true
        },
        data : {
            type:Object,
            required : true
        },
        bool  :{
            type : String,
            required  :true,
        }
    });
    return mongoose.model("tbl_SliderIMGModel", UserSchema)
}

const firstMenuModel = () =>{
    var  UserSchema = new Schema({
        icon:{
            type : String,
            default : ''
        },
        title:{
            type : String,
            default : ''
        },
        navLink:{
            type : String,
            default : ''
        },
        order : {
            type : Number,
            default : 0
        },
        status : {
            type : Boolean,
            default : false
        },
        mobileicon : {
            type :String,
            default : ""
        },
        bool : {
            type : String,
            required  :true
        }
    });
    return mongoose.model("tbl_firstMenuModel", UserSchema)
}



const firstpagesetting = () =>{
    var  UserSchema = new Schema({
        type: {
            type: String,
            default : ""
        },
        content: {
            type: String,
            default : ''
        }
    });
    return mongoose.model("tbl_firstpagesetting", UserSchema)
}

const FirstpagePaymentMethodImg = () =>{
    var  UserSchema = new Schema({
        image:{
            type : String,
            default : ''
        }
    });
    return mongoose.model("tbl_FirstpagePaymentMethodImg", UserSchema)
}

const FirstpageProviderImg = () =>{
    var  UserSchema = new Schema({
        image:{
            type : String,
            default : ''
        }
    });
    return mongoose.model("tbl_firstpageProviderImg", UserSchema)
}


module.exports = {
    SliderIMGModel : SliderIMGModel(),
    FirstpageProviderImg : FirstpageProviderImg(),
    FirstpagePaymentMethodImg : FirstpagePaymentMethodImg(),
    firstpagesetting : firstpagesetting(),
    firstMenuModel : firstMenuModel(),
};