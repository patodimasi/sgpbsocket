const socket = io()
//-----------------------------------------------------------------Consulta un solo documento-------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
function Consulta(){
    var codigo = $("#codigo").val();
    var descripcion = $("#descripcion").val();
    var nrorev = $("#nrorev").val();
    var nombre = $("#bpb").val();
    
    console.log("esta es la info del item" + " " + nombre);
    var nombre_tabla_consulta = nombre;

    $.ajax({
        method : "GET",
        async: true,
        url:"/buscar",
        dataType : 'json',
        data: {codigo,descripcion,nrorev,nombre_tabla_consulta},

        success: function(respuesta){
            $('#example').dataTable().fnDestroy();

            table =  $('#example').DataTable({  
                data: respuesta,
                language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
                "lengthMenu": [[20, 30, 50, 100, -1], [ 20, 30, 50, 100, "Todos"]],

                "columns": [
                    {
                    
                        "class":          "details-control",
                        "orderable":      false,
                        "data":           null,
                        "defaultContent": ""
                    } ,
                    
                    { "data": "PLN_CODIGO"},
                  
                    { "data": "PLN_DESCRIPCION"},
                    { 
                        "data": null,
                        "className": "text-center",
                        'render': function (data, type, row) {
                           // return "<button onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                           //return "<button "+permisos_usu.nuevarev+" id='"+JSON.stringify(data)+ "//" + "uno" + "'   onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                           return "<button  id='"+JSON.stringify(data)+ "//" + "uno" + "'   onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                        }
                    },
                  
                            
                ],

                "order": [[1, 'asc']] ,

            });

            table.MakeCellsEditable({
                "onUpdate": myCallbackFunction,
                "inputCss":'my-input-class',
                "columns": [2],
                "confirmationButton": { // could also be true
                    "confirmCss": 'my-confirm-class',
                    "cancelCss": 'my-cancel-class'
                },
                "inputTypes": []
            }); 

            function myCallbackFunction (updatedCell, updatedRow, oldValue) {
                console.log("The new value for the cell is: " + updatedCell.data());
                console.log("The old value for that cell was: " + oldValue);
                console.log("The values for each cell in that row are: " + JSON.stringify(updatedRow.data()));
                var codigo = (updatedRow.data().PLN_CODIGO);
                var descripcion = (updatedRow.data().PLN_DESCRIPCION);
                var nombre_tabla_descripcion = "planos";

                $.ajax({
                    method : "GET",
                    async: true,
                    url:"/Modif",
                    dataType : 'json',
                    data : {codigo,descripcion, nombre_tabla_descripcion},
                   

                })      
                
            }    
            
            //abrir y cerrar el icono de detalle
           
            $('#example tbody').off('click', 'td.details-control');
            $('#example tbody').on('click', 'td.details-control', function () {
                                
                var tr = $(this).closest('tr');
                var row = table.row(tr);
                
                if (row.child.isShown()) {
                    
                    row.child.hide();
                    tr.removeClass('shown');
                    
                }
                else {
                  
                    row.child( Formatdetalle(row.data())).show();  
               
                    tr.addClass('shown');
                    
                }     

            });

        }

    });
    
};

//-------------------------------------------Detalle de cada documento--------------------------------------------------------------
 //--------------------------------------------------------------------------------------------------------------------------------
 
 function Formatdetalle(rowData){
    var nombre = $("#bpb").val();
    var nombre_tabla_detalle = nombre;
    var div = $('<div/>')
       .addClass( 'loading' )
        .text( 'Loading...' );
  
    var jsondetalle = {};
        $.ajax( {
            type: "GET",
            url: '/detallehisto',
            
            data: {
                name: rowData.PLN_CODIGO,nombre_tabla_detalle
            },
          
            success: function(res){
                //aca tengo todas las versiones de los planos
                var jsondetalle = JSON.parse(res);
              //  console.log("es el jsondetalle" + "" + jsondetalle);
                var tbody = '';
                tbody += '<table id="tabledetalle" class="table">';
                tbody += '<thead class="thead-dark">';
                tbody += '<tr>';
                tbody  += '<th style=" text-align: center">'+'Estado' +'</th>';
                tbody  += '<th style=" text-align: center">'+'N°Rev'+'</th>';
                tbody  += '<th style=" text-align: center">'+'F.Alta'+'</th>';
                tbody  += '<th style=" text-align: center">'+'U.Alta'+'</th>';
                tbody  += '<th style=" text-align: center">'+'F.Aprobación'+'</th>';
                tbody  += '<th style=" text-align: center">'+'U.Aprobación'+'</th>';
                tbody  += '<th style=" text-align: center">'+'&nbsp;&nbsp;Ubicación'+'</th>';
                tbody  += '<th style=" text-align: center">'+'&nbsp;&nbsp;&nbsp;Tareas'+'</th>';
                tbody  += '</tr>';
                tbody += '<thead>';

               for (var i = 0; i < jsondetalle.length; i++) {
                    var myString = (Colorestado(jsondetalle[i].PLN_ESTADO));
                
                    tbody += '<tr id=row'+jsondetalle[i]._id+' style=" text-align: center">';
                    tbody += '<td>'+"<img id='"+jsondetalle[i]._id+"' src='"+myString.imagen+"' >"+'</td>';
                
                    tbody +=  '<td><span rel="tooltip" data-toggle="tooltipcom" data-placement="top" title="'+jsondetalle[i].PLN_COMENTARIO+'"  class="souligne">'+jsondetalle[i].PLN_NRO_REV+'</span></td>';


                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_FECHA+'</td>';
                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_USUARIO_ALTA+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybfa'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_FECHA_APR+'</label>'+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybua'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_USUARIO_APR+'</label>'+'</td>';
                
                    var boton =  Existe_ubicacion(jsondetalle[i].PLN_UBICACION);
                    tbody += '<td>'+"<button style='outline:none' id='mybtnubi"+"/"+jsondetalle[i]._id + "' ' "+boton+" ' style='margin-left: 17px;border-width: 1px' onclick='Abrirup(this)' class='Abrirup fa fa-folder  data-toggle='tooltip' title='Ubicación'/>" + 
                            "<button id='mybtnmodifubi"+"/"+jsondetalle[i]._id + "' onclick='Mostrarmodif(this)' class='GetModifUbi fa fa-pencil-square'  data-toggle='tooltip' title='Modificar Ubicación'></button>" +  '</td>';
                    tbody += '<td>'+"<button style='outline:none' id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "'  ' " + myString.deshabilitar_e +" '  style='margin-left: 11px;border-width: 1px' onclick='Aprobar(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                                "<button style='outline:none' id='"+jsondetalle[i]._id+ "' style='border-width: 1px' ' " + myString.deshabilitar_r +" ' onclick='Rechazar(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
                            '</td>';
                    tbody += '</tr>';
                   
                }
            

                tbody += '</table>';
                  
                $('body').tooltip({
                    selector: '[data-toggle="tooltipcom"]'
                   
                });
               
                div
                .html(tbody)
                .removeClass( 'loading' );
            
                
            }
            
        });  
            
     return   div;
       
};

//------------------------------------------------Colorea el estado del documento-------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

function Colorestado(estado){
    var resultado = new Object();
    if(estado == 'V'){
        resultado.imagen = "./images/details_green.png";
        resultado.deshabilitar_e = "disabled";
        resultado.deshabilitar_r = '';
    }
    if(estado == 'A'){
        resultado.imagen = "./images/details_yellow.png";
        resultado.deshabilitar_e = ''  ;
        resultado.deshabilitar_r = "disabled";
    }
    if(estado == 'R'){
        resultado.imagen = "./images/details_red.png"
        resultado.deshabilitar_e = "disabled";
        resultado.deshabilitar_r = "disabled";
    }
    return resultado;
}

//----------------------------------------------Verifico si existe la ubicacion-------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

function Existe_ubicacion(idubicacion){
    var boton = null;

    if(idubicacion == ""){

        boton =  'disabled';
    }
     else{
       
        boton =  "";
    }
 
     return boton;
};

//---------------------------------------Aprobar un documento---------------------------------------------
//--------------------------------------------------------------------------------------------------------

function Aprobar(item){
    infodp = $(item).attr("id");
    console.log("infodp" + " " + infodp)
    var logon = sessionStorage["logon"];
    
    id = (infodp.split('/')[0]);
    codigo = (infodp.split('/')[1]);

    var nombre = $("#bpb").val();
    nombre_tabla_aprobar = nombre;
   // console.log("este es el nombre de la tabla" + " " + nombre_tabla_aprobar);
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/aprobar",
        dataType : 'json',
        data:{codigo,id,logon,nombre_tabla_aprobar},
     
        success: function(res){ 
           
            if(res.msj_op == "NO_OK"){
                alert(res.msj_ver);
            }
            else{
              //  Actualizar_detalle(res.msj_ver);
                //console.log("mensaje ver" + " " + res.msj_ver);
                //socket.emit('refrescar',res.resultadoa);
                console.log("mensaje ver de aprobar" + " " + res.msj_ver);
                socket.emit('refrescar',res.msj_ver);
              
            }
         
        }
        
    })
        
};
//-----------------------------------------Refrescar aprobacion,rechazo a todos los clientes-------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
socket.on('refrescar',function(data){
    console.log("llega alrefrescar el rechazar");
    console.log("data")
    for(var i = 0;i < data.length;i++){
        var myString = (Colorestado(data[i].PLN_ESTADO));
       // var myString = ActualizarColor(data[i].PLN_ESTADO);
        console.log("este es el mystring" + " ")
            var boton =  Existe_ubicacion(data[i].PLN_UBICACION);
            var newHtml ='<td>'+"<img  src='"+myString.imagen+"'>"+'</td>'
                + '<td>' + data[i].PLN_NRO_REV + '</td>'
                + '<td>' + data[i].PLN_FECHA + '</td>'
                + '<td>' + data[i].PLN_USUARIO_ALTA + '</td>'
                + '<td>' + data[i].PLN_FECHA_APR+ '</td>'
                + '<td>' + data[i].PLN_USUARIO_APR+ '</td>'
                + '<td>'+"<button style='outline:none' id='mybtnubi"+"/"+data[i]._id + "' ' "+boton+" ' style='margin-left: 17px;border-width: 1px' onclick='Abrirup(this)' class='Abrirup fa fa-folder data-toggle='tooltip' title='Ubicación'/>" + 
                    "<button style='outline:none' id='mybtnmodifubi"+"/"+data[i]._id + "' onclick='Mostrarmodif(this)' class='GetModifUbi fa fa-pencil-square' data-toggle='tooltip' title='Modificar Ubicación'></button>" +  '</td>'
                + '<td>'+"<button style='outline:none' id='"+data[i]._id +"/"+data[i].PLN_CODIGO+ "'  ' " + myString.deshabilitar_e +" '  style='margin-left: 11px;border-width: 1px' onclick='Aprobar(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                    "<button style='outline:none' id='"+data[i]._id+ "' style='border-width: 1px' ' " + myString.deshabilitar_r +" ' onclick='Rechazar(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>";
    
                $("#row"+ data[i]._id).html(newHtml);
    }
                
})

//---------------------------------------------Abrir la ubicacion de un documento--------------------------------------
//---------------------------------------------------------------------------------------------------------------------
function Abrirup(item){
    infoubi = $(item).attr("id");
    id_ubi = infoubi.split("/")[1];

    var nombre = $("#bpb").val();
    nombre_tabla_ubicacion = nombre;

    $.ajax({
        method : "GET",
        async: true,
        url:"/getUbicaciondoc",
        dataType : 'json',
        data: {id_ubi,nombre_tabla_ubicacion},
            
        success: function(respuesta){
         
           if(respuesta.resultado == "OK"){
               
                var varUrl = respuesta.url + '?ubi=' + respuesta.ubicacion;
               
                console.log("Es la varURL" + " " + varUrl);
                
                window.open(varUrl,'_blank');
           }
           else{ 
              
               alert("La ubicación del documento no existe");
              
           }
           
           
        }

    })
};
//---------------------------------------------Consultar todos los documentos------------------------------------------
//---------------------------------------------------------------------------------------------------------------------

function Consulta_t(){
    $('#example').dataTable().fnDestroy();
    var nombre = $("#bpb").val();
    var nombre_tabla_consultat = nombre;
     
    var table = $('#example').DataTable({
       
        language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
        "lengthMenu": [[20, 30, 50, 100, -1], [ 20, 30, 50, 100, "Todos"]],
        
        "ajax":{
            "url": "/buscarTodos",
            "data": {nombre_tabla_consultat},
            "dataSrc":""
        },
      
        "columns": [
            {
            
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
          
           
            } ,
            
            { "data": "PLN_CODIGO" },
          
            { "data": "PLN_DESCRIPCION"},
            { 
                "data": null,
                "className": "text-center",
                'render': function (data, type, row) {
                  
                  //  return "<button "+permisos_usu.nuevarev+" id='"+JSON.stringify(data)+ "' onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                  // return "<button "+permisos_usu.nuevarev+" id='"+JSON.stringify(data)+ "//" + "todos" + "' onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                  return "<button onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                }
            },
          
                    
        ],

        "order": [[1, 'asc']],
      
        
    });   
    table.MakeCellsEditable({
        "onUpdate": myCallbackFunction,
        "inputCss":'my-input-class',
        "columns": [2],
        "confirmationButton": { // could also be true
            "confirmCss": 'my-confirm-class',
            "cancelCss": 'my-cancel-class'
        },
        "inputTypes": []
    }); 

   function myCallbackFunction (updatedCell, updatedRow, oldValue) {
            console.log("The new value for the cell is: " + updatedCell.data());
            console.log("The old value for that cell was: " + oldValue);
            console.log("The values for each cell in that row are: " + JSON.stringify(updatedRow.data()));
            var codigo = (updatedRow.data().PLN_CODIGO);
            var descripcion = (updatedRow.data().PLN_DESCRIPCION);
            var nombre_tabla_descripcion = "planos";

            $.ajax({
                method : "GET",
                async: true,
                url:"/Modif",
                dataType : 'json',
                data : {codigo,descripcion,nombre_tabla_descripcion},
               

            })      
            
    }    
      
        $('#example tbody').off('click', 'td.details-control');
        $('#example tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
              
            if (row.child.isShown()) {
                //fila que esta abierta y la cierro
                // console.log("fila que esta abierta y la cierro")
               
                row.child.hide();
                tr.removeClass('shown');
                
            }
            else {
                //abrir fila
              
                row.child( Formatdetalle(row.data())).show();
             
                
                tr.addClass('shown');
                
            } 
            
            
        });

} ;

//--------------------------------------------- Rechazar undocumento ---------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
function Rechazar(item){
   // console.log("llega el rechazar");  
    //En esta funcion lo que ago es cambiar el estado de verde a rojo y bloquear el boton
    inforp = $(item).attr("id");

    var nombre = $("#bpb").val();
    nombre_tabla_rech = nombre;
   
    $.ajax({
        method : "GET",
        async:true,
        url:"/rechazar",
        dataType : 'json',
        data:{inforp,nombre_tabla_rech},
     
        success: function(res){ 

            if(res.msj_op == "NO_OK"){
                alert(res.msj_ver);
            }
            else{
               
                socket.emit('refrescar',[res.msj_ver]);
            }
           
        }
    })
    
};
//--------------------------Obliga a cerrar el detalle de un documento si esta abierto----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------
function Cerrar_detalle(){

    $( "tr" ).each(function() {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        if (row.child.isShown()) {
            console.log(row, row.child, row.child.isShown()) /// comes back true
            var z = tr.hasClass('shown');
            console.log(z);
            var x = $(row.node()).hasClass('shown');
            console.log(x);
            row.child.hide();
            $( row.node() ).removeClass('shown');
 
        };
    })
};

// -----------------------Muestra por pantalla una nueva revision del plano-------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------

function NuevaRev(item){
  
    infoubi = $(item).attr("id");
    separador = infoubi.split("//")
    infodp = JSON.parse((separador[0]));
    // con esto me fijo si viene de "uno" o "todos"
    sep2 = (separador[1]);
 
    //asigno valor si viene de uno o varios documentos
    $('#signin').val(sep2);
    Cerrar_detalle();
       
    $('#myModal_nr').modal('show');

    var f = new Date();
    fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
    $("#codigo_old_nr").val(infodp.PLN_CODIGO);
    $("#nrorev_old_nr").val(infodp.PLN_NRO_REV);
    $("#descripcion_old_nr").val(infodp.PLN_DESCRIPCION);
    $("#falta_old_nr").val(infodp.PLN_FECHA);
    $("#usuarioa_old_nr").val(infodp.PLN_USUARIO_ALTA);
    $("#faprob_old_nr").val(infodp.PLN_FECHA_APR);
    $("#usuarioapr_old_nr").val(infodp.PLN_USUARIO_APR);
    $("#comentarios_nr").val(" ");

    $("#nuevarev_new_nr").val((infodp.PLN_NRO_REV) + 1);
    //console.log("esta es la nueva rev" + " " + $("#nuevarev_new_nr").val());
    $("#fechaalta_new_nr").val(fecha);
    $("#descripcion_new_nr").val(infodp.PLN_DESCRIPCION);
    
};

//----------------------------------------Confirma una nueva revision del documento------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
function Confirmarnr(){
    
    tipo_consulta = $('#signin').val();
    var nombre = $("#bpb").val();
    nombre_tabla_nuevarev = nombre;
    
    var logon = sessionStorage["logon"];

    var PLN_FECHA  =  $("#fechaalta_new_nr").val();
    var PLN_CODIGO =  $("#codigo_old_nr").val();
    var PLN_DESCRIPCION =  $("#descripcion_new_nr").val();
    var PLN_NRO_REV =  parseInt($("#nuevarev_new_nr").val());
    var PLN_ESTADO = "A";
    var PLN_USUARIO_ALTA = logon;
    var PLN_USUARIO_APR =  "";
    var PLN_FECHA_APR =  "";
    var PLN_UBICACION = "";
    var PLN_COMENTARIO = $("#comentarios_nr").val();
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/confirmar_nuevarev",
        dataType : 'json',
        data:{ PLN_FECHA,PLN_CODIGO,PLN_DESCRIPCION,PLN_NRO_REV,PLN_ESTADO,PLN_USUARIO_ALTA,PLN_USUARIO_APR,PLN_FECHA_APR,PLN_UBICACION,PLN_COMENTARIO,nombre_tabla_nuevarev},

        success: function(res){ 
            console.log(res);
            if (res == "OK"){
               // console.log("llega");
                alert("La nueva revisión del documento" + " " + PLN_CODIGO + " " + "se realizó correctamente");
            }   
            else{
                alert("Error al realizar el update en la base de datos,no se pudo realizar la nueva revisión del documento")
            }
            
        }
        
    })
  
    $('#myModal_nr').modal('hide');  

};
//-------------------------------------------------Muestra el formulario a dar de alta una lista de materiales-------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------
function materialesalta(){
    $('#MymodalAltam').modal();
    // trae los productos al combo box
    $.ajax({
     
        method : "GET",
        async: true,
        url:"/traerprod",
        dataType : 'json',

        success: function (data) {
           llenarcombo(data); 
        },
      
        
    });
};

//--------------------------------Busca el maximo de cada producto en una lista de materiales---------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
$("#buscarlm").click(function(){

    $("#codigomat" ).attr("disabled",false);
    $("#desclmat" ).attr("disabled",false);
    $("#ubilmat" ).attr("disabled",false);

    var nombre = $('.Input').val();

    $.ajax({
     
        method : "GET",
        async: true,
        url:"/buscarmaxlm",
        dataType : 'json',
        data: {nombre},
        success: function (data) {
         
          $("#codigomat" ).val(data);

        },
      
        
    });
  
});
//------------------------------------------------limpiar el evento onchange del combobox--------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
$(".Input").change(function(){
    $('#codigomat').val("");
    $('#codigomat').attr("disabled",true);
    $("#desclmat" ).attr("disabled",true);
    $("#ubilmat" ).attr("disabled",true);
    
});

//------------------------------------------------Llena el combo box de la lista de materiales de dar de alta--------------------
//-------------------------------------------------------------------------------------------------------------------------------

function llenarcombo(lista)
{
   
    for(var i = 0; i< lista.length;i++){ 
        $('.Input').append('<option>' + lista[i].PLN_NOMBRE  + '</option');

    }
   
}

//----------------------------------------Muestra el formulario a dar de alta de un plano,manual------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------
function docalta(nombre_tabla_maximo){
    $("#maxcodigo").val("");
    $("#descdoc").val("");
    $("#ubidoc").val("");

    $('#MymodalAlta').modal();

    $.ajax({
        method : "GET",
        async:true,
        url:"/maxdoc",
        dataType : 'json',
        data: {nombre_tabla_maximo},
        success: function(res){
        //obtengo en la respuesta el maximo y lo muestro en el formulario  
        $("#maxcodigo").val(res).prop('disabled', true);;
    
        }

     });

}

//------------------------------------Alta de un plano, manual--------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
$("#altadoc").click(function(){
     var codigo =  $("#maxcodigo").val();
      var ubicacion = $("#ubidoc").val().trim();
      var descripcion = $("#descdoc").val();
      var logon = sessionStorage["logon"];

      var nombre = $("#bpb").val();
      var nombre_tabla_alta = nombre;  
  
      if(validar_ubicacion(ubicacion) == false){
          alert("La ubicacion del plano tiene que comenzar con //BOHERDISERVER")
          $("#ubiplano").val(" ");
      }
      else{
  
      //envio al servidor los datos del formulario
          $.ajax({
              method : "GET",
              async:true,
              url:"/alta",
              dataType : 'json',
              data:{codigo, ubicacion,descripcion,logon,nombre_tabla_alta},
              success: function(res){
              
              //si la respuesta en correcta oculto el formulario
                  if(res == "OK"){
                  
                      $('#MymodalAlta').modal('hide');
                     alert("El alta del documento" + " " + codigo + " " + "se dio de alta satisfactoriamente"); 
                  
                  }
                  else{
                      alert("Error al crear el documento" + " " + codigo);
                  }
          
              }
  
          });
      }
});

//---------------------------Valida la ubicacion al dar de alta de un documento------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------
function validar_ubicacion(ubicacion){
    var ubicacion_sb_valida = (ubicacion.substr(0,15)).toUpperCase();
     console.log("substr y mayuscula" + " " + ubicacion_sb_valida);
     var resultado = null;
 
     if((ubicacion_sb_valida == "\\\\BOHERDISERVER")){
        resultado = true;
     }
     else{
         console.log("ubicacion no valida")
         resultado = false;
     }    
     return resultado;
 };


// -------------------------- Analiza cual es el documento  a dar de alta -----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

function Btnalta(){

    var nombre = $("#bpb").val();

    if((nombre == "planos") || (nombre == "manuales") || (nombre == "instructivodeproducciones") 
        || (nombre == "subinstructivodeproducciones")){
        docalta(nombre);
    } 
   
    if (nombre == "materiales"){
        materialesalta(nombre);
    }

    if(nombre == "instructivodeensayos"){
        instructivosalta(nombre);
    }
   
};

//----------------------------------------------Muestra el maximo de un instructivo de ensayo--------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
function instructivosalta(nombre){
    $('#MymodalAltaie').modal();
    // lleno el comboboox
    $('.Inputie').empty();
    $('.Inputie').append('<option>' + "Ensayo Recepción"  + '</option');
    $('.Inputie').append('<option>' + "Ensayo Producción"  + '</option');
    $('.Inputie').append('<option>' + "Ensayo Final"  + '</option');

    var nombreensayo = "Ensayo Recepción"
    //traigo el IB10-01 por defecto
    $.ajax({
        method : "GET",
        async:true,
        url:"/altaie",
        dataType : 'json',
        data:{nombreensayo},

        success: function(res){
        //obtengo en la respuesta el maximo y lo muestro en el formulario  
            console.log("resultado" +  " " + res);
            $("#codie").val(res);
            
        }

    });
};

//---------------------------------------------------Realiza el alta  de un instructivo de ensayo en la base de datos-----------------------
//------------------------------------------------------------------------------------------------------------------------------------------
$("#altaie").click(function(){
    var codigo =  $('#codie').val();
    var descripcion =  $('#descie').val();
    var ubicacion =  $('#ubiie').val().trim();
    var logon = sessionStorage["logon"];
    var nombre_tabla_alta = "instructivodeensayos";
    
    if(validar_ubicacion(ubicacion) == false){
        alert("La ubicacion del documento tiene que comenzar con \r//BOHERDISERVER")
        $('#ubiie').val("");
    }
    else{

        $.ajax({
        
            method : "GET",
            async: true,
            url:"/alta",
            dataType : 'json',
            data: {codigo,descripcion,ubicacion,logon,nombre_tabla_alta},
            success: function (data) {
                if(data == "NO_OK"){
                    alert("Error al crear un nuevo instructivo de ensayo");
                } 
                else{
                    $('#MymodalAltaie').modal('hide'); 
                    alert("El documento" + " " + codigo + " " +  "se dio de alta satisfactoriamente");
                    $("#descie").val("");
                    $("#ubiie").val("");

                }
            
            },
        
            
        });
    }

});
//----------------------------------------------------Cierra el form del alta del instructivo y limpia--------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------
$("#cerrarie").click(function(){
    $('.Inputie').empty();
    $('#codie').val("");
    $('#descie').val("");
    $('#ubiie').val("");
});

//---------------------------------------------------Evento on change del combo donde carga el maximo de cada instructivo de ensayo----------
//-------------------------------------------------------------------------------------------------------------------------------------------
$(".Inputie").change(function(){
    
    var nombreensayo = $('select[name="comboensayo"] option:selected').text()
  
    $.ajax({
        method : "GET",
        async:true,
        url:"/altaie",
        dataType : 'json',
        data:{nombreensayo},

        success: function(res){
        //obtengo en la respuesta el maximo y lo muestro en el formulario  
            console.log("resultado" +  " " + res);
            $("#codie").val(res);
            $("#descie").val("");
            $("#ubiie").val("");
            
        }

    });

});

//-----------------------------------------------Valida la ubicacion de un documento antes de dar de alta-----------------------------
//------------------------------------------------------------------------------------------------------------------------------------
function validar_ubicacion(ubicacion){
    var ubicacion_sb_valida = (ubicacion.substr(0,15)).toUpperCase();
     console.log("substr y mayuscula" + " " + ubicacion_sb_valida);
     var resultado = null;
 
     if((ubicacion_sb_valida == "\\\\BOHERDISERVER")){
        resultado = true;
     }
     else{
         console.log("ubicacion no valida")
         resultado = false;
     }    
     return resultado;
 };
 
//-------------------------------------------------------Confirmar alta de un documento-----------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------Alta de una lista de materiales en la base de datos------------------------------------
$("#altalmat").click(function(){
    var codigo =  $('#codigomat').val();
    var descripcion =  $('#desclmat').val();
    var ubicacion =  $('#ubilmat').val().trim();
    var logon = sessionStorage["logon"];
    var nombre_tabla_alta = "materiales"  

    if(validar_ubicacion(ubicacion) == false){
        alert("La ubicación del documento tiene que comenzar con \r//BOHERDISERVER");
        $('#ubilmat').val("");
    }
    else{

        $.ajax({
        
            method : "GET",
            async: true,
            url:"/alta",
            dataType : 'json',
            data: {codigo,descripcion,ubicacion,logon,nombre_tabla_alta},
            success: function (data) {
                if(data == "NO_OK"){
                    alert("Error al crear el documento");
                } 
                else{
                    $('#MymodalAltam').modal('hide');
                    
                    alert("El documento" + " " + codigo + " " + "se dio de alta satisfactoriamente");
                    
                    $('#codigomat').val("");
                    $('#desclmat').val("");
                    $('#ubilmat').val("");

                    $("#codigomat" ).attr("disabled",true);
                    $("#desclmat" ).attr("disabled",true);
                    $("#ubilmat" ).attr("disabled",true);

                }
            },
        
            
        });
    }
});

//------------------------------------------------------Activa el enter de los botones de busqueda--------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
$(document).ready(function(){
    $("#codigo").keydown(function(e){ 
        if(e.which === 13){
            Consulta(codigo,nrorev,descripcion);
        }
    });

    $("#nrorev").keydown(function(e){
        if(e.which === 13){
            Consulta(codigo,nrorev,descripcion);
        }
    });
    
    $("#descripcion").keydown(function(e){
        if(e.which === 13){
            Consulta(codigo,nrorev,descripcion);
        }
    });
});    
