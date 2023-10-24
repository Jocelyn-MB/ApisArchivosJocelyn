var conexion = require("./conexion").conexionUsuarios;
var Usuario = require("../modelos/Usuario");
var {generarPassword}=require("../middlewares/passwords");
var { validarPassword } = require("../middlewares/passwords");

async function mostrarUsuarios(){
    var users = [];
    try {
        var usuarios = await conexion.get();
        usuarios.forEach(usuario => {
        //console.log(usuario.data());
        var usuario1 = new Usuario(usuario.id, usuario.data());
        if(usuario1.bandera == 0){
            users.push(usuario1.obtenerUsuario);
        }
    })
    }
    catch(err) {
        console.log("Error al mostrar usuarios " + err);
        users = [];
    }
    return users;
}

async function nuevousuario(newUser){ 
  var error=1; 
  try{
    var {salt,hash}=generarPassword(newUser.password);
    newUser.salt=salt;
    newUser.password=hash;
    var usuario1 = new Usuario(null,newUser); 
    //console.log(usuario1);
    if(usuario1.bandera==0){
      console.log(usuario1.obtenerUsuario);
      await conexion.doc().set(usuario1.obtenerUsuario); //doc sin id 
      error=0;
    }
    else{
      console.log("Datos incorrectos ");
    }
  }
  catch(err){
    console.log("Error al crear un nuevo usuario "+err);
  }
  return error; 
}

async function buscarPorId(id) {//se quito id por datos
  var user;
  try {
    //console.log(id);
    var usuarioBD = await conexion.doc(id).get();
    //var usuarioBD = await conexion.conexion("usuario","==",datos.usuario).get();//busca a un usuario por el id tambien puede resivir datos
    //var usuarioBD = await conexion.where("usuario","==",datos.usuario).get();
    var usuarioObjeto= new Usuario(usuarioBD.id, usuarioBD.data());
    //console.log(usuarioObjeto);
    if(usuarioObjeto.bandera==0){
      user = usuarioObjeto.obtenerUsuario;
      //console.log(user);
    }
    /*
    return usuarioObjeto; // Agregar retorno para la función*/
  } catch (err) {
    console.log("Error al recuperar el usuario  " + err);
    //return null; // Manejar el error y devolver un valor adecuado
  }
  console.log(user);
  return user; 
}

async function modificarUsuario(datos){
  var error=1;
  var user=await buscarPorId(datos.id);
  if(user!=undefined){
    if(datos.password===""){
      datos.password=datos.passwordAnterior;
    }else{
      var {salt,hash}=generarPassword(datos.password);
      datos.salt=salt;
      datos.password=hash;
    }
    var user= new Usuario(datos.id,datos);
    if(user.bandera==0){
      try{
        await conexion .doc(user.id).set(user.obtenerUsuario);
        console.log("Usuario actualizado");
        error=0; 
      }catch(error){
      console.log("Error al modificar el usuario" + err);
      }
    }else{
      console.log("Error los datos no son validos");
    }
}
  return error; 
}

async function borrarUsuario(id){
  var error= 1; 
  var user= await buscarPorId(id);
  if(user!=undefined){
    try{
      await conexion.doc(id).delete() ;
      console.log("El usuario se borro correctamente");
      error=0;
    }catch(err){
      console.log("Error al borrar el usuario "+err);
    }
 }
 return error; 
}

async function identificarUsuario(datos) {
  try {
    if (!datos.usuario || !datos.password) {
      return 1; // Si falta información, devuelve un valor de error
    }
    
    const usuarios = await mostrarUsuarios(); // Obtener la lista de usuarios
    const usuario = usuarios.find(user => user.usuario === datos.usuario);
    
    if (usuario) {
      if (validarPassword(datos.password, usuario.salt, usuario.password)) {
        console.log("Credenciales válidas");
        return 0; // Credenciales válidas, devuelve éxito
      } else {
        console.log("Contraseña incorrecta");
        return 2; // Contraseña incorrecta
      }
    } else {
      console.log("Usuario no encontrado");
      return 3; // Usuario no encontrado
    }
  } catch (err) {
    console.log("Error al recuperar el usuario " + err);
    return 4; // Error al recuperar el usuario
  }
};

module.exports = {
    mostrarUsuarios,
    nuevousuario,
    buscarPorId,
    modificarUsuario,
    borrarUsuario,
    identificarUsuario
}