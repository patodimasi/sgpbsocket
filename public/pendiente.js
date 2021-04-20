
//----------------------------------------Muestra todos los documentos pendientes de aprobacion-------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------

function Consultapen(nombre_tabla_consultat){
    console.log("llega a esta funcion");
     
    $('#examplespen').dataTable().fnDestroy();
  
    var tablep_p = $('#examplespen').DataTable( {
             
        "infoCallback": function( settings, start, end, max, total, pre ) {
             
          //  $('#badge_plano').text(max);
             return "Mostrando registros del" + " " + start + "al" + " " + end + " " +  "de un total de" + " " +  max + " " + "registros";
            
        },
          
        language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
       "lengthMenu": [[20, 30, 50, 100, -1], [ 20, 30, 50, 100, "Todos"]],
    
        "ajax":{
            "url": "/buscarTodos_pen",
            "data": {nombre_tabla_consultat},
            "dataSrc":""
        },
        
        "columns": [
            {
                "class":          "details-control",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
            { "data": "PLN_CODIGO" },
            { "data": "PLN_DESCRIPCION" }
          
        ],
        
        "order": [[1, 'asc']]
        
    });

    tablep_p.MakeCellsEditable({
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
        var nombre_tabla_descripcion = nombre_tabla_consultat;

        $.ajax({
            method : "GET",
            async: true,
            url:"/Modif",
            dataType : 'json',
            data : {codigo,descripcion, nombre_tabla_descripcion},
           

        })      
        
    }    

    $('#examplespen tbody').off('click', 'td.details-control');
    $('#examplespen tbody').on('click', 'td.details-control', function () {
                        
        var tr = $(this).closest('tr');
        var row = tablep_p.row(tr);
        
        if (row.child.isShown()) {
            
            row.child.hide();
            tr.removeClass('shown');
            
        }
        else {
          
            row.child( Formatdetallepen(row.data(),nombre_tabla_consultat)).show();  
       
            tr.addClass('shown');
            
        }     

    });

};

//-------------------------------------------Detalle de cada documento--------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
 
function Formatdetallepen(rowData,nombre){
   // var nombre = $("#bpb").val();
    var nombre_tabla_detalle = nombre;
    var div = $('<div/>')
       .addClass( 'loading' )
        .text( 'Loading...' );
  
    var jsondetalle = {};
        $.ajax( {
            type: "GET",
            url: '/detallehisto_pen',
            
            data: {
                name: rowData.PLN_CODIGO,nombre_tabla_detalle
            },
          
            success: function(res){
                //aca tengo todas las versiones de los planos
                var jsondetalle = JSON.parse(res);
                function sortJSON(data, key, orden) {
                    return data.sort(function (a, b) {
                        var x = a[key],
                        y = b[key];
                
                        if (orden === 'asc') {
                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        }
                
                        if (orden === 'desc') {
                            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                        }
                    });
                }

                var oJSON = sortJSON(jsondetalle, 'PLN_NRO_REV', 'asc');
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
                    var myString = (Colorestadopen(jsondetalle[i].PLN_ESTADO));
                
                    tbody += '<tr id=row'+jsondetalle[i]._id+' style=" text-align: center">';
                    tbody += '<td>'+"<img id='"+jsondetalle[i]._id+"' src='"+myString.imagen+"' >"+'</td>';
                
                    tbody +=  '<td><span rel="tooltip" data-toggle="tooltipcom" data-placement="top" title="'+jsondetalle[i].PLN_COMENTARIO+'"  class="souligne">'+jsondetalle[i].PLN_NRO_REV+'</span></td>';


                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_FECHA+'</td>';
                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_USUARIO_ALTA+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybfa'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_FECHA_APR+'</label>'+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybua'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_USUARIO_APR+'</label>'+'</td>';
                
                    var boton =  Existe_ubicacionpen(jsondetalle[i].PLN_UBICACION);
                    tbody += '<td>'+"<button style='outline:none' id='mybtnubi"+"/"+jsondetalle[i]._id + "/"+nombre + "' ' "+boton+" ' style='margin-left: 17px;border-width: 1px' onclick='Abrirupen(this)' class='Abrirup fa fa-folder  data-toggle='tooltip' title='Ubicación'/>";
                           // "<button id='mybtnmodifubi"+"/"+jsondetalle[i]._id +  "/"+nombre + "' onclick='Mostrarmodifpen(this)' class='GetModifUbi fa fa-pencil-square'  data-toggle='tooltip' title='Modificar Ubicación'></button>" +  '</td>';
                    tbody += '<td>'+"<button style='outline:none;margin-left: 20px' id='"+jsondetalle[i]._id +"*"+jsondetalle[i].PLN_CODIGO+"*"+nombre + "'  ' " + myString.deshabilitar_e +" '  style='margin-left: 11px;border-width: 1px'  onclick=' Aprobarpen(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                               // "<button style='outline:none' id='"+jsondetalle[i]._id+ "/"+nombre + "' style='border-width: 1px' ' " + myString.deshabilitar_r +" ' onclick='Rechazarpen(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
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

function Colorestadopen(estado){
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

 

//---------------------------------------Aprobar un documento---------------------------------------------
//--------------------------------------------------------------------------------------------------------

function Aprobarpen(item){
  
    infodp = $(item).attr("id");
    console.log("infodp" + " " + infodp)
    var logon = sessionStorage["logon"];
    
    id = (infodp.split('*')[0]);
    codigo = (infodp.split('*')[1]);
    nombre_tabla_aprobar  = (infodp.split('*')[2]);

    console.log(nombre_tabla_aprobar);
    
    $.ajax({
        method : "GET",
        async:true,
        url:"/aprobar",
        dataType : 'json',
        data:{codigo,id,logon,nombre_tabla_aprobar},
     
        success: function(res){ 
            // Actualizar_detalle(res);
             if(res.msj_op == "NO_OK"){
                 alert(res.msj_ver);
             }
             else{
               
                Actualizar_detalle_ppa(res.msj_ver,nombre_tabla_aprobar);
                
                indice =    $('#badge_'+nombre_tabla_aprobar).text();

                $('#badge_'+nombre_tabla_aprobar).text(indice -1);
        
                
             }
          
         }
        
    })
       
};

//--------------------------------Actualizar la informacion en la tabla una vez aprobado el plano--------------------------------
function Actualizar_detalle_ppa(jsondetalle,nombre_tabla_aprobar){
    for(var i = 0;i < jsondetalle.length;i++){
        var myString = (Colorestadopen(jsondetalle[i].PLN_ESTADO));
        if(jsondetalle[i].PLN_ESTADO == "R"){
            //cambio de color el led a rojo
            $("#"+ jsondetalle[i]._id ).attr('src', myString.imagen);
            //desabilito el boton de aprobacion
            $("[id='"+jsondetalle[i]._id +"*"+jsondetalle[i].PLN_CODIGO+ "*"+nombre_tabla_aprobar+ "']").attr("disabled",true);
        }
        if(jsondetalle[i].PLN_ESTADO == "V"){
            //agrego a la celda el nombre del usuario aprobacion
            $('#mybua'+ jsondetalle[i]._id ).text(jsondetalle[i].PLN_USUARIO_APR);
            //agrego la fecha de aprobacion
            $('#mybfa'+ jsondetalle[i]._id ).text(jsondetalle[i].PLN_FECHA_APR);
            //cambio led a verde
            $("#"+ jsondetalle[i]._id ).attr('src', myString.imagen);
          
            $("[id='"+jsondetalle[i]._id +"*"+jsondetalle[i].PLN_CODIGO+ "*"+nombre_tabla_aprobar+ "']").attr("disabled",true);      
        }
    }
}

//---------------------------------------------Abrir la ubicacion de un documento--------------------------------------
//---------------------------------------------------------------------------------------------------------------------
function Abrirupen(item){
    infoubi = $(item).attr("id");
    id_ubi = infoubi.split("/")[1];
    nombre_tabla_ubicacion = infoubi.split("/")[2];


   // var nombre = $("#bpb").val();
  //  nombre_tabla_ubicacion = nombre;

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


//----------------------------------------------Verifico si existe la ubicacion-------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

function Existe_ubicacionpen(idubicacion){
    var boton = null;

    if(idubicacion == ""){

        boton =  'disabled';
    }
     else{
       
        boton =  "";
    }
 
     return boton;
};



function Info_pen(nombre_tabla,titulo){    
    $('#dpendientes').show();
    $('#content').hide(); 
    $('#dconsultas').hide(); 
    $('#altaprod').hide();
    $('#usuarios').hide(); 
    $('#dregistros').hide(); 
   // $('#examplespen').dataTable().fnDestroy();
    $("#examplespen > tbody").html("");
    $('#titulopen').text(titulo);
    Consultapen(nombre_tabla);
}    