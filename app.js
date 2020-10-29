var path = require('path');
var express = require('express');
var app = express();
var url = require('url');
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
var manuales = require("./models/manuales");
var materiales = require("./models/materiales");
var multer = require("multer");
  

var sharp = require('sharp');

var storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, './public/uploadas')
    },
    filename: function (req, file, cb){
      cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage,
    
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(null, false, new Error("Only images are allowed"))
        }
        cb(null, true);
      }
});

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
                    }
                        
                }
                res.write(JSON.stringify(Result_op)); 
                return res.end();
            })
             
        }
     
         
    })
    
});

//----------------------------------------------------------Busca todos los documentos---------------------------------------
//---------------------------------------------------------------------------------------------------------------------------

app.get('/buscarTodos',(req,res)=>{
    var buscarTodos = mongoose.model(req.query.nombre_tabla_consultat);
    
    buscarTodos.aggregate([
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
            "PLN_COMENTARIO": {$first:"$PLN_COMENTARIO"},
            "ID":{$first:"$_id"},
            
        }}
    ]
        ,function(err,docs) {
            if(err) throw err;
            res.write(JSON.stringify(docs));
            return res.end();
      
        }
    );    
      
});

//----------------------------------------------------Rechazar documentos------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

app.get('/rechazar',(req,res)=>{
    
    var rechazar = mongoose.model(req.query.nombre_tabla_rech);
    console.log(req.query.nombre_tabla);
    msj_rech = []
    msj_result = "";
    var Result_op = null;
    rechazar.findOneAndUpdate({_id:req.query.inforp}, {$set:{PLN_ESTADO:"R"}},{new:true}, function(err, item) {
       //  if (err) throw err;
       console.log(item)
        if(err)
            Result_op =
            {
                msj_op : "NO_OK",
                msj_ver : "Error al realizar el update en la base de datos,no se pudo rechazar el documento"
            }
        
        else{
            Result_op =
                {
                    msj_op : "OK",
                    msj_ver : item
                }               
            
        }
         
        console.log(Result_op);   
        res.write(JSON.stringify(Result_op)); 
        return res.end(); 
    })
    
});

//----------------------------------------------------Nueva revision del documento---------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
app.get('/confirmar_nuevarev',(req,res)=>{
    msjnrev = null;
    var nueva_rev = mongoose.model(req.query.nombre_tabla_nuevarev);
    console.log(req.query);
    nueva_rev.create(req.query, function(err, resultadonrv) {
        if (err){
           
            msjrev = "NO_OK"; 
        }
        else{
            msjrev = "OK";
            
        }
            res.write(JSON.stringify(msjrev)); 
            return res.end(); 
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

//--------------------------------------------Imagen usuario-------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------

app.post('/upload', upload.single('file'), function (req, res, next) {

    try{
        console.log(req.file);
      
        console.log(req.url);
        
        var nomnre = ((req.url).split("?"))[1];
        console.log(nomnre);
    
        var url = '/uploadas/' + req.file.filename;
        console.log("-----------------CAMBIO DE FOTO---------------");
        console.log("logon usuario" + " " +  global.logonusu);
        var group = (req.file.filename.split(".")[0]);
        console.log("Este es el archivo " + " " + req.file.filename)
        sharp(req.file.path)
        
    
        .toFile('public/uploadas/' + group + "-resize.jpg", function (err) {
               
            if (err) console.log(err);
             
            usuarios.updateOne({USR_LOGON: nomnre},{$set:{USR_FOTO: '/uploadas/' + group + '-resize.jpg',USR_LABEL:req.file.filename}}, function(err, result) {
                console.log("1");
                    console.log(result);
                console.log("2");    
                    res.json({
                        code : 1,
                        data :'/uploadas/' + group + "-resize.jpg"
                    });
                    res.end();
    
                });
        });
        } catch (ex) {
            res.json({
                code : 2,
                data :'/uploadas/' + group + "-resize.jpg"
            });
            res.end();
      }
});
    