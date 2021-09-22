const controller = require('../controllers/memberDetail.controller');
module.exports = app => {
    app.post('/getDdlParameter', controller.getDdlParameter);
    app.post('/renderDdlPrefix', controller.renderDdlPrefix);
    app.post('/tabDepositTabel', controller.tabDepositTabel);
    app.post('/tabWithdrawTabel', controller.tabWithdrawTabel);
    app.post('/tabStatementTabel', controller.tabStatementTabel); 
    app.post('/member', controller.member); 
    app.post('/findWallet', controller.findWallet);
    app.post('/upDatePassword', controller.upDatePassword);
    app.post('/upDateDataMember', controller.upDateDataMember)
}