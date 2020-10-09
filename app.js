var path = require('path');
var express = require('express');
var app = express();
var url = require('url');
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
mongoose.set('useFindAndModify', false);
//settings
app.set('port',3000);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//mongo connect


mongoose.connect('mongodb://localhost:27017/SGPB',{ useNewUrlParser: true,useUnifiedTopology: true },function(err,res){
    if(err) throw err;
    console.log('Base de datos conectada');
});

//start server
const server = app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});

//socket

const SocketIO = require('socket.io');
const io = SocketIO(server);

io.on('connection',(socket) => {
    console.log('new connection');
    socket.on('refrescar',(data) => {
        io.sockets.emit('refrescar',data)
    });    
});
//----------------------------------------------------Documentos------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------Consulta de un solo documento------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

app.get('/buscar',(req,res)=>{
    var buscar = mongoose.model(req.query.nombre_tabla_consulta);
    var  filtro = {}
    if((req.query.codigo == '') && (req.query.nrorev == '') && (req.query.descripcion == ''))
    {
        res.write(JSON.stringify([]));
        return res.end();  
    }
    else
    {
        if(req.query.codigo != '')
        {
            filtro.PLN_CODIGO = {'$regex': '.*' + req.query.codigo + '.*',$options : 'i'}       
        }
   
        if(req.query.nrorev != '')
        {
            filtro.PLN_NRO_REV = parseInt(req.query.nrorev);
        }
   
        if(req.query.descripcion != '')
        {
            filtro.PLN_DESCRIPCION = {'$regex': '.*' + req.query.descripcion + '.*',$options : 'i'}
        } 
 
        buscar.aggregate([
            { $match: 
            
                filtro  
             },
            {$sort: {"PLN_NRO_REV":-1}},
            {$group:{"_id": "$PLN_CODIGO",
                    "PLN_CODIGO":{$first: "$PLN_CODIGO"},
                    "PLN_NRO_REV" : {$first:"$PLN_NRO_REV"},
                    "PLN_DESCRIPCION" :{$first:"$PLN_DESCRIPCION"},
                    "PLN_ESTADO":{$first:"$PLN_ESTADO"},
                    "PLN_USUARIO_ALTA":{$first:"$PLN_USUARIO_ALTA"},
                    "PLN_FECHA":{$first:"$PLN_FECHA"},
                    "PLN_FECHA_APR": {$first:"$PLN_FECHA_APR"},
                    "PLN_USUARIO_APR": {$first:"$PLN_USUARIO_APR"},
                    "PLN_FECHA_REC": {$first:"$PLN_FECHA_REC"},
                    "PLN_USUARIO_REC": {$first:"$PLN_USUARIO_REC"},
                    "PLN_COMENTARIO" : {$first:"$PLN_COMENTARIO"},
                    "ID":{$first:"$_id"},
                    
            }}
            ]
            ,  function(err,docs) {
                 res.write(JSON.stringify(docs));
                 return res.end();
              
             }
         );    
          
    }
   
});

//----------------------------------------------Detalle del documento-----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

app.get('/detallehisto',(req,res)=>{
    //traigo todos los planos que coincidan con la busqueda, ya no tengo dos tablas
    var detallehisto = mongoose.model(req.query.nombre_tabla_detalle);
    detallehisto.find({PLN_CODIGO:req.query.name}, function(err, plano) {
        res.write(JSON.stringify(plano));
        return res.end();
    });
  
});

//-----------------------------------------------Aprobar documento--------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

//Aprobar un documento
app.get('/aprobar',(req,res)=>{
    msj_apro = []
    var f = new Date();
    
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
    var Result_op_apr = null;

    var groupModelap = mongoose.model(req.query.nombre_tabla_aprobar);

    //primero busco si hay un documento en verde, ya que tendra que ser cambiado a rojo, si hay lo pongo en un arreglo
    var groupModelap = mongoose.model(req.query.nombre_tabla_aprobar);
    groupModelap.findOneAndUpdate({PLN_CODIGO:req.query.codigo,PLN_ESTADO:"V"}, {$set:{PLN_ESTADO:"R"}},{new:true}, function(err, item) {
        if (err){
            
            Result_op =
            {
                msj_op : "NO_OK",
                msj_ver : "Error al realizar el update en la base de datos,no se pudo aprobar el documento"
            }

            res.write(JSON.stringify(Result_op)); 
            return res.end();  
        } 

        else{
           if(item != null){
                msj_apro.push(item);
           }  
           //modifico el plano en amarillo, pasandolo a verde con el usuario y fecha de aprobacion
           groupModelap.findOneAndUpdate({_id:req.query.id}, {$set:{PLN_ESTADO:"V",PLN_USUARIO_APR:req.query.logon,PLN_FECHA_APR:fecha}},{new:true}, function(err, result) {  
                if (err) {
                    Result_op =
                    {
                        msj_op : "NO_OK",
                        msj_ver : "Error al realizar el update en la base de datos,no se pudo aprobar el documento"
                    }
                }
                else{
                    
                    msj_apro.push(result);

                    Result_op =
                    {
                        msj_op : "OK",
                        msj_ver : msj_apro,
                        resultadoa : result,
                    }
                        
                }
                console.log(Result_op.resultadoa);
                res.write(JSON.stringify(Result_op)); 
                return res.end();

            })
             
        }
     
         
    })
    
});

//----------------------------------------------------Usuarios------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------Login usuarios-----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

app.get('/login',(req,res)=>{

    var q = url.parse(req.url, true);
    usuarios.find({USR_LOGON: q.query.usr,USR_PASS: q.query.pass},function(err,docs){
     
      var loginResult = null;

       if(docs != "" ){
           global.logonusu = docs[0].USR_LOGON;
           
            var loginResult =
            {
                result : "SUCCESS",
                url : "/principal.html",
                iniciales : docs[0].USR_INICIAL, 
                nombre : docs[0].USR_NOMBRE + " " + docs[0].USR_APELLIDO,
                codigo : docs[0].USR_CODIGO,
                foto: docs[0].USR_FOTO,
                label: docs[0].USR_LABEL,
                logon : docs[0].USR_LOGON
            }
            test= q.query.usr;
         
           
       }
       else{
        
        console.log("ERROR");

        var loginResult =
            {
                result : "ERROR"
            }
        }
        console.log("-------------------INICIO-------------------------")
        console.log("Datos de inicio de secion" + " " + JSON.stringify(loginResult));
        res.write(JSON.stringify(loginResult));
        return res.end();
        
    });   
    
});

//--------------------------------------------Muestra los permisos de los usuarios----------------------------------------
//------------------------------------------------------------------------------------------------------------------------

app.get('/mostrar_usu',(req,res)=>{
    //console.log("Es el codigo" + " " + req.query.codigo);
    permisos.find({PER_CODIGO: req.query.codigo},function(err, permiso) {
       // console.log("Es el permiso" + " " + permiso);
        res.write(JSON.stringify(permiso));
        return res.end();
    });
    
});