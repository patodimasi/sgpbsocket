var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuarios_schema = new Schema({
    USR_CODIGO:{type: Number},
    USR_NOMBRE:{type:String},
    USR_APELLIDO:{type: String},
    USR_LOGON:{type: String},
    USR_PASS:{type: String},
    USR_ESTADO: {type: String},
    USR_INICIAL: {type: String},
    USR_LABEL: {type: String},
    USR_FOTO: {type: String}
});

module.exports = mongoose.model("usuarios",usuarios_schema);