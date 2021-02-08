/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
  "use strict";
  //Global variables
  var params = null;  		//Parameters
  var colsEdi =null;
  var info = null;
  var newColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default"  onclick="rowEdit(this);">' +
'<i class="fas fa-pencil-alt"></i>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default"  onclick="rowElim(this);">' +
'<i class="fas fa-trash" aria-hidden="true"></i>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default"  style="display:none;" onclick="rowAcep(this);">' + 
'<i class="fas fa-check"></i>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default" style="display:none;"  onclick="rowCancel(this);">' + 
'<i class="fas fa-times" aria-hidden="true"></i>'+
'</button>'+
    '</div>';

     var saveColHtml = '<div class="btn-group pull-right">'+
'<button id="bEdit" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowEdit(this);">' +
'<i class="fas fa-pencil-alt"></i>'+
'</button>'+
'<button id="bElim" type="button" class="btn btn-sm btn-default" style="display:none;" onclick="rowElim(this);">' +
'<i class="fas fa-trash" aria-hidden="true"></i>'+
'</button>'+
'<button id="bAcep" type="button" class="btn btn-sm btn-default"   onclick="rowAcep(this);">' + 
'<i class="fas fa-check"></i>'+
'</button>'+
'<button id="bCanc" type="button" class="btn btn-sm btn-default"  onclick="rowCancel(this);">' + 
'<i class="fas fa-times" aria-hidden="true"></i>'+
'</button>'+
    '</div>';
  var colEdicHtml = '<td name="buttons">'+newColHtml+'</td>'; 
var colSaveHtml = '<td name="buttons">'+saveColHtml+'</td>';
    
  $.fn.SetEditable = function (options) {
	  //console.log("esta es la fila selecconada" + " " + idfila);
	 // id = idfila;
	
    var defaults = {
        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        //Jquery object of "Add" button
        onEdit: function() {},   //Called after edition
		onBeforeDelete: function() {}, //Called before deletion
        onDelete: function() {}, //Called after deletion
        onAdd: function() {}     //Called when added a new row
    };
    params = $.extend(defaults, options);
    this.find('thead tr').append('<th name="buttons"></th>');  //encabezado vacío
    this.find('tbody tr').append(colEdicHtml);
	var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
    //Process "addButton" parameter
    if (params.$addButton != null) {
        //Se proporcionó parámetro
        params.$addButton.click(function() {
            rowAddNew($tabedi.attr("id"));
        });
    }
    //Process "columnsEd" parameter
    if (params.columnsEd != null) {
        //Extract felds
        colsEdi = params.columnsEd.split(',');
    }
  };
function IterarCamposEdit($cols, tarea) {
	
//Itera por los campos editables de una fila
    var n = 0;
    $cols.each(function() {
        n++;
        if ($(this).attr('name')=='buttons') return;  //excluye columna de botones
        if (!EsEditable(n-1)) return;   //noe s campo editable
        tarea($(this));
    });
    
    function EsEditable(idx) {
    //Indica si la columna pasada está configurada para ser editable
        if (colsEdi==null) {  //no se definió
            return true;  //todas son editable
        } else {  //hay filtro de campos
//alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
              if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontró
        }
    }
}
function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}
function FijModoEdit(but) {

    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que está en edición
}
function ModoEdicion($row) {
    if ($row.attr('id')=='editing') {
        return true;
    } else {
        return false;
    }
}

function rowAcep(but) {
//Acepta los cambios de la edición
    var cont;
	//console.log("es el id en modo edicion" +  " " + id);
	var vector = new Array();
	
    //console.log("llega a la biblioteca2");
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
	
	
	var nombrecel = $row.find('td:eq(2) input').val();
	
	if(nombrecel == ""){
		alert("Debe completar el campo nombre de producto");
	}
	else{
		if (!ModoEdicion($row)) return;  //Ya está en edición
		//Está en edición. Hay que finalizar la edición
		IterarCamposEdit($cols, function($td) {  //itera por la columnas
		cont = $td.find('input').val(); //lee contenido del input
		//console.log("esto es el cont" + " " + cont);
		vector.push(cont);
		  
		  $td.html(cont);  //fija contenido y elimina controles
		});
		
		
		//console.log("esta es la columna" + " " + vector[0] + " " + vector[1] + " " + vector[2] + " " + vector[3]);
		guardarbd(vector,info);
		
		FijModoNormal(but);
		params.onEdit($row);
	}
}

function guardarbd(vector,info){
	//console.log("Info de las columnas" + " " +  vector[0],vector[1],vector[2]);
	var id = vector[0];
	var fecha = vector[1];
	var nombre = vector[2];
	var descripcion = vector[3];
	var msj = info;
	
	console.log("este es el mensaje" + " " + msj);
	
	  $.ajax({
     
        method : "GET",
        async: true,
        url:"/guardarprod",
        dataType : 'json',
		data: {id,fecha,nombre,descripcion,msj},
		
        success: function (data) {
			if(data == "NO_OK_ALTA")
				alert("Error al dar de alta un producto, vuelva a intentarlo mas tarde");
			if (data == "NO_OK_UPDATE")
				alert("Error al modificar un producto, vuelva a intentarlo mas tarde");
          
        },
       
        
    });
	
}

function rowCancel(but) {
//Rechaza los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}
function rowEdit(but) {  
	
    var $td = $("tr[id='editing'] td");
    rowAcep($td)
    var $row = $(but).parents('tr');  
    var $cols = $row.find('td');  
    if (ModoEdicion($row)) return;  //Ya está en edición
    //Pone en modo de edición
    IterarCamposEdit($cols, function($td) {  //itera por la columnas
        var cont = $td.html(); //lee contenido
        var div = '<div style="display: none;">' + cont + '</div>';  //guarda contenido
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        $td.html(div + input);  //fija contenido
    });
    FijModoEdit(but);
}
function rowElim(but) {  //Elimina la fila actual
    var $row = $(but).parents('tr');  //accede a la fila
	var aux = $row[0].childNodes[0].innerHTML;
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
	
	borrarp(aux);
}
function borrarp(aux){
	console.log("llego al borrar" + " " + aux);
	var row = aux;
	
	  $.ajax({
     
        method : "GET",
        async: true,
        url:"/eliminarprod",
        dataType : 'json',
		data: {row},
		
        success: function (data) {
			if(data == "NO_OK")
				alert("Error al eliminar el producto seleccionado");
			
        },
       
        
    });
	
}

function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
info = "alta";
//console.log(info);
var $tab_en_edic = $("#" + tabId);  //Table to edit
    var $filas = $tab_en_edic.find('tbody tr');
    if ($filas.length==0) {
        //No hay filas de datos. Hay que crearlas completas
        var $row = $tab_en_edic.find('thead tr');  //encabezado
        var $cols = $row.find('th');  //lee campos
        //construye html
        var htmlDat = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
                htmlDat = htmlDat + colEdicHtml;  //agrega botones
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('tbody').append('<tr>'+htmlDat+'</tr>');
    } else {
        //Hay otras filas, podemos clonar la última fila, para copiar los botones
        var $ultFila = $tab_en_edic.find('tr:last');
        $ultFila.clone().appendTo($ultFila.parent()); 
        $tab_en_edic.find('tr:last').attr('id','editing'); 
        $ultFila = $tab_en_edic.find('tr:last');
        var $cols = $ultFila.find('td');  //lee campos
        
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                var div = '<div style="display: none;"></div>';  //guarda contenido
                var input = '<input class="form-control input-sm"  value="">';

                $(this).html(div + input);  //limpia contenido
            }
        });
         $ultFila.find('td:last').html(saveColHtml);

    }
	params.onAdd();
}
function TableToCSV(tabId, separator) {  //Convierte tabla a CSV
    var datFil = '';
    var tmp = '';
	var $tab_en_edic = $("#" + tabId);  //Table source
    $tab_en_edic.find('tbody tr').each(function() {
        //Termina la edición si es que existe
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  //acepta edición
        }
        var $cols = $(this).find('td');  //lee campos
        datFil = '';
        $cols.each(function() {
            if ($(this).attr('name')=='buttons') {
                //Es columna de botones
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil!='') {
            datFil = datFil.substr(0, datFil.length-separator.length); 
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}
