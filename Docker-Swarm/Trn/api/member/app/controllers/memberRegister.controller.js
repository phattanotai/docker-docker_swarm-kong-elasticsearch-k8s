const fx = require('../functions/memberRegister.function');
const md = require('../models/memberRegister.model');
const jwt = require('jsonwebtoken');
const fs = require('../../../constants/functionUtil');
const statusCode = require('../../../constants/httpStatusCodes');

module.exports.GetStatus = async (req, res) => {
    try {
        const userData = await fs.getUserData(req, jwt);
        if (!fs.isNull(userData)) {
            const result = await md.Getstatus(userData);
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
module.exports.Getprefix = async (req, res) => {
    try {
        const userData = await fs.getUserData(req, jwt);
        if (!fs.isNull(userData)) {
            const result = await md.Getprefix(userData);
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
module.exports.Getdatamember = async (req, res) => {
    try {
        let result = await md.mdgetdatamember(req.body);
        if (result) {
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
    } catch (error) {
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}
module.exports.memberSeach = async (req, res) => {
    try {
        const userData = await fs.getUserData(req, jwt);
        if (!fs.isNull(userData)) {
            const result = await md.mdmemberSeach(req.body);
      
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
                data: result
            });
        }
    } catch (error) {
        console.error('member.searchMember-> seach -> ' + error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });
    }
}
module.exports.memberRegister = async (req, res) => {
    try {
        const payload = await fs.getUserData(req, jwt);  
        var query_unique_username = await fx.query_unique_username(req.body);  
        var query_unique_tel = await fx.query_unique_tel(req.body);    
        var unique = await md.find_member(query_unique_username);
        
        if (unique.status == true && unique.status_code == '400') { 
            var uniquetel = await md.find_tel(query_unique_tel);          
            if (uniquetel.status == true && uniquetel.status_code == '400') {
                let insertDataMember = await fx.fxmemberRegister(payload, req.body);
            if(insertDataMember){       
                let insertDataWallet = await fx.fxmemberWallet(payload, req.body,insertDataMember);
                res.send({ 
                    statusCode: statusCode.memberSeach.membersucess.statusCode, 
                    statusText: statusCode.memberSeach.membersucess.statusText, 
                    data: insertDataMember
                });

            }else{
                res.send({ 
                    statusCode: statusCode.Success.noContent.codeText, 
                    statusText: statusCode.Success.noContent.description, 
                });
            }
        } else {       
            res.send({
                statusCode: statusCode.memberSeach.telready.statusCode, 
                statusText: statusCode.memberSeach.telready.statusText,
                data: uniquetel
            });
        }
        } else {       
            res.send({
                statusCode: statusCode.memberSeach.emailready.statusCode, 
                statusText: statusCode.memberSeach.emailready.statusText,
                data: unique
            });
        }


    } catch (error) {
        console.error("memberRegister : "+error);
        res.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description,
            data: error
        });

    }
}

