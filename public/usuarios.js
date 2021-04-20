//------------------------------------------Funcion que trae el modal para modificar los permisos de los usuarios--------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------
function  htmlModificarPermiso(){
    return  '<div class="modal fade" id="myModalpermiso">'+
                '<div class="modal-dialog modal-dialog-centered">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header" style="background-color: #999">'+
                            '<strong> Permisos</strong>'+           
                        '</div>'+
                        '<div class="modal-body">'+
                            '<div style="margin-top: 5px" class="row">'+
                                '<div style="margin-left:15px" class="col-md-1">'+
                                    '<strong>Nombre</strong>'+
                                '</div>'+
                                '<div class="col-md-2">'+
                                    '<input id= "nombrepermiso" disabled= "true" style="margin-left: 20px;width: 100px;"></input>'+
                                '</div>'+
                            '</div>'+  
                            '<div style="margin-top: 15px" class="row">'+
                                '<div style="margin-left:15px" class="col-md-1">'+
                                        '<strong>Apellido</strong>'+   
                                '</div>'+
                                    '<div class="col-md-2">'+
                                        '<input id="apellidopermiso" disabled= "true" style="margin-left: 20px;width: 100px"></input>'+
                                    '</div>'+
                            '</div>'+
                            '<div style="margin-top: 10px" class="row">'+
                                '<div  class="col-md-2" style="margin-left: 15px">'+
                                    '<strong>Usuario</strong>'+   
                                '</div>'+
                                '<div class="col-md-2">'+
                                    '<input id="usuariopermiso"  disabled= "true" style="margin-left:-21px;width: 100px"></input>'+
                                '</div>'+  
                            '</div>'+

                            '<div class="card" style="width: 28rem;margin-top:20px;margin-left:15px">'+
                                '<div class="card-body">'+
                                    '<h5 class="card-title">Permisos</h5>'+
                                    '<div class="row">'+
                                        '<div class="col-sm">'+
                                            //<!-- check ing.j-->
                                            '<div class="form-check">'+
                                                '<input type="radio" disabled  name=type id="P_PER_INGJ"  value="1" >'+
                                                '<label class="form-check-label" for="materialInline1">Ingenieria junior</label>'+
                                            '</div>'+
                                        // <!-- check ing.s-->
                                            '<div class="form-check">'+
                                                '<input type="radio" disabled  name=type id="P_PER_INGS"  value="2">'+
                                                '<label class="form-check-label" for="materialInline2">Ingenieria senior</label>'+
                                            '</div>'+
                                            //<!-- check c.calidad-->
                                            '<div class="form-check">'+
                                                '<input type="radio" disabled  name=type id="P_PER_CC"  value="3">'+
                                                '<label class="form-check-label" for="materialInline3">Control de calidad</label>'+
                                            '</div>'+
                                            '<a href="#" id="modif_permiso" onclick="modif_permiso()" style= "margin-top:40px" class="btn btn-secondary">Modificar Permisos</a>'+
                                        '</div>'+
                                        '<div class="col-sm">'+
                                            '<div class="form-check">'+
                                                '<input  type="radio" disabled name=type id="P_PER_P"  value="4">'+
                                                '<label class="form-check-label" for="materialInline4">Producción</label>'+
                                        '</div>'+
                                        '<div class="form-check">'+
                                                '<input type="radio" disabled name=type id="P_PER_ADMIN"  value="5">'+
                                                '<label class="form-check-label" for="materialInline5">Administración</label>'+
                                            '</div>'+
                                            '<div class="form-check">'+
                                                '<input type="radio" disabled name=type id="P_PER_ROOT"  value="6">'+
                                                '<label class="form-check-label" for="materialInline6">Super usuario</label>'+
                                            '</div>'+
                                        '</div>'+

                                    '</div>'+
                                '</div>'+    
                            '</div>'+
                                
                        '</div>'+

                        '<div class="modal-footer">'+
                            '<button type="button"  id="Aceptarmodifpu" onclick="Aceptarmodif(this)" class="btn btn-primary" >Aceptar</button>'+
                            '<button type="button" id="Cerrarper" onclick="Cerrarper()" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>'+
                        '</div>'+

                        '<div class="container">'+
                            '<label id="Resubi"></label>'+
                        '</div>'+
                             
                    '</div>'+
                '</div>'+    

            '</div>';

};

//---------------------------------------------------------Funcion que trae el modal para dar de alta un usuario----------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

function  htmlAltaUsuario(){
    return  '<div class="modal fade" id="myModalaltausuario">'+
                '<div class="modal-dialog modal-dialog-centered">'+
                    '<div class="modal-content">'+
                        '<div class="modal-header" style="background-color: #999">'+
                            '<strong> Alta usuario</strong>'+           
                        '</div>'+
                        '<div class="modal-body">'+
                            '<div style="margin-top: 5px" class="row">'+
                                '<div style="margin-left:15px" class="col-md-1">'+
                                    '<strong>Nombre</strong>'+
                                '</div>'+
                                '<div class="col-md-2">'+
                                    '<input id= "nombrealtau" style="margin-left: 20px;width: 100px;"></input>'+
                                '</div>'+
                            '</div>'+
                            '<div style="margin-top: 15px" class="row">'+
                                '<div style="margin-left:15px" class="col-md-1">'+
                                    '<strong>Apellido</strong>'+   
                                '</div>'+
                                '<div class="col-md-2">'+
                                    '<input id="apellidoaltau" style="margin-left: 20px;width: 100px"></input>'+
                                '</div>'+
                            '</div>'+
                            '<div style="margin-top: 10px" class="row">'+
                                '<div  class="col-md-2" style="margin-left: 15px">'+
                                    '<strong>Usuario</strong>'+   
                                '</div>'+
                                '<div class="col-md-2">'+
                                    '<input id="logonusu"  disabled= "true" style="margin-left:-21px;width: 100px"></input>'+
                                '</div>'+  
                                '<div class="col-md-2">'+
                                    '<button id="generarusu"   onclick="Generarusu()" class="btn-primary" >Generar</button>'+
                                '</div>'+ 
                            '</div>'+
                            '<div class="card" style="width: 28rem;margin-top:20px;margin-left:15px">'+
                                '<div class="card-body">'+
                                    '<h5 class="card-title">Permisos</h5>'+
                                    '<div class="row">'+
                                        '<div class="col-sm">'+
                                            //<!-- check ing.j-->
                                            '<div class="form-check form-check-inline">'+
                                                '<input type="radio" name=type id="PER_INGJ"  value="1">'+
                                                '<label class="form-check-label" for="materialInline1" >Ingenieria junior</label>'+
                                            '</div>'+
                                            //<!-- check ing.s-->
                                            '<div class="form-check form-check-inline">'+
                                                '<input type="radio" name=type id="PER_INGS" value="2">'+
                                                '<label class="form-check-label" for="materialInline2">Ingenieria senior</label>'+
                                            '</div>'+
                                            // <!-- check c.calidad-->
                                            '<div class="form-check form-check-inline">'+
                                                '<input type="radio" name=type id="PER_CC" value="3" >'+
                                                '<label class="form-check-label" for="materialInline3">Control de calidad</label>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="col-sm">'+
                                            '<div class="form-check form-check-inline">'+
                                                '<input  type="radio" name=type id="PER_P" value="4" >'+
                                                '<label class="form-check-label" for="materialInline4">Producción</label>'+
                                            '</div>'+
                                            '<div class="form-check form-check-inline">'+
                                                '<input type="radio" name=type id="PER_ADMIN" value="5">'+
                                                '<label class="form-check-label" for="materialInline5">Administración</label>'+
                                            '</div>'+
                                            '<div class="form-check form-check-inline">'+
                                                '<input type="radio" name=type id="PER_ROOT" value="6" >'+
                                                '<label class="form-check-label" for="materialInline6">Super usuario</label>'+
                                            '</div>'+
                                        '</div>'+

                                    '</div>'+    

                                '</div>'+    

                            '</div>'+   
                        '</div>'+

                        '<div class="modal-footer">'+
                            '<button type="button" id= "aceptaralta_usu" onclick="Aceptaraltausu(nombrealtau.value,apellidoaltau.value)" class="btn btn-primary" >Aceptar</button>'+
                            '<button type="button" id= "ceraralta_usu" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>'+
                        '</div>'+

                        '<div class="container">'+
                            '<label id="Resubi"></label>'+
                        '</div>'+
                    '</div>'+
                '</div>'+

            '</div>';

}

function desbloquear_estado(estado){
    var boton = null;

    if(estado == 'BA'){

        boton =  'disabled';
    }
     else{
       
        boton =  " ";
    }
 
     return boton;
}

//------------------------------------------------------------------Alta usuario-------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------
function Btnaltau(){
    $("#nombrealtau").val('');
    $("#apellidoaltau").val('');
    $("#logonusu").val('');
    $('#PER_INGJ').prop('checked', true);
    $('#myModalaltausuario').modal();

}

//-------------------------------------------------------------Busca a todos los usuarios------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------
function Bptusuario(){

    $('#tusuarios').dataTable().fnDestroy();
    var table = $('#tusuarios').DataTable({

        language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
        "ajax":{
            "url": "/buscarTodosu",
            "dataSrc":""
        },

        "columns": [
            
            { title: "Nombre","className": "text-center","data": "USR_NOMBRE"},
            { title: "Apellido","className": "text-center","data": "USR_APELLIDO" },
            { title: "Usuario","className": "text-center","data": "USR_LOGON" },
            { title: "Estado","className": "text-center","data": "USR_ESTADO" },   
            
            { title: "Permisos", 
            "data": null,
            "className": "text-center",
                'render': function (data, type, row) {
                    
                    return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip' ' " + desbloquear_estado(data.USR_ESTADO) +" title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                }
            },
            
            { title: "Baja", 
            
            "data": null,
            "className": "text-center",
                'render': function (data, type, row) {
                    return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip' ' " + desbloquear_estado(data.USR_ESTADO) +" ' title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
                    
                }
            },
                    
        ],

        "order": [[1, 'asc']],

        
    })

}
// --------------------------------------------------------------------------------------------------------------------------------------  
//--------------------------------------------Se guardan los permisos modificados--------------------------------------------------------
function Aceptarmodif(item){
    var INGJ =  $('#P_PER_INGJ').is(":checked");
    var INGS = $('#P_PER_INGS').is(":checked");
    var CC = $("#P_PER_CC").is(":checked");
    var P =   $("#P_PER_P").is(":checked");
    var ADMIN = $("#P_PER_ADMIN").is(":checked");
    var ROOT = $("#P_PER_ROOT").is(":checked");

    var permisos = [INGJ,INGS,CC,P,ADMIN,ROOT];
    console.log(permisos);
    for(var i = 0;i < permisos.length;i++){
        if((permisos[i] == true)){
            permisos[i] = 'S'
        }
        else{
            permisos[i] = 'N'
        }
    }

    var logon =  $('#usuariopermiso').val();
    console.log(logon);

    $.ajax({
        method : "GET",
        async:true,
        url:"/modpermiso_usu",
        dataType : 'json',
        data:{logon,permisos},

        success: function(res){
            console.log(res);
            var myModalmodifper = $('#myModalmodifper');
            if(res == "OK"){
               alert("Los permisos del usuario se modificaron correctamente");
                   
            }
            else{
                alert("Error al modificar los permisos para el usuario");
            }
            
        }

    })
    
    $('#myModalpermiso').modal('hide');  
   // $('#Cerrarper').click();
   Cerrarper();
};

// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Modifica  los permisos de un usuario---------------------------------------------------------------------------- 

function  modif_permiso(){       
    //habilito todos los checkbox
    $('#Aceptarmodifpu').attr('disabled', false);
    $("#P_PER_INGJ").attr("disabled", false);
    $("#P_PER_INGS").attr("disabled", false);
    $("#P_PER_CC").attr("disabled", false);
    $("#P_PER_P").attr("disabled", false);
    $("#P_PER_ADMIN").attr("disabled", false);
    $("#P_PER_ROOT").attr("disabled", false);
        
};
// ---------------------------------------------------------------------------------------------------------------------------------  
// ------------------ Muestra los permisos de un usuario----------------------------------------------------------------------------

function Permiso(item){
    console.log("llega a los permisos");
    $('#Aceptarmodifpu').attr('disabled', true);

    infodp = JSON.parse($(item).attr("id"));
 
    $('#myModalpermiso').modal('show');

  
    $("#nombrepermiso").val(infodp.USR_NOMBRE);
    $("#apellidopermiso").val(infodp.USR_APELLIDO);
    $("#usuariopermiso").val(infodp.USR_LOGON);
    
    codigo = infodp.USR_CODIGO;
    
    //paso el codigo del usuario para que se busque en la tabla
    $.ajax({
        method : "GET",
        async:true,
        url:"/mostrar_usu",
        dataType : 'json',
        data:{codigo},
        success: function(res){ 
            console.log(res[0]);
            console.log("-----------------------")
            for( var prop in res[0] ) {
               
                if(res[0][prop] == 'S'){
                    
                    console.log("SI" + " " + prop);
                  
                    $("#P_" +  prop).prop('checked',true);
                  
                    console.log("-----------------------")
                }
                else{
                    console.log("NO" + " " + prop);
                    $("#P_" + prop).prop('checked',false);
                }
                
            }
          
        }
        
        
    });
    
};

function Cerrarper(){     
    $("#P_PER_INGJ").attr("disabled", true);
    $("#P_PER_INGS").attr("disabled", true);
    $("#P_PER_CC").attr("disabled", true);
    $("#P_PER_P").attr("disabled", true);
    $("#P_PER_ADMIN").attr("disabled", true);
    $("#P_PER_ROOT").attr("disabled", true);
};
// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Busca un usuario en particular---------------------------------------------------------------------------

function Consultausu(nombre, apellido){

    $.ajax({
        method : "GET",
        async: true,
        url:"/buscarusu",
        dataType : 'json',
        data: {nombre,apellido},

        success: function(respuesta){
            //console.log(respuesta)
            $('#tusuarios').dataTable().fnDestroy();

            table =  $('#tusuarios').DataTable({ 
                data: respuesta,

                language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},

                "columns": [
              
                    { title: "Nombre","className": "text-center","data": "USR_NOMBRE"},
                    { title: "Apellido","className": "text-center","data": "USR_APELLIDO" },
                    { title: "Usuario","className": "text-center","data": "USR_LOGON" },
                    { title: "Estado","className": "text-center","data": "USR_ESTADO" },  
                   
                    { title: "Permisos", 
                    "data": null,
                    "className": "text-center",
                        'render': function (data, type, row) {
                            
                            return "<button id='"+JSON.stringify(data)+ "' data-toggle='tooltip'  " + desbloquear_estado(data.USR_ESTADO) +"  title='Modificar permisos' onclick='Permiso(this)' class='fa fa-pencil'/>"
                        }
                    },
                   
                    { title: "Baja", 
                    "data": null,
                    "className": "text-center",
                        'render': function (data, type, row) {
                            return "<button id='"+JSON.stringify(data._id)+ "' data-toggle='tooltip'  " + desbloquear_estado(data.USR_ESTADO) +" title='Baja usuario' onclick='Baja(this)' class='fa fa-trash-o'/>"
                        }
                    },
                    
                ],
                    "order": [[1, 'asc']] ,
            });
            
        }

    })
};

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Baja de un usuario---------------------------------------------------------------------------

function Baja(item){
    infousu = JSON.parse($(item).attr("id"));

    $.ajax({
        method : "GET",
        async:true,
        url:"/baja_usu",
        dataType : 'json',
        data:{infousu},
     
        success: function(res){ 
          Bptusuario();
        }
        
    })
};

// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Generar un usuario---------------------------------------------------------------------------------------

function  Generarusu() {     
    if($("#nombrealtau").val()=="" || $("#apellidoaltau").val()=="" ){
        alert("Debe completar el nombre y el apellido");
    }
    else
    {
        var nombre = $('#nombrealtau').val();
        var apellido =  $('#apellidoaltau').val();

        console.log(nombre);
        
        var logon = nombre.charAt(0) + apellido;
        
        $("#logonusu").val(logon).attr( "disabled", true);
    }  
};
// ---------------------------------------------------------------------------------------------------------------------------------  
//-------------------------Da de alta (btn) un usuario en la base de datos---------------------------------------------------------------------------------------

function Aceptaraltausu(nombre, apellido){
    var estado_check;
    var logon;
   
    $('#myModalaltausuario').modal('hide');  
   
    if($("#logonusu").val()=="")
    {
        alert("Debe generar un usuario");

    }
    else{
        logon = $("#logonusu").val();
        $('input[type=radio]:checked').each(function() {
            estado_check = $(this).prop("id");
            console.log(estado_check);
        });
        console.log(estado_check,nombre,apellido,logon);
        $.ajax({
            method : "GET",
            async:true,
            url:"/alta_usu",
            dataType : 'json',
            data:{estado_check,nombre,apellido,logon},
        
            success: function(res){ 
                if(res == "OK"){
                
                alert("El usuario se dió de alta satisfactoriamente");
                
                }
                else{
                    alert("Error al dar de alta un usuario");
                }
            
            }
            
        })
    }
};
 
function Info_usu(){   
    $('#usuarios').show(); 
    $('#altaprod').hide();
    $('#dpendientes').hide();
    $('#content').hide(); 
    $('#dconsultas').hide(); 
    $('#dregistros').hide(); 
  
};   