module.exports = function (app) {
    let controller = require('../controllers/bank.controller');
    const checkBody = require('../functions/bankCheckBody.function');
    app.post('/addBank',checkBody.checkBodyAddBank, controller.addBank);
    app.post('/editBank',checkBody.checkBodyEditBank, controller.editBank);
    app.post('/searchBank', controller.searchBank);
    app.post('/getBankActive', controller.getBankActive);
}