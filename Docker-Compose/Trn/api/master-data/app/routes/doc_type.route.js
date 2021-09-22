const controller = require('../controllers/doc_type.controller');

module.exports = app => {
    app.post('/renderDdlDocType', controller.renderDdlDocType);
    app.post('/addDocType', controller.addDocType);
    app.post('/searchDocType', controller.searchDocType);
    app.post('/updateDocType', controller.updateDocType);
}