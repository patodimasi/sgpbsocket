
function Info_reg(nombre_tabla,titulo){ 
    $('#dregistros').show();
    $('#dconsultas').hide();
    $('#content').hide(); 
    $('#dpendientes').hide(); 
    $('#altaprod').hide();
    $('#usuarios').hide(); 
    $('#example_reg').dataTable().fnDestroy();
    $("#example_reg th").html("");  
    $("#example_reg > tbody").html("");
    $('#titulo_reg').text(titulo);
    $('#bpb_reg').val(nombre_tabla);
    // esta variable json la uso para cargar el contenido del json del protocolo de ensayo
    jsonProtocolo = [];
    
}  

function Buscar_reg(){    
    var nombre = $("#bpb_reg").val();
    var nombre_tabla_consulta = nombre;
    var ensayo = $("#ensayo").val().toUpperCase();
    var serie = $("#serie").val();
    var pedido = $("#pedido").val();
    var cliente = $("#cliente").val();
    var producto = $("#producto").val();
    var estado = $("#estado").val();

    $.ajax({
        method : "GET",
        async: true,
        url:"/buscar_reg",
        dataType : 'json',
        data: {ensayo,serie,pedido,cliente,producto,estado,nombre_tabla_consulta},

        success: function(respuesta){
            $('#example_reg').dataTable().fnDestroy();

            table =  $('#example_reg').DataTable({ 
                data: respuesta,
                language:{"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"},
                "lengthMenu": [[20, 30, 50, 100, -1], [ 20, 30, 50, 100, "Todos"]],
                
                "columns": [
                
                    { 
                        targets: 0,
                        data: null,
                        className: 'text-center',
                        searchable: false,
                        orderable: false,
                     
                        render: function(data, type, full, meta) {
                            return "<input  type='checkbox'  id='"+(data._id) +"'  class='"+data.NENSAYO+"'/>"
                        },
                     
                    },
            
                    {title: "Ensayo","className": "text-center", "data": "NENSAYO"},
                    {title: "Fecha", "className": "text-center", "data": "FECHA"},
                    {title: "Pedido", "className": "text-center", "data": "PEDIDO"}, 
                    {title: "Serie", "className": "text-center", "data": "NSERIE"},
                    {title: "Estado", "className": "text-center", "data": "ESTADO"},
                    {title: "Producto", "className": "text-center", "data": "PRODUCTO"},
                    {title: "Cliente", "className": "text-center", "data": "CLIENTE"},
                    {title: "Descripción", "className": "text-left", "data": "DESCRIPCION"},
                    {title: "Eime", "className": "text-center",  "data": "EIME"},
                    {title: "U.Alta", "className": "text-center", "data": "UALTA"},           
                            
                ],
            
                    
            });

        }

    });

    
};

$("#example_reg").on("change", "input", function() {
    var aux = $(this).attr('class')
    var estado = $(this).is(":checked")
    
    $.ajax({
        method : "GET",
        async: true,
        url:"/tildarreg",
        dataType : 'json',
        data: {aux},

        success: function(respuesta){
            console.log(respuesta);
           for (i = 0; i < respuesta.length  ; i++) {
               if(estado == true){
                    $("#"+ respuesta[i]._id).prop('checked', true);

                    item = {}
                    item ["NENSAYO"] = respuesta[i].NENSAYO;
                    item ["FECHA"] = respuesta[i].FECHA;
                    item ["PEDIDO"] = respuesta[i].PEDIDO;
                    item ["NSERIE"] = respuesta[i].NSERIE;
                    item ["ESTADO"] = respuesta[i].ESTADO;
                    item ["PRODUCTO"] = respuesta[i].PRODUCTO;
                    item ["CLIENTE"] = respuesta[i].CLIENTE;
                    item ["DESCRIPCION"] = respuesta[i].DESCRIPCION;
                    item ["UALTA"] = respuesta[i].UALTA;
                    item ["EIME"] = respuesta[i].EIME;

                    jsonProtocolo.push(item);
               }
               else{
                    $("#"+ respuesta[i]._id).prop('checked', false);
                   
               }

            }
           
        }

    });    

});

function GenerarProtocolo(){
    console.log("llega al generar");
    $.ajax({
        type: 'get',
        url: '/sendPDF',

        data: {jsonProtocolo},

        xhrFields: {responseType: "blob"},
        success: function (data) {
            var blob = new Blob([data], { type: "application/pdf" });
            var win = window.open('', '_blank');
            var URL = window.URL || window.webkitURL;
            var dataUrl = URL.createObjectURL(blob);
            win.location = dataUrl;  
        }
    });

};



