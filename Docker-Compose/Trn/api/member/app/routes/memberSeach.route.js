const controller = require('../controllers/memberRegister.controller');
module.exports = app => {
    app.post('/memberSeach', controller.memberSeach);
    app.post('/memberRegister', controller.memberRegister);
    app.post('/getdatamember', controller.Getdatamember);
    app.post('/getPrefix', controller.Getprefix);
    app.post('/getStatus', controller.GetStatus);
}