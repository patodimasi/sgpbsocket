var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ensayosfinales_schema = new Schema({
	NENSAYO: {type: String},
	FECHA:	{type: String},	
	PEDIDO: {type: Number},
	NSERIE: {type: Number},
	ESTADO:	{type: String},
	PRODUCTO: {type: String},
	CLIENTE: {type: String},
	DESCRIPCION: {type: String},
	UALTA: {type: String},
	EIME: {type: String}
})
    module.exports = mongoose.model("ensayosfinales",ensayosfinales_schema);