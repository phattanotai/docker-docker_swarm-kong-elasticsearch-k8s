const { deposit } = require('../constants/port');
(async () => {
    try {
        await require('./config/mongodb')();
        await require('./config/express')(deposit)
            .then(app => {
                require('./app/routes/deposit.route')(app)
            });
    } catch (error) {
        throw error;
    }
})();
