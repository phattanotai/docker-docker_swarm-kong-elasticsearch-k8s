const { staff } = require('../constants/port');
(async () => {
    try {
        await require('./config/mongodb')();
        await require('./config/express')(staff)
            .then(app => {
                require('./app/routes/staff.route')(app)
            });
    } catch (error) {
        throw error;
    }
})();

