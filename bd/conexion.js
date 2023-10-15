var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var micuenta = admin.firestore();//conexion a la cuenta 

var conexionUsuarios=micuenta.collection("usuarios1");//conexion a la bd 
var conexionProductos=micuenta.collection("productos");//conexion a la bd 

module.exports={
    conexionUsuarios,
    conexionProductos
}