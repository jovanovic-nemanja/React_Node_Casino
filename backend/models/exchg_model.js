const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExchgModel = () =>{
    const ExchgSchema = new Schema({
        Id: { type : Number, required : true },
        Name: { type : String, required : true },
        DisplayOrder: { type : Number, required : true },
        IsEnabledForMultiples: { type : Boolean, required : true },
        icon : { type : String, default : "" },
        viewBox :{ type : String, default : "" },
        color :{ type : String, default : "" },
        Category : {type : Array , default : []},
        status : {type : Boolean , default : false},
    });
    return mongoose.model('exchg_data', ExchgSchema)
}

module.exports ={
    ExchgModel : ExchgModel(),
}