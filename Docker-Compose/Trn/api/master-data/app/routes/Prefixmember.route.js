module.exports = function (app) {
    let controller = require('../controllers/Prefixmember.controller');
    app.post('/addPrefix', controller.addPrefix);
    app.post('/editPrefixActive', controller.editPrefixActive);
    app.post('/editPrefixAll', controller.editPrefixAll);
    app.post('/seachPrefix', controller.seachPrefix);
    app.post('/getActivePrefix', controller.getActivePrefix);
    app.post('/getdatatablePrefix', controller.getdatatablePrefix);
}
