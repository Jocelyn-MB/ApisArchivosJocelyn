var crypto = require("crypto");
function generarPassword(password){
    var salt=crypto.randomBytes(32);
    var hash=crypto.scryptSync(password,salt,100000,64,'sha512').toString("hex");
    const saltHex = salt.toString('hex');
    return{
        salt:saltHex,
        hash
    }

};

function validarPassword(password, salt, hash) {
    
    // Calcula el hash de la contraseña proporcionada con el mismo salt y el mismo número de iteraciones
    var hashnuevo = crypto.scryptSync(password, salt,100000,64, 'sha512').toString("hex");
    
    // Compara el hash generado con el hash almacenado en la base de datos
  
    //return hashnuevo.toLowerCase() === hash.toLowerCase();
    return hashnuevo === hash;
   

};
module.exports={
    generarPassword,
    validarPassword
}