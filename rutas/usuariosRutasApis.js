var ruta = require("express").Router();
var {mostrarUsuarios, nuevousuario, buscarPorId, modificarUsuario,borrarUsuario } = require("../bd/usuariosBD");
const Usuario = require("../modelos/Usuario");

ruta.get("/api/", async (req, res) => {
    var usuarios = await mostrarUsuarios();
    if(usuarios.length > 0){
        res.status(200).json(usuarios)
    }else{
        res.status(400).json("Usuarios no encontradosssss :(")
    }
})

ruta.get("/nuevousuario",(req,res)=>{
    res.render("usuarios/nuevo");
}); 

ruta.post("/api/nuevousuario",async (req,res)=>{
    var error= await nuevousuario(req.body);
    if(error==0){
        res.status(200).json("Usuario registrado aesthetico")
    }else{
        res.status(400).json("ERROR AL REGISTRAR USUARIO")
    }
}); 

ruta.get("/api/buscarUsuarioPorId/:id",async(req,res)=>{
    var user= await buscarPorId(req.params.id);
    if(user!=undefined){
        res.status(200).json(user)
    }else{
        res.status(400).json("Usuario no encontrado")
    }
});

ruta.post("/api/editarUsuario", async (req,res)=>{
    var error=  await modificarUsuario(req.body);
    //console.log("error");
    if(error==0){
        res.status(200).json("Usuario  actualizado correctamentee")
    }else{
        res.status(400).json("error al actualizar el usuario")
    }
});+

ruta.get("/api/borrarUsuario/:id", async (req,res)=>{
    var error= await borrarUsuario(req.params.id);
    if(error==0){
        res.status(200).json("Usuario borradooo, nice :V")
    }else{
        res.status(400).json("Error al borrar al usuario :(")
    }
});


module.exports = ruta;