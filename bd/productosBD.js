var conexion=require ("./conexion").conexionProductos;
var Producto=require ("../modelos/Producto");


async function mostrarProductos(){
    var prods = [];
    try {
        var productos = await conexion.get();
        productos.forEach(producto => {
        var producto1 = new Producto(producto.id, producto.data());
        if(producto1.bandera == 0){
            prods.push(producto1.obtenerProducto);
        }
    })
    }
    catch(err) {
        console.log("Error al mostrar productos " + err);
        prods = [];
    }
    return prods;
}

async function nuevoProducto(newProd){ 
  var error=1; 
  try{
    var producto1 = new Producto(null,newProd); 
    if(producto1.bandera==0){
      console.log(producto1.obtenerProducto);
      await conexion.doc().set(producto1.obtenerProducto); //doc sin id 
      error=0;
    }
    else{
      console.log("Datos incorrectos ");
    }
  }
  catch(err){
    console.log("Error al crear un nuevo producto "+err);
  }
  return error; 
}

async function buscarPorIdP(id) {
  var prod;
  try {
    var productoBD = await conexion.doc(id).get();
    var productoObjeto= new Producto(productoBD.id, productoBD.data());
    if(productoObjeto.bandera==0){
      prod = productoObjeto.obtenerProducto;
    }
    /*
    return usuarioObjeto; // Agregar retorno para la función*/
  } catch (err) {
    console.log("Error al recuperar el usuario  " + err);
    //return null; // Manejar el error y devolver un valor adecuado
  }
  return prod; 
}

async function modificarProducto(datos){
  var prod= new Producto(datos.id,datos);
  var error=1;
  if(prod.bandera==0){
    try{
      await conexion .doc(prod.id).set(prod.obtenerProducto);
      console.log("Los datos se modificaron correctamente");
      error=0; 
    }catch(err){
     console.log("Error al modificar el producto" + err);
    }
  }else{
    console.log("Error los datos no son validos");
  }
  return error; 
}

async function borrarProducto(id){
  var error=1;
  var prod= await buscarPorIdP(id);
  if(prod != undefined){
    try{
      await conexion.doc(id).delete() ;
      console.log("El producto se borro correctamente");
      error=0;
    }catch(err){
      console.log("Error al borrar el producto "+err);
    }
 }
 return error; 
}


module.exports = {
   mostrarProductos,
   nuevoProducto,
   buscarPorIdP,
   modificarProducto,
   borrarProducto
}
