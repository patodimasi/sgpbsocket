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
    console.log("este es el nombre de la tabla" + " " + nombre_tabla_aprobar);
    
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

//---------------------------------------------Consultar todos los documentos------------------------------------------
//------------------------------------------------------------------------------------------------------

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
    console.log("llega el rechazar");  
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
    console.log("esta es la nueva rev" + " " + $("#nuevarev_new_nr").val());
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
                console.log("llega");
                alert("La nueva revisión del documento" + " " + PLN_CODIGO + " " + "se realizó correctamente");

               /* if(tipo_consulta == "uno"){
                     Consulta(codigo,nrorev,descripcion);
                }
                else if(tipo_consulta == "todos"){
               
                    var tab = $('#example').DataTable();
                    tab.ajax.reload(null, true);
                }
                */
            }   
            else{
                alert("Error al realizar el update en la base de datos,no se pudo realizar la nueva revisión del documento")
            }
            
        }
        
    })
  
    $('#myModal_nr').modal('hide');  

}





