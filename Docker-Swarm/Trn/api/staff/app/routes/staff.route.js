const controller = require('../controllers/staff.controller');
const checkBody = require('../functions/staffCheckBody.function');
module.exports = app => {
    app.post('/searchStaff', controller.searchStaff);
    app.post('/addStaff',checkBody.checkBodyAddStaff, controller.addStaff);
    app.post('/editStaff',checkBody.checkBodyEditStaff, controller.editStaff);
    app.post('/resetPassword',checkBody.checkBodyResetPassword, controller.resetPassword);
    app.post('/getPrefix', controller.getPrefix);
    app.post('/getStatus', controller.getStatus);
}