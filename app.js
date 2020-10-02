var path = require('path');
var express = require('express');
var app = express();
var url = require('url');
var mongoose = require('mongoose');
var usuarios= require("./models/usuarios");
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
app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});

//-----------------------------------------------------Login usuarios--------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
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