
const { secret,expiresIn } = require('../../../constants/jwtConn');
const fu = require('../../../constants/functionUtil');
const jwt = require('jsonwebtoken');
const debug = fu.debug;
let Pusher = require('pusher');
let pusher = new Pusher({
    appId: '1073182',
    key: 'dc44d9c450d61db16cb6',
    secret: 'e9bbb058778b8686d95e',
    cluster: 'ap1',
    useTLS: true,
});
// FUNCTION CREATE LOGIN TOKEN STAFF  1/9/2020
module.exports.login = jsonData => {
    return new Promise((resolve, reject) => {
        try {
            if (!fu.isNull(jsonData)) {
                const data = {
                    prefix: jsonData.prefix,
                    prefixName: jsonData.prefixName,
                    first_name: jsonData.first_name,
                    last_name: jsonData.last_name,
                    tel: jsonData.tel,
                    email: jsonData.email,
                    status: jsonData.status,
                    statusName: jsonData.statusName.status_name,
                    username: jsonData.username,
                    _id: jsonData._id,
                    ou_id: jsonData.ou_id
                }
                const result = {
                    token : jwt.sign(data, secret, { expiresIn: expiresIn })
                }
                resolve(result);
            } else {
                resolve(false);
            }
        } catch (error) {
            debug('auth.function -> login -> ' + error);
            reject(error);
        }
    });
}
// FUNCTION CHECK LOGIN TOKEN STAFF  1/9/2020
module.exports.checkLogin = (req) => {
    return new Promise((resolve, reject) => {
        try {
            if(req.headers.authorization){
                const decoded = jwt.verify(req.headers.authorization.substring(7), secret);
                resolve(decoded);
            }else{
                reject('Authorization header not found');
            }
        } catch (error) {
            debug('auth.function -> checkLogin -> ' + error);
            reject(error);
        }
    });
}
// FUNCTION PUSHER LOGIN  STAFF  15/9/2020
module.exports.pusherLogin = (data,token) => {
    pusher.trigger('staff', 'login', {username: data.username,token});
}
