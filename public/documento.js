function Documento(nombre,nombre_tabla){
    this.nombre_tabla = nombre_tabla;
    this.nombre = nombre;
}

function Plano(nombre,nombre_tabla) {   
    Documento.call(this,nombre,nombre_tabla); 
    
} 

Plano.prototype = new Documento(); 

function Material(nombre,nombre_tabla) {   
    Documento.call(this,nombre,nombre_tabla); 
    
} 

Material.prototype = new Documento(); 

function Manual(nombre,nombre_tabla){
    Documento.call(this,nombre,nombre_tabla);
}

Manual.prototype = new Documento();

