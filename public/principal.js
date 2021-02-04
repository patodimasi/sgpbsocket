//inicializacion de objetos tipo documento
var plano = new Plano("Planos","planos");
var manual = new Manual("Manuales","manuales");
var material = new Material("Lista de Materiales","materiales");
var instructivo_ensayo = new InstructivoEnsayo("Instructivos de Ensayo","instructivodeensayos");
var instructivo_produccion = new InstructivoProduccion("Instructivos de Producción","instructivodeproducciones");
var subinstructivo_produccion = new SubinstructivoProduccion("Subinstructivos de Producción","subinstructivodeproducciones");


function Obtener_Badge(){
    $.ajax( {
        type: "GET",
        url: '/maximobadge',
        
      
        success: function(res){
            var jsobadge = JSON.parse(res);
          
            $('#badge_planos').text(jsobadge.res_plano);
            $('#badge_materiales').text(jsobadge.res_materiales);
            $('#badge_manuales').text(jsobadge.res_manuales);
            $('#badge_instructivodeensayos').text(jsobadge.res_instructivodeensayos);
            $('#badge_instructivodeproducciones').text(jsobadge.res_instructivodeproducciones);
            $('#badge_subinstructivodeproducciones').text(jsobadge.res_subinstructivodeproducciones);

        }
 
    });    
}
//login usuario
$(document).ready(function(){
    //agregado formulario modal para el cambio de ubicacion
    $( ".page-wrapper" ).before(htmlModalUbicacion);
    $( ".page-wrapper" ).before(htmlModalNuevaRev);
    $( ".page-wrapper" ).before(htmlModalAltaDoc);
    $( ".page-wrapper" ).before(htmlAltaListaMateriales);
    $( ".page-wrapper" ).before(htmlAltaInstEnsayo);

    //Aca tendria qie estar los badge de cada documento

    Obtener_Badge();  

    //chequeo si existe el nombre del usuario
    if (sessionStorage["nombre"]){
      var nombre = sessionStorage["nombre"];
      var foto = sessionStorage["foto"];
      var label = sessionStorage["label"];
       $('<p>'+ nombre +'</p>').appendTo('#usrnombre');
       //Chequeo si existe la imagen del usuario sino cargo una default
       if(foto == ""){
        $("#imagenf").attr('src',"./images/user.jpg");
       }
       else{
          
          $("#imagenf").attr('src',foto);
          $('.custom-file-label').text(label);    
        }
    }
    else
    {
     $('<p>NN</p>').appendTo('#usrnombre');
     
     $("#pantallap").addClass("disabledbutton");
       
    }
    //Manejo contenedores en el arranque
   $('#dconsultas').hide();
   $('#content').show();
    
    //Cambio de foto
   $("#file").change(Cambiofoto);
  
});

function Cambiofoto() {  
    var fd = new FormData();
    var files = $('#file')[0].files[0];
    console.log(files.name);
  //  $('.custom-file-label').text(files.name);  
    var nombre = sessionStorage["logon"];
    fd.append('file',files);
    
   $.ajax({
        //url: '/upload',
        //url:"/upload?nombre="+nombre,
        url:"/upload?"+nombre,
        method: 'post',
        data: fd,      
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
            console.log("upload sucess" + " " + data.data);
            $("#imagenf").attr('src',data.data);
            console.log($("#imagenf"));
            
            if(data.code == 2){
                alert("Error al subir imagen el archivo tiene que tener extencion jpg|jpeg|png|gif");
            }
            else{
                console.log("upload sucess" + " " + data.data);
                $("#imagenf").attr('src',data.data);
                console.log($("#imagenf"));
                $('.custom-file-label').text(files.name);  
            }
        },
    });    
}

function obtener_logon(){
    var codigo = sessionStorage["codigo"];
    //console.log("Esto es el codigo" + " " + codigo);
    //una vez que obtengo el logon pido los permisos del usuario al servidor
   //
   var usuario;
    $.ajax({
        method : "GET",
        async: false,
        url:"/mostrar_usu",
        dataType : 'json',
        data: {codigo},
       
        success: function(respuesta){
       
            if(respuesta[0].PER_INGJ == "S"){
                usuario = new Permiso_usu(' ','disabled','disabled','disabled',' ','none'); 
            }
            if (respuesta[0].PER_INGS == "S"){
                usuario = new Permiso_usu(' ',' ',' ',' ',' ','none'); 
            }
            if (respuesta[0].PER_CC == "S"){
                usuario = new Permiso_usu('disabled','disabled ','disabled','disabled','disabled','none'); 
            }
            if (respuesta[0].PER_P == "S"){
                usuario = new Permiso_usu('disabled','disabled ','disabled','disabled','disabled','none'); 
            }
            if (respuesta[0].PER_ADMIN == "S"){
                usuario = new Permiso_usu('disabled','disabled ','disabled','disabled','disabled','none'); 
            }
            if (respuesta[0].PER_ROOT == "S"){
                   
                usuario = new Permiso_usu(' ',' ',' ',' ',' ',' '); 
                $('#liusuarios').css('display', '');
            }
        }
       
    })
    return  usuario;
}




