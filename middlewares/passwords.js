var crypto = require("crypto");
function generarPassword(password){
    var salt=crypto.randomBytes(32);
    var hash=crypto.scryptSync(password,salt,100000,64, 'sha512');
    return{
        salt,
        hash
    }
}

/*var{salt,hash}=generarPassword("hola");
console.log(salt);
console.log(hash);
*/
function validarPassword(password, salt, hash) {
    var hashnuevo = crypto.scryptSync(password, salt, 100000, 64, 'sha512');
    return hashnuevo.equals(hash);
}

module.exports = {
    generarPassword,
    validarPassword
}