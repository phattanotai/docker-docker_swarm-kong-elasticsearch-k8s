const {debug} = require('../../constants/functionUtil');
const { onError,checkHeader } = require('../../constants/functionUtil');
module.exports = (port = null) => {
    return new Promise((resolve, reject) => {
        try {
            const app = require('express')();
            const bodyParser = require('body-parser');
            app.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'GET,POST,PUT');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                app.locals.pretty = true;
                return next();
            });
            app.use(bodyParser.json({ limit: '100mb' }));
            app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
            app.use(checkHeader);
            if (port) app.listen(port).on("error", onError);
            if (port) debug(`staff server is running at ${port}`);
            resolve(app);
        } catch (e) {
            reject(e);
        }
    });
}