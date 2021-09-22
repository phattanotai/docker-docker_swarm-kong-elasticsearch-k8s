const app = require('./config/express')();
const {debug,onError} = require('../constants/functionUtil');
const { masterData } = require('../constants/port');
(async () => {
    try {
        await require('./config/mongodb')();
        app.listen(masterData).on('error',onError);
        module.exports = app;
        debug('master data server is running at ' + masterData);
    } catch (error) {
        throw error;
    }
})();


