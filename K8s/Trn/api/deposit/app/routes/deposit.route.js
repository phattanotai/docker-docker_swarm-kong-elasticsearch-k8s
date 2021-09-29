const controller = require('../controllers/deposit.controller');
module.exports = app => {
    app.post('/getDeposit', controller.getDeposit);
    app.post('/getSearchUsername', controller.getSearchUsername);
    app.post('/getDepositBank', controller.getDepositBank);
    app.post('/getDepositStatus', controller.getDepositStatus);
    app.post('/insertDepositTransaction', controller.insertDepositTransaction);
    app.post('/editDeposit', controller.editDeposit);
    app.post('/updateDepositStatus', controller.updateDepositStatus);
    app.post('/getDepositImageBill', controller.getDepositImageBill);
    
}