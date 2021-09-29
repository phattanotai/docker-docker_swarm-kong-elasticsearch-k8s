const { member } = require('../constants/port');
(async () => {
    try {
        await require('./config/mongodb')();
        await require('./config/express')(32000)
            .then(app => {
                 require('./app/routes/memberDetail.route')(app),
                require('./app/routes/memberSeach.route')(app)
            });
    } catch (error) {
        throw error;
    }
})();
