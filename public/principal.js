//login usuario
$(document).ready(function(){
    if (sessionStorage["nombre"]){
      var nombre = sessionStorage["nombre"];
      var foto = sessionStorage["foto"];
      var label = sessionStorage["label"];
      //console.log(foto);
       $('<p>'+ nombre +'</p>').appendTo('#usrnombre');
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
});

// manejo de la sidebar
$(document).ready(function() {
   /* $('.sidebar div').click(function(e) {
        $('#content').text($(this).text())
    })
    */
 /*   $('div#dconsultas').show();
    $('body').on('click','a.personal-menu-item', function(e) {
        e.preventDefault();
    
    var selectedItem = $(this).attr('data-menu-item'); 
    
    var $selected = $('#' + selectedItem).show();
    $('.contents > div').not($selected).hide();
  
   });
   */
    $('#dconsultas').hide();
    $('#content').show();
    
})

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
//Muestra la cantidad de documentos pendientes de aprobacion
/*$(document).ready(function() {
    $("#clickpendiente").click(function() {
      
        console.log("llega");
     
        $.ajax( {
            type: "GET",
            url: '/maximotable',
            dataType : 'json',
       
            success: function(res){
                console.log("este es el res" + " " + res.res_plano);
                $('#badge_plano').text(res.res_plano);
                $('#badge_materiales').text(res.res_materiales);
            }
      
        });
            
        
    });
    
});
*/

$(document).ready(function(){
    $("#file").change(function() {  
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
      
    });

});


