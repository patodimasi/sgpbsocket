var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var planos_schema = new Schema({
    
    PLN_FECHA: {type: String},
    PLN_CODIGO: {type: String},
    PLN_DESCRIPCION: {type: String},
    PLN_NRO_REV: {type: Number},
    PLN_USUARIO_ALTA: {type: String},
    PLN_USUARIO_APR: {type: String},
    PLN_FECHA_APR: {type: String},
    PLN_USUARIO_REC: {type: String},
    PLN_FECHA_REC: {type: String},
    PLN_UBICACION:{type: String},
    PLN_ESTADO:{type: String},
    PLN_SUPERADO:{type: String},
    PLN_COMENTARIO:{type: String}


})
    module.exports = mongoose.model("planos",planos_schema);