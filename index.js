var express=require("express");
var path= require("path");
var cors = require("cors");
const session=require('express-session');
var rutasUsuarios=require("./rutas/usuariosRutas"); 
var rutasProductos=require ("./rutas/productosRutas");
var rutasUsuariosApis=require("./rutas/usuariosRutasApis"); 
var rutasProductosApis = require ("./rutas/productosRutasApis");
var app=express();

require("dotenv").config();
app.set("view engine","ejs"); 
app.use(cors())
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); //cuando esta en false quiere decir que no voy a podermandar datos 
app.use("/",express.static(path.join(__dirname,"/web")));
app.use("/",rutasUsuarios);
app.use("/",rutasProductos);
app.use("/",rutasUsuariosApis);
app.use("/",rutasProductosApis);

app.use(session({
    secret:process.env.SESSION_SECRETO,
    resave:true,
    saveUninitialized:true
}));
var port=process.env.PORT || 3000; 

app.listen(port, ()=>{
    console.log("server in http://localhost:"+port);
});