
const model = require('../models/Prefixmember.model');
const fx = require('../functions/Prefixmember.funtion');
const statusCode = require('../../../constants/httpStatusCodes');
const fs = require('../../../constants/functionUtil');
const jwt = require('jsonwebtoken');
const dbbase = require('../../../config/db-conn');
module.exports.addPrefix = async (req, res) => {
    try {
        const payload = await fs.getUserData(req, jwt);
        var query_unique_Prefix = await fx.query_unique_Prefix(req.body);
        var unique = await model.find_Prefix(query_unique_Prefix);
        if (unique.status == true && unique.status_code == '400') {
            let SetDataPrefix = await fx.fxaddPrefix(payload, req.body);
            let result = await model.insertOne(dbbase.db, "db_prefix", SetDataPrefix.data);     
        if (result.insertedCount == 1) {           
            res.send({
                statusCode: statusCode.Success.ok.codeText,
                statusText: statusCode.Success.ok.description,
                data: result
            });       
        } else {
            res.send({
                statusCode: statusCode.Success.noContent.codeText,
                statusText: statusCode.Success.noContent.description,
            });

        }
          

        } else {
            res.send({
                statusCode: statusCode.Fail.err.code,
                statusText: statusCode.Fail.err.description,
                statusDsec: 'Prefix is already exists.',
                data: unique
            });
        }



    } catch (error) {
        console.log(error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}


module.exports.editPrefixActive = async (req, res) => {
    try {
            const payload = await fs.getUserData(req, jwt);
            let UpdateDataMember = await fx.fxPrefixUpdate(payload, req.body);
            if (UpdateDataMember) {
                res.send({
                    statusCode: statusCode.Success.ok.codeText,
                    statusText: statusCode.Success.ok.description,
                    data: UpdateDataMember
                });
            } else {
                res.send({
                    statusCode: statusCode.Success.noContent.codeText,
                    statusText: statusCode.Success.noContent.description,
                });
            }
    } catch (error) {
        console.error(error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}
module.exports.editPrefixAll = async (req, res) => {
    try {
        const payload = await fs.getUserData(req, jwt);
        var query_unique_Prefix = await fx.query_unique_Prefix(req.body);
        var unique = await model.find_Prefix(query_unique_Prefix);
        if (unique.status == true && unique.status_code == '400') {
            let UpdateDataMember = await fx.fxPrefixUpdate(payload, req.body);
            if (UpdateDataMember) {
                res.send({
                    statusCode: statusCode.Success.ok.codeText,
                    statusText: statusCode.Success.ok.description,
                    data: UpdateDataMember
                });
            } else {
                res.send({
                    statusCode: statusCode.Success.noContent.codeText,
                    statusText: statusCode.Success.noContent.description,
                });
            }


        } else {
            res.send({
                statusCode: statusCode.Fail.err.code,
                statusText: statusCode.Fail.err.codeText,
                statusDsec: 'Prefix is already exists.',
                data: unique
            });
        }

    } catch (error) {
        console.error(error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}
module.exports.seachPrefix = async (req, res) => {
    try {
        const payload = await fs.getUserData(req, jwt);
        let serchPrefix = await model.seachPrefix(req.body);
        res.send({
            statusCode: statusCode.Success.ok.codeText,
            statusText: statusCode.Success.ok.description,
            data: serchPrefix
        });
    } catch (error) {
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}

module.exports.getActivePrefix = async (req, res) => {
    try {
        const userData = await fs.getUserData(req, jwt);
        if (!fs.isNull(userData)) {
            const result = await model.GetActiveprefix(userData);
            if (!fs.isNull(result)) {
                res.send({
                    statusCode: statusCode.Success.ok.codeText,
                    statusText: statusCode.Success.ok.description,
                    data: result
                });
            } else {
                res.send({
                    statusCode: statusCode.Success.noContent.codeText,
                    statusText: statusCode.Success.noContent.description,
                    data: result
                });
            }
        } else {
            res.send({
                statusCode: statusCode.ClientErrors.unauthorized.codeText,
                statusText: statusCode.ClientErrors.unauthorized.description,
            });
        }
    } catch (error) {
        console.log('member.controller -> getPrefix -> ' + error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}

module.exports.getdatatablePrefix = async (req, res) => {
    try {
        const userData = await fs.getUserData(req, jwt);
        if (!fs.isNull(userData)) {
            const result = await model.Getdataprefix(userData);
            if (!fs.isNull(result)) {
                res.send({
                    statusCode: statusCode.Success.ok.codeText,
                    statusText: statusCode.Success.ok.description,
                    data: result
                });
            } else {
                res.send({
                    statusCode: statusCode.Success.noContent.codeText,
                    statusText: statusCode.Success.noContent.description,
                    data: result
                });
            }
        } else {
            res.send({
                statusCode: statusCode.ClientErrors.unauthorized.codeText,
                statusText: statusCode.ClientErrors.unauthorized.description,
            });
        }
    } catch (error) {
        console.log('member.controller -> getPrefix -> ' + error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}

