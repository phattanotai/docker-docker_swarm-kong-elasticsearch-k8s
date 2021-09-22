const crypto = require("crypto");
const {secret,hashSecret} = require('../constants/jwtConn');
const statusCode = require('./httpStatusCodes');
// วิธีใช้ ------------------------------------------------------------
// const fs = require('../../../constants/functionUtil');
// const c = await fs.getUserData(request,require('jsonwebtoken'))
// console.log(c)
// FUNCTION GETUSERDATA TOKEN 1/9/2020
exports.getUserData = (request, jwt) => {
    return new Promise((resolve, reject) => {
        try {
            if(!request.headers.authorization){
                resolve(false);
            }else{
                let token = request.headers['authorization'].substring(7);
                const decoded = jwt.verify(token, secret);
                resolve(decoded);
            }
        } catch (error) {
            this.debug('functionUtil -> getUserData ->' + error);
            resolve(false);
        }
    });
}
// FUNCTION DEBUG  10/9/2020
module.exports.debug = (message) => {
    const d = new Date();
    const l = '/';
    const s = ':';
    let dateFormat = `${d.getDate()}${l}${d.getMonth()+1}${l}${d.getFullYear()}` + 
    ' ' + 
    `${d.getHours()}${s}${d.getMinutes()}${s}${d.getSeconds()}`;
	console.log([dateFormat],": " + message);
};
// FUNCTION HASH PASSWORD  4/9/2020
exports.hashPassword2 = (password) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash;
        resolve(hash('sha256').update(password).digest('hex'));
    });
}
// FUNCTION HASH PASSWORD 2 10/9/2020
exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
      const hmac = crypto.createHmac('sha256', hashSecret);
      resolve(hmac.update(password).digest('hex'));
    });
}
// FUNCTION CHECK OBJECT ARRAY IS NULL OR UNDEFINED  2/9/2020
exports.isNull = (param) => {
    if ((param == false) || (param == null) || (param == undefined) || (param.length <= 0)) {
        return true;
    } else {
        if(!Object.keys(param).length){
            return true;
        }
        return false;
    }
}
exports.checkNull = (param) => {
    if (param !== '' && typeof param !== 'undefined' && typeof param !== null) {
        return true;
    } else {
        return false;
    }
}
// Error run server
exports.onError = function(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    switch (error.code) {
      case 'EACCES':
        console.error('port ' + error.port + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('port ' + error.port + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
}
exports.checkHeader = (req,res,next) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.send({ 
            statusCode: statusCode.ClientErrors.notAcceptable.codeText, 
            statusText: statusCode.ClientErrors.notAcceptable.description, 
            message: 'Authorization header not found'
        });
    }
}