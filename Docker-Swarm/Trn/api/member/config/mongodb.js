const mongodbConfig = require('../../config/db-conn');
module.exports = () => {
    return new Promise((resolve, reject) => {
        require('mongodb')
            .MongoClient
            .connect(mongodbConfig.conn, { useNewUrlParser: true, useUnifiedTopology: true }, (err, dbs) => {
                !err ? resolve(module.exports.db = dbs.db(mongodbConfig.db)) : reject(err);
            });
    });
}