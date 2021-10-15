const controller = require('../controllers/auth.controller');
const checkBody = require('../functions/authCheckBody.function');
module.exports = app => {
    app.post('/login',checkBody.checkBodyLogin, controller.login);
    app.post('/unlock',checkBody.checkBodyLogin, controller.unlock);
    app.post('/checkLogin', controller.checkLogin);
    app.get('/hello', controller.hello);
}