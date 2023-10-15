var rutaP = require("express").Router();
var {mostrarProductos, nuevoProducto, buscarPorIdP, modificarProducto,borrarProducto} = require("../bd/productosBD");

rutaP.get("/api/mostrarProductos", async (req, res) => {
    var prods = await mostrarProductos();
    if(prods.length > 0){
        res.status(200).json(prods)
    }else{
        res.status(400).json("Productoos no encontrados :(")
    }

});


rutaP.get("/nuevoProducto",(req,res)=>{
    res.render("productos/nuevo");
}); 

rutaP.post("/api/nuevoProducto",async (req,res)=>{
    var error= await nuevoProducto(req.body);
    if(error==0){
        res.status(200).json("Producto registrado super nice ")
    }else{
        res.status(400).json("Im so sorry, no se registro el producto")
    }
}); 

rutaP.get("/api/buscarProductoPorId/:id",async(req,res)=>{
    var prod= await buscarPorIdP(req.params.id);
    if(prod!=undefined){
        res.status(200).json(prod)
    }else{
        res.status(400).json("Producto no encontradoo :C")
    }
});

rutaP.post("/api/editarProducto", async (req,res)=>{
    var error=  await modificarProducto(req.body);
    if(error==0){
        res.status(200).json("Producto actualizado nice ")
    }else{
        res.status(400).json("Error al actualizar el producto")
    }
});

rutaP.get("/api/borrarProducto/:id", async (req,res)=>{
   var error= await borrarProducto(req.params.id);
    if(error==0){
        res.status(200).json("Producto borradooo")
    }else{
        res.status(400).json("Error al borrar el producto")
    }
});



module.exports = rutaP;