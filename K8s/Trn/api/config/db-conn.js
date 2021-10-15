// module.exports.conn = 'mongodb://uat:0QwKrkPWBBZGCtbe@gpp-uat-shard-00-00-daxdy.gcp.mongodb.net:27017,gpp-uat-shard-00-01-daxdy.gcp.mongodb.net:27017,gpp-uat-shard-00-02-daxdy.gcp.mongodb.net:27017/admin?3t.certificatePreference=RootCACert%3Aaccept_any&3t.connectTimeout=10000&3t.connection.name=GPP-UAT-shard-0&3t.connectionMode=multi&3t.databases=admin&3t.proxyType=default&3t.sharded=true&3t.socketTimeout=0&3t.uriVersion=3&3t.useClientCertPassword=false&ssl=true&replicaSet=GPP-UAT-shard-0';
// module.exports.db = 'examples';

// mongodb://admin@localhost:27017/?authSource=trn

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const db = process.env.DB_DATABASE || 'trn';
const username = process.env.DB_USERNAME || 'admin';
const password = process.env.DB_PASSWORD || '1234';
const conn = `mongodb://${username}:${password}@${host}:${port}/?authSource=${db}`;
console.log('Connect to database :',conn)
module.exports.conn = conn;
module.exports.db = db;