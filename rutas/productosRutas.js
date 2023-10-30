var rutaP = require("express").Router();
var subirArchivo = require ("../middlewares/middlewares").subirArchivo;
var {mostrarProductos, nuevoProducto, buscarPorIdP, modificarProducto,borrarProducto} = require("../bd/productosBD");
var fs = require("fs");
var path= require("path");
//var {usuario,admin}=require ("../middlewares/passwords");

rutaP.get("/mostrarProductos", async (req, res) => {
    var prods = await mostrarProductos();
    //console.log(users);
    res.render("productos/mostrar", {prods});
})
rutaP.get("/nuevoProducto",(req,res)=>{
    res.render("productos/nuevo");
}); 

rutaP.post("/nuevoProducto",subirArchivo(),async (req,res)=>{
    //console.log(req.body);
    if (req.file) {
        req.body.foto = req.file.originalname;
        var error= await nuevoProducto(req.body);
    }
    //req.body.foto= req.file.originalname;
    //var error= await nuevoProducto(req.body);
    console.log(error);
    res.redirect("/mostrarProductos"); 
}); 

rutaP.get("/editarProducto/:id",async(req,res)=>{
    var prod= await buscarPorIdP(req.params.id);
    res.render("productos/modificar",{prod});
});

rutaP.post("/editarProducto",subirArchivo(), async (req,res)=>{
   try {
        
            var rutaimg = path.join(__dirname, "..", "web", "images", req.body.foto);
            if (fs.existsSync(rutaimg)) {
                fs.unlinkSync(rutaimg);
                req.body.foto= req.file.originalname;
                await modificarProducto(req.body);
            }
        
        res.redirect("/mostrarProductos");
    } catch (error) {
        console.error("Error al editar usuario:", error);
    }
    /*

var error=  await modificarProducto(req.body);
    res.redirect("/mostrarProductos");*/
});

rutaP.get("/borrarProducto/:id", async (req,res)=>{
    var usuario = await buscarPorIdP(req.params.id);
        if (usuario) {
            var rutaimg = path.join(__dirname, "../web/images", usuario.foto);
            if (fs.existsSync(rutaimg)) {
                fs.unlinkSync(rutaimg);
            }
            await borrarProducto(req.params.id);
        }
        res.redirect("/mostrarProductos");

    /*await borrarProducto(req.params.id);
    res.redirect("/mostrarProductos");*/
})

module.exports = rutaP;