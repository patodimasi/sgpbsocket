var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productos_schema = new Schema({
    
    PLN_FECHA: {type: String},
    PLN_NOMBRE: {type: String},
    PLN_INICIO: {type: String},
    PLN_DESCRIPCION: {type: String}
   
})
    module.exports = mongoose.model("productos",productos_schema);