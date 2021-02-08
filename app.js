var path = require('path');
var express = require('express');
var app = express();
var url = require('url');
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
var planos = require("./models/planos");
var manuales = require("./models/manuales");
var materiales = require("./models/materiales");
var instructivodeensayos = require("./models/instructivodeensayos");
var instructivodeproducciones = require("./models/instructivodeproducciones");
var subinstructivodeproducciones = require("./models/subinstructivodeproducciones");
var productos = require("./models/productos");
const fs = require('fs');
var _ = require('lodash');
var program = require('commander');

var multer = require("multer");
var sharp = require('sharp');
var async = require('async');

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
                    "PLN_UBICACION" :{$first:"$PLN_UBICACION"},
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
            "PLN_UBICACION" :{$first:"$PLN_UBICACION"},
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


//---------------------------------------------------visualiza el maximo de un plano a dar de alta--------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------
app.get('/maxp',(req,res)=>{
    var nummax = null;

    var max = planos.find().sort({'PLN_CODIGO': -1}).limit(1)
    
    max.exec(function(err, maxResult){
        if(err) throw err;
        
        else{
          console.log("El maximo del documento a dar de alta es:" + " " + maxResult[0].PLN_CODIGO);
          nummax = ((maxResult[0].PLN_CODIGO.split('-')[1]));
          console.log(nummax + 1);
          nummax = parseInt((maxResult[0].PLN_CODIGO.split('-')[1])) + 1 ;
           
          
          res.write(JSON.stringify("DB4-" + nummax));
          return res.end();
            
        }
       
    });
    
  
});
//--------------------------------------------------------------visualiza el maximo de un instructivo de ensayo---------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
app.get('/altaie', function(req, res){
    console.log("nombre del ensayo" + " " + req.query.nombreensayo);
    var  filtro = {}

    switch(req.query.nombreensayo) {
        case "Ensayo Recepción":
          text = "IB10-01";
          break;
        case "Ensayo Producción":
          text = "IB10-02";
          break;
        case "Ensayo Final":
          text = "IB10-03";
          break;
        default:
          text = null
    }
     

    filtro.PLN_CODIGO = {'$regex' : '.*' +  text };

   instructivodeensayos.aggregate([
        { $match: 
            filtro
        },
        {$sort: {"PLN_CODIGO": -1}},
    
        ]
        ,  function(err,docs) {
            var group = parseInt((docs[0].PLN_CODIGO.split("-")[1])) + 1;
            res.write(JSON.stringify("IB10-0" + group));
            return res.end();
        }
    );     
    
});
//--------------------------------------------------------------visualiza el maximo de un manual,plano, instructivo prod y subinstrucito----------
//------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/maxdoc',(req,res)=>{
    var nummax = null;
    var text = null;
    //console.log(req.query.nombre_tabla_maximo);
    switch(req.query.nombre_tabla_maximo) {
        case "planos":
          text = "DB4-";
          break;
        case "manuales":
          text = "EB4-0";
          break;
        case "instructivodeproducciones":
            text = "IB9-0";
            break;
        case "subinstructivodeproducciones":
            text = "SB9-0";
            break;
        default:
          text = null
    }
    var maxdoc = mongoose.model(req.query.nombre_tabla_maximo);

    var max = maxdoc.find().sort({'PLN_CODIGO': -1}).limit(1);

    max.exec(function(err, maxResult){
        if(err) throw err;

        else{
          
            nummax = parseInt((maxResult[0].PLN_CODIGO.split('-')[1])) + 1

            res.write(JSON.stringify(text + nummax));
            return res.end();
        }
    });
   
});

//----------------------------------------------------Trae los badges de todos los docuentos------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------

app.get('/maximobadge',(req,res)=>{
    var Resultdoc = null;
    
    async.parallel([
        function(callback){
            planos.find({PLN_ESTADO : "A"},callback);
           
        },
        
        function(callback){
            materiales.find({PLN_ESTADO : "A"},callback);
            
        },
        function(callback){
            manuales.find({PLN_ESTADO : "A"},callback);
            
        },
        function(callback){
            instructivodeensayos.find({PLN_ESTADO : "A"},callback);
            
        },
        function(callback){
            instructivodeproducciones.find({PLN_ESTADO : "A"},callback);
            
        },
        function(callback){
            subinstructivodeproducciones.find({PLN_ESTADO : "A"},callback);
            
        },

    ],
    function(err, results){
        Resultdoc =
        {
            res_plano : results[0].length,
            res_materiales : results[1].length,
            res_manuales : results[2].length,
            res_instructivodeensayos : results[3].length,
            res_instructivodeproducciones : results[4].length,
            res_subinstructivodeproducciones : results[4].length,
        }
       
        res.write(JSON.stringify(Resultdoc));
        return res.end();
       
    });
});


//------------------------------------------------------ Muestra el maximo de cada producto de una lista de materiales-------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
app.get('/buscarmaxlm',(req,res)=>{
    var codigoinicio = null;
    productos.find({PLN_NOMBRE:req.query.nombre}, function(err, lista) {
          
        if(err) throw err;
  
        var codigo = {'$regex': '.*' + lista[0].PLN_INICIO + '.*'}
        codigoinicio = lista[0].PLN_INICIO;
         // deberia fijarme que exista el producto 
         
        materiales.find({PLN_CODIGO: codigo}).sort( [['PLN_CODIGO', 'desc']]).exec(function(err, collectionItems) {
            if(err) throw err;
            if(collectionItems == ""){
                    // var codigofinal = codigoinicio + "/" + 1 ;
                    var codigofinal = codigoinicio  + "/00" + 1; 
                    console.log("es la primera lm del producto" + " " +  codigoinicio + "/" + 1 );
            }
                
            else
            {
                    
                var codigoaux = (collectionItems[0].PLN_CODIGO.split("/")[1]);
                var codigoauxsum = (parseInt(codigoaux) + 1);
                    
                inputData = String(codigoauxsum); // Cast to string
    
                if(inputData.length == 1){
    
                    var codigofinal = (collectionItems[0].PLN_CODIGO.split("/")[0]) + "/00" + (parseInt(codigoaux) + 1);
                }
    
                else if(inputData.length == 2) {
                    var codigofinal = (collectionItems[0].PLN_CODIGO.split("/")[0]) + "/0" + (parseInt(codigoaux) + 1);
                } 
                      
            }    

            res.write(JSON.stringify(codigofinal)); 
            return res.end();  
                  
        })
          
    });

});   
  

//----------------------------------------------------Confirma el alta de un documento-----------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

app.get('/alta',(req,res)=>{
    
    var f = new Date();
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
    var alta = mongoose.model(req.query.nombre_tabla_alta);
       
    var myobj = 
        { PLN_FECHA: fecha,PLN_CODIGO:req.query.codigo,PLN_DESCRIPCION:req.query.descripcion,PLN_UBICACION:req.query.ubicacion, PLN_NRO_REV:0,PLN_ESTADO:"A",
         PLN_USUARIO_ALTA:req.query.logon,PLN_USUARIO_APR: "",PLN_FECHA_APR:""};
     
    alta.create(myobj, function(err, resultadop) {
        if (err){
          
           var msjerror = "NO_OK"
        }
        else{
        
            var msjerror = "OK"
            console.log("1 document inserted");
            res.write(JSON.stringify(msjerror));
            return res.end();
        }    
    });    
});

//----------------------------------------------------Ubicacion de un documento------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
app.get('/getUbicaciondoc', function(req, res){
    var ubicacion = mongoose.model(req.query.nombre_tabla_ubicacion);    
    ubicacion.find({_id:req.query.id_ubi}, function(err, plano) {
        if(err) throw err;

        fs.exists(plano[0].PLN_UBICACION,function(exists){
            console.log(plano[0].PLN_UBICACION);
            if(exists){
                var ubiResult =
                {
                    resultado : "OK",
                    url :    "/altapAux.html",
                    ubicacion : plano[0].PLN_UBICACION       
                }
                
            }else{
                 var ubiResult =
                {
                    resultado : "NOOK"
             
                }
            }
           
            res.write(JSON.stringify(ubiResult)); 
            return res.end(); 
        });
       
    });
});

app.get('/files', function(req, res) {

    let dir = req.query.ubi;
   // console.log("la primera dir" + "" + dir)
    currentDir =  dir;
    var query = req.query.path || '';
   // console.log("el query" + "" + query);
    if (query) currentDir = path.join(dir, query);
   // console.log("browsing ", currentDir);
    fs.readdir(currentDir, function (err, files) {
        if (err) {
           throw err;
         }
         var data = [];
         files
         .filter(function (file) {
             return true;
         }).forEach(function (file) {
           try {
                   //console.log("processing ", file);
                   var stats = fs.statSync(path.join(currentDir,file));
                   var time = stats["atime"];
                   var date = time.toString().substr(4,11);
   
                   var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                   if (isDirectory) {
                     data.push({ Name : file,Date : date, IsDirectory: true, Path : path.join(query, file)  });
                   } else {
                     var ext = path.extname(file);
                     if(program.exclude && _.contains(program.exclude, ext)) {
                       console.log("excluding file ", file);
                       return;
                     }       
                     data.push({ Name : file,Date:date, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
                   }
   
           } catch(e) {
             console.log(e); 
           }        
   
         });
         data = _.sortBy(data, function(f) { return f.Name});
         res.json(data);
    });
    
});
   
app.get('/Documento', function(req, res) {
    let file;
    var direccionfinal = req.headers.referer.split("ubi=")[1];
    file = direccionfinal + "\\" + (req.query.f);
    console.log("segunda direccion " + file);
    res.sendFile(decodeURIComponent(req.query.f));
});

app.get('/Ubi', function(req, res) {
    let file;
    var direccionfinal = decodeURIComponent(req.headers.referer.split("ubi=")[1]);
    
    console.log("esta es la direccion final" + " " +direccionfinal);
    console.log("esta es la req.query "  + (req.query.f) );

    file = direccionfinal + "\\" + (req.query.f);
  
    console.log("este es el file " +file);

    var archivo = (req.query.f.split("\\"));
  
    var archivo2 = archivo[archivo.length -1];

    res.send(
        "<html>"+
            "<head>"+
                "<title>" + archivo2 + "</title>"+
                "<style type='text/css'>"+
                "html, body, div, iframe { margin:0; padding:0; height:100%; }"+
                "iframe { display:block; width:100%; border:none; }"+
                "</style>"+
            "</head>"+
            "<body>"+
            "<iframe width='100%' length='100%' src='/Documento?f=" + encodeURIComponent(file) + "'>"+
            "</body>"+
        "</html>"
      );
})

//------------------------------------Muestra  la ubicacion actual de un documento------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------
app.get('/modif_ubi', function(req, res) {
    var modif_ubi = mongoose.model(req.query.nombre_tabla_modif_ubi);
    modif_ubi.find({_id: req.query.ubiplano},function(err,plano){
        if (err){
            throw err;
        }
        
        res.write(JSON.stringify(plano[0].PLN_UBICACION)); 
        return res.end();   
    })

});
//-------------------------------------------------Modifica la ubicacion de un documento-----------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
app.get('/aceptarmodif_ubi', function(req, res) {
    
    var msjerror = null;
    var aceptarmodif_ubi = mongoose.model(req.query.nombre_tabla_acep_modif_ubi);
    
    aceptarmodif_ubi.updateOne({_id:req.query.aceptar_ubip},{$set:{PLN_UBICACION:req.query.ubi_modifp}}, function(err, result) {
        if(err){
            msjerror = "NO_OK"
        }
        else{
            msjerror = "OK"
            res.write(JSON.stringify(msjerror)); 
            return res.end();   
        }
       
      console.log(result);
    });
});

//---------------------------------------------------Consulta los pendientes de aprobación de un documento---------------------
//-----------------------------------------------------------------------------------------------------------------------------
app.get('/buscarTodos_pen',(req,res)=>{
    console.log(req.query.nombre_tabla_consultat);
    var consulta_pen= mongoose.model(req.query.nombre_tabla_consultat);
   
    consulta_pen.aggregate([
        { 
            $match : {PLN_ESTADO : "A"}
        },
        {$sort: {"PLN_NRO_REV":-1}},
        
        { $group: {
            "_id": "$PLN_CODIGO",
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
            "PLN_COMENTARIO" : {$first:"$PLN_COMENTARIO"}
            
        }},
    ],  function(err,docs) {
            console.log(docs);
            res.write(JSON.stringify(docs));
            return res.end();
        }
    );     

});
//------------------------------------------------- Consulta de pendiente de aprobacion en el  detalle----------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/detallehisto_pen',(req,res)=>{
    
    //traigo todos los planos que coincidan con la busqueda, ya no tengo dos tablas
    var groupModel_dpen = mongoose.model(req.query.nombre_tabla_detalle);

    groupModel_dpen.aggregate([
        { 
            $match : {PLN_ESTADO : "A",PLN_CODIGO:req.query.name}
        },

     
    ],  function(err,docs) {
            res.write(JSON.stringify(docs));
            return res.end();
        }
    );     
  
});



//----------------------------------------------------Usuarios-------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------


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
               //url : "/prueba.html",
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

//----------------------------------------------------Productos-----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------Trae todos los productos para dar de alta una lista de materiales----------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/traerprod',(req,res)=>{
    
    productos.find(function(err, productos){
        if(err) throw err;
      //  console.log("Estos son los productos" + " " + productos);
        res.write(JSON.stringify(productos));
        return res.end();
        
   });
});

//-------------------------------------------------Guarda el producto en la base de datos---------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/guardarprod',(req,res)=>{
    var nummax = null;
    var newlist = " ";

    //console.log("llega al guardar" + " " + req.query.msj);

    if(req.query.msj == "alta"){
       //maximo producto
        

        var max = productos.find().sort({'PLN_INICIO': -1}).limit(1)
            max.exec(function(err, maxResult){
                if(err) throw err;
                
                else{
                    // console.log("El maximo del plano es:" + " " + maxResult[0].PLN_INICIO);
                    nummax = ((maxResult[0].PLN_INICIO.split('-')[1]));
                    
                    nummax = parseInt((maxResult[0].PLN_INICIO.split('-')[1])) + 1 ;
        
                    newlist = "LB9-0" + nummax;
                    
                }
                
           // });
                var myobj = 
                { PLN_FECHA: req.query.fecha,PLN_NOMBRE:req.query.nombre,PLN_DESCRIPCION:req.query.descripcion,PLN_INICIO:newlist};
                
                productos.create(myobj, function(err, resultadop) {
                    if (err){
                    
                    var msjerror = "NO_OK_ALTA"
                    }
                    else{
                    
                        var msjerror = "OK"
                        res.write(JSON.stringify(msjerror));
                        return res.end();
                    }    
                });    
            });

    }

    else
    {
       
        productos.updateOne({_id:req.query.id},{$set:{PLN_FECHA:req.query.fecha,PLN_NOMBRE:req.query.nombre,PLN_DESCRIPCION:req.query.descripcion}}, function(err, result) {
            if(err){
                msjerror = "NO_OK_UPDATE"
            }
            else{
               // console.log("este es el resultado" + result);
                msjerror = "OK"
                res.write(JSON.stringify(msjerror)); 
                return res.end();   
            }
        });
    }
   


   
});

//----------------------------------------------------------Eliminar producto de la base de datos-----------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/eliminarprod',(req,res)=>{
    console.log("este es el id del producto" + " " + req.query.row);

    var myquery = { _id: req.query.row };

    productos.deleteOne(myquery, function(err, obj) {
        if(err){
            msjerror = "NO_OK"
        }
        else{
            msjerror = "OK"
            res.write(JSON.stringify(msjerror)); 
            return res.end();   
        }
   
    });
  
});

//-------------------------------------------------Valido que el nombre de la lista de materiales no se repita-----------------------------
//----------------------------------------------------------------------------------------------------------------------------------------- 

app.get('/validarnomblm',(req,res)=>{

    //  console.log("nombre de la celda" + " " + req.query.nombrecel);
      productos.find({PLN_NOMBRE:req.query.nombrecel}, function(err, lista) {
          console.log(lista);
          if(lista == ""){
              var msj = "OK"
             
          }
          else{
              var msj = "NO_OK"
            
          }
          console.log("mensaje de error" + " " + msj);
          res.write(JSON.stringify(msj));
          return res.end();
          
      });        
  
  });
  