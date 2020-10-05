
$(document).ready(function(){
 
    $("#dconsultas").html("<div class='row'>" +
            "<div class='form-group col-md-12'>" +
                "<h2>Planos</h2>" +
            "</div>"+
        "</div>"+
        "<div class='row'>"+
        "</div>" +
        "<hr>" +
        
       "<form class='form'>" +
            "<div class='row'>"+
                "<div class='col-md-8'>"+
                    "<div class='row'>"+
                        "<div class='col-md-6'>"+
                            "<label for='codigo'><strong>Código</strong></label>"+
                            "<input  style='text-transform: uppercase' type='text' class='form-control' id='codigo_cp' placeholder='' value='' required></input>"+
                        "</div>"+
                        "<div class='col-md-6'>"+
                            "<label  for='nrorev'><strong>NroRev</strong></label>"+
                            "<input  type='number' class='form-control' id='nrorev_cp' placeholder='' value='' required></input>"+
                        "</div>"+
                    "</div>"+
                    "<div class='row'>"+
                        "<div class='col-md-12'>"+
                            "<label for='descripcion'><strong> Descripción</strong></label>"+
                            "<input type='text' class='form-control' id='descripcion_cp' placeholder='' value='' required>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                "<div class='col-md-4'>"+
                    "<img style='margin-top:-170px' src='./images/logocolores3.png'>"+
                    "<div class='card' style='width: 18rem;margin-top: -10px'>"+
                        "<div class='card-header'>"+
                            "<strong>Estados</strong>"+ 
                        "</div>"+
                        "<ul class='list-group list-group-flush'>"+
                            "<li class='list-group-item'> <img src='./images/details_green.png'>"+
                                " Vigente" +
                            "</li>"+
                            "<li class='list-group-item'><img src='./images/details_yellow.png'>"+
                                " Pendiente de aprobación"+
                                
                            "</li>"+
                            "<li class='list-group-item'><img src='./images/details_red.png'>"+
                                " No vigente"+
                            "</li>"+
                        "</ul>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</form>" +
        "<div>"+
             //"<button  type='button' "+permisos_usu.alta+" id=mybtnAlta onclick='Btnalta()' class='btn btn-info btn-circle btn-xl' data-toggle='tooltip'  title='Alta Plano'><i class='fa fa-plus'></i>"+
        "</div>"+
        "<div style='margin-top:20px'>"+
            "<button id=bpb type='button' onclick='Consulta_cp(codigo_cp,nrorev_cp,descripcion_cp)' class='btn btn-primary btn-sm'>Buscar</button>"+
            "<button id=bpt type='button' onclick='Consulta_cpt()'style='margin-left:5px' class='btn btn-secondary btn-sm'>Todos</button>"+    
        "</div>"+
        "<div style='margin-left: -15px;margin-top: 40px' class='container'>"+
            "<table id='example_cp' class='display'>" +
                "<thead>" +
                    "<tr>"+
                    
                        "<th style='width: 5px'></th>"+
                        "<th style='width: 70px'></th>"+
                        "<th style='width: 350px'></th>"+
                        "<th style='width: 70px'></th>"+  
                    "</tr>"+
                "</thead>" +
                "<tbody>"+

                "</tbody>"+
            "</table>"+
        "</div>"   
        
    
    );
        

});

//----------------------------------------Consulta de un solo plano-------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------
function Consulta_cp(codigo,nrorev,descripcion){
   
    var codigo = codigo_cp.value;
    var descripcion = descripcion_cp.value;
    var nrorev = nrorev_cp.value;
    var nombre_tabla_consulta = "planos";

    $.ajax({
        method : "GET",
        async: true,
        url:"/buscar",
        dataType : 'json',
        data: {codigo,descripcion,nrorev,nombre_tabla_consulta},
        success: function(respuesta){
          
            $('#example_cp').dataTable().fnDestroy();
           
            tablep =  $('#example_cp').DataTable({     
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
                    
                    { title: "Código","className": "text-center","data": "PLN_CODIGO"},
                  
                    { title: "Descripción","className": "text-left","data": "PLN_DESCRIPCION"},
                    { title: "Nueva Revisión", 
                        "data": null,
                        "className": "text-center",
                        'render': function (data, type, row) {
                           // return "<button "+permisos_usu.nuevarev+" id='"+JSON.stringify(data)+ "' onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
						   //return "<button "+permisos_usu.nuevarev+" id='"+JSON.stringify(data)+ "//" + "uno" + "'   onclick='NuevaRev(this)' class='GetNuevaRev  fa fa-plus'/>"
                        }
                    },
                  
                            
                ],
                   
                "order": [[1, 'asc']] ,

               
            }); 
           
            //modificar la descripcion
            tablep.MakeCellsEditable({
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
           
            $('#example_cp tbody').off('click', 'td.details-control');
            $('#example_cp tbody').on('click', 'td.details-control', function () {
                                
                var tr = $(this).closest('tr');
                var row = tablep.row(tr);
                
                if (row.child.isShown()) {
                    
                    row.child.hide();
                    tr.removeClass('shown');
                    
                }
                else {
                  
                    row.child( Formatdetalle_cp(row.data())).show();  
               
                    tr.addClass('shown');
                    
                }     

            });
                    
        }

    }); 
         
 };

 //-------------------------------------------Detalle de cada plano-----------------------------------------------------
 //---------------------------------------------------------------------------------------------------------------------
 
function Formatdetalle_cp(rowData){
    
    var nombre_tabla_detalle = "planos";
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
                    var diccionario = Mostrar_detalle(jsondetalle[i].PLN_ESTADO,permisos_usu.aprobar,permisos_usu.rechazar);
                 
                    tbody += '<tr style=" text-align: center">';
                    tbody += '<td>'+"<img id='"+jsondetalle[i]._id+"' src='"+diccionario.imagen+"' >"+'</td>';
                 
                    tbody +=  '<td><span rel="tooltip" data-toggle="tooltipcom" data-placement="top" title="'+jsondetalle[i].PLN_COMENTARIO+'"  class="souligne">'+jsondetalle[i].PLN_NRO_REV+'</span></td>';


                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_FECHA+'</td>';
                    tbody += '<td style=" text-align: center">'+jsondetalle[i].PLN_USUARIO_ALTA+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybfa'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_FECHA_APR+'</label>'+'</td>';
                    tbody += '<td style=" text-align: center">'+'<label id="mybua'+jsondetalle[i]._id+'"> '+jsondetalle[i].PLN_USUARIO_APR+'</label>'+'</td>';
                 
                    var boton =  Existe_ubicacion(jsondetalle[i].PLN_UBICACION);
                    tbody += '<td>'+"<button id='mybtnubi"+"/"+jsondetalle[i]._id + "' ' "+boton+" ' style='margin-left: 17px;border-width: 1px' onclick='Abrirup(this)' class='Abrirup fa fa-folder-open data-toggle='tooltip' title='Ubicación'/>" + 
                             "<button id='mybtnmodifubi"+"/"+jsondetalle[i]._id + "' onclick='Mostrarmodif(this)' "+permisos_usu.modifdes+" class='GetModifUbi fa fa-pencil-square' data-toggle='tooltip' title='Modificar Ubicación'></button>" +  '</td>';
                             
                 /*   tbody += '<td>'+"<button id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "'  ' " + myString.deshabilitar_e +" '  style='margin-left: 11px;border-width: 1px' onclick='Aprobar(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                                  "<button id='"+jsondetalle[i]._id+ "' style='border-width: 1px' ' " + myString.deshabilitar_r +" ' onclick='Rechazar(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
                             '</td>';
                   */
                    tbody += '<td>'+"<button id='"+jsondetalle[i]._id +"/"+jsondetalle[i].PLN_CODIGO+ "'  ' " + diccionario.aprobar +" '  style='margin-left: 11px;border-width: 1px' onclick='Aprobarp(this)' class='GetDetalle fa fa-thumbs-up' data-toggle='tooltip' title='Aprobar'/>"+
                                "<button id='"+jsondetalle[i]._id+ "' style='border-width: 1px' ' " + diccionario.rechazar +" ' onclick='Rechazarp(this)' class='GetRechazar fa fa-times' data-toggle='tooltip' title='Rechazar'/>"+
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
