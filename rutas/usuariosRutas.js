var ruta = require("express").Router();
var subirArchivo = require ("../middlewares/middlewares").subirArchivo;
var fs = require("fs");
var path= require("path");
var {mostrarUsuarios, nuevousuario, buscarPorId, modificarUsuario,borrarUsuario,identificarUsuario } = require("../bd/usuariosBD");
const { log } = require("console");

ruta.get("/", async (req, res) => {
    var users = await mostrarUsuarios();
    //console.log(users);
    res.render("usuarios/mostrar", {users});
})
ruta.get("/nuevousuario",(req,res)=>{
    res.render("usuarios/nuevo");
}); 

ruta.post("/nuevousuario", subirArchivo(), async (req,res)=>{
    //console.log(req.file.originalname);
    req.body.foto= req.file.originalname;
    //res.end();
    var error= await nuevousuario(req.body);
    //console.log(error);
    res.redirect("/"); 
}); 

ruta.get("/editarUsuario/:id",async(req,res)=>{
    var user= await buscarPorId(req.params.id);
    res.render("usuarios/modificar",{user});
});

ruta.post("/editarUsuario",subirArchivo(), async (req,res)=>{
   
    /*if(req.file!=undefined){
        req.body.foto=req.file.originalname; 
        }
    }else{  
        req.body.foto=req.body.fotoVieja;
    }
    var error=await modificarUsuario(req.body);
    console.log("req.body");
    res.redirect("/");*/
    if (req.file != undefined) {
        if (req.body.fotoVieja) {
            var rutaimgVieja = path.join(__dirname, "../web/images", req.body.fotoVieja);
            if (fs.existsSync(rutaimgVieja)) {
                fs.unlinkSync(rutaimgVieja);
            }
        }
    
        req.body.foto = req.file.originalname;
    } else {
        req.body.foto = req.body.fotoVieja;
    }
    
    var error = await modificarUsuario(req.body);
    console.log(req.body);
    res.redirect("/");
    

});

ruta.get("/borrarUsuario/:id", async (req, res) => {
    try {
        var usuario = await buscarPorId(req.params.id);
        if (usuario) {
            var rutaImagen = path.join(__dirname, "../web/images", usuario.foto);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
            }
            await borrarUsuario(req.params.id);
        }
        res.redirect("/");
    } catch (error) {
        console.error("Error al borrar usuario", error);
    }
});
ruta.get("/identificarUsuario", (req, res) => {
    res.render("usuarios/login");
});

ruta.post("/identificarUsuario", async (req, res) => {
    const error = await identificarUsuario(req.body);

    if (error === 0) {
        // Credenciales válidas, redirige a una página de bienvenida o a donde desees
        res.redirect("/nuevousuario");
    } else {
        // Manejar errores según el código de error
        if (error === 1) {
            console.log("Falta información (usuario o contraseña)");
        } else if (error === 2) {
            console.log("Contraseña incorrecta");
        } else if (error === 3) {
            console.log("Usuario no encontrado");
        } else if (error === 4) {
            console.log("Error al recuperar el usuario");
        }

        // Redirige de nuevo al formulario de inicio de sesión con un mensaje de error
        res.redirect("/identificarUsuario");
    }
});
    /*var user= await identificarUsuario(req.params.usuario);
    res.render("usuarios/login",{user});*/

/*ruta.get("/",async(req,res)=>{
    var user= await identificarUsuario(req.params.usuario);
    res.render("usuarios/login",{user});
});
*/
module.exports = ruta;