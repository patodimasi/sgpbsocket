var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var permisos_schema = new Schema({
    PER_CODIGO:{type: Number},
    PER_INGJ:{type:String},
    PER_INGS:{type: String},
    PER_CC:{type: String},
    PER_P:{type: String},
    PER_ADMIN: {type: String},
    PER_ROOT: {type: String}
});

module.exports = mongoose.model("permisos",permisos_schema);