var ruta = require("express").Router();
var subirArchivo = require ("../middlewares/middlewares").subirArchivo;
var fs = require("fs");
var path= require("path");
//var {usuario,admin}=require ("../middlewares/passwords");
var {mostrarUsuarios, nuevousuario, buscarPorId, modificarUsuario,borrarUsuario,loginUsuario } = require("../bd/usuariosBD");

ruta.get("/",async (req, res) => {
    var users = await mostrarUsuarios();
    res.render("usuarios/mostrar", {users});
})
ruta.get("/login", (req, res) => {
    res.render("usuarios/login");
});
ruta.post("/login", async (req, res) => {
    var error=await loginUsuario(req.body);

     console.log(error);
     if(error == 1) {
          res.redirect("/login")
          console
     } else if(error == 0){
          res.redirect("/") 
     }
});
 
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

module.exports = ruta;