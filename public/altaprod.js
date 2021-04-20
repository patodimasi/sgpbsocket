
$(function() {
    displayKPI();

});  

function displayKPI(){
 var user;
    $.ajax({
     
        method : "GET",
        async: true,
        url:"/traerprod",
        dataType : 'json',

        success: function (data) {
            iDependOnMyParameter(data);
           // return data;
          
        },
        error: function(){
            alert('Error ocurred');
        }
        
    });
    
   
}

function iDependOnMyParameter(param1){
  var tbody = '';
  
   for(var i = 0; i< param1.length;i++){ 
    tbody += '<tr>';
    tbody += '<td style="display:none" >'+param1[i]._id +'</td>';
    tbody  += '<td style=" text-align: center">'+param1[i].PLN_FECHA +'</td>';
    tbody  += '<td style=" text-align: center">'+param1[i].PLN_NOMBRE +'</td>';
    tbody  += '<td style=" text-align: center">'+param1[i].PLN_DESCRIPCION +'</td>';
    
    tbody += '</tr>';
   }
   
   $('#foo').prepend(tbody);
   $('#makeEditable').SetEditable({ $addButton: $('#but_add')});

}


function Info_altaprod(){    
    $('#altaprod').show();
    $('#dpendientes').hide();
    $('#content').hide(); 
    $('#dconsultas').hide(); 
    $('#usuarios').hide(); 
    $('#dregistros').hide(); 
}   