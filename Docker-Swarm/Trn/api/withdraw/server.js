(async () => {
    try {
        await require('./config/mongodb')();
        await require('./config/express')(34000)
            .then(app => {
                require('./app/routes/withdraw.route')(app)
            });
    } catch (error) {
        throw error;
    }
})();
    // (async () => {
    //     try {
    //         await require('./config/mongodb')();
    //         await require('./config/express')(30000)
    //             .then(app => {
    //                 require('./app/routes/auth.route')(app)
    //             });
    //     } catch (error) {
    //         throw error;
    //     }
    // })();
