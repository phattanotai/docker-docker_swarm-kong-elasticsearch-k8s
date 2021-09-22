const { auth } = require('../constants/port');
(async () => {
    try {
        await require('./config/mongodb')();
        await require('./config/express')(auth)
            .then(app => {
                require('./app/routes/auth.route')(app);
            });
    } catch (error) {
        throw error;
    }
})();

