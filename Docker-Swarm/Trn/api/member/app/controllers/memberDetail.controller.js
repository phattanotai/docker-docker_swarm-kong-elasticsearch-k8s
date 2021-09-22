const model = require('../models/memberDetail.model');
const jwt = require('jsonwebtoken');
const fs = require('../../../constants/functionUtil');
const statusCode = require('../../../constants/httpStatusCodes');

module.exports.getDdlParameter = async (request, response) => {
    try {
        const payload = await fs.getUserData(request, jwt);
        let data = await model.renderDdlParameter(payload, request.body);
        response.send({
            statusCode: statusCode.Success.ok.codeText,
            statusText: statusCode.Success.ok.description,
            data: data
        });
    } catch (error) {
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.renderDdlPrefix = async (request, response) => {
    try {
        const payload = await fs.getUserData(request, jwt);
        let data = await model.renderDdlPrefix(payload, request.body);
        response.send({
            statusCode: statusCode.Success.ok.codeText,
            statusText: statusCode.Success.ok.description,
            data: data
        });
    } catch (error) {
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.tabDepositTabel = async (request, response) => {
    try {
        let data = await model.tabDepositTabel(request.body);
        response.send({
            statusCode: statusCode.Success.ok.codeText,
            statusText: statusCode.Success.ok.description,
            data: data
        });
    } catch (error) {
        console.log(error)
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.tabWithdrawTabel = async (request, response) => {
    try {
        let data = await model.tabWithdrawTabel(request.body);
        response.send({
            statusCode: statusCode.Success.ok.codeText,
            statusText: statusCode.Success.ok.description,
            data: data
        });
    } catch (error) {
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.tabStatementTabel = async (request, response) => {
    try {
        let data = await model.tabTransactionTabel(request.body);
        response.send({
            statusCode: statusCode.Success.ok.codeText,
            statusText: statusCode.Success.ok.description,
            data: data
        });
    } catch (error) {
        console.log(error)
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.member = async (request, response) => {
    try {
        let data = await model.member(request.body);
        if (fs.isNull(data)) {
            response.send({
                statusCode: statusCode.Success.noContent.codeText,
                statusText: statusCode.Success.noContent.description,
                data: data
            });

        } else {
            response.send({
                statusCode: statusCode.Success.ok.codeText,
                statusText: statusCode.Success.ok.description,
                data: data
            });
        }

    } catch (error) {
        console.log(error);
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.findWallet = async (request, response) => {
    try {
        const payload = await fs.getUserData(request, jwt);
        let result = await model.findWallet(payload, request.body)
        if (fs.isNull(result)) {
            response.send({
                statusCode: statusCode.Success.noContent.codeText,
                statusText: statusCode.Success.noContent.description,
                data: result
            });

        } else {
            response.send({
                statusCode: statusCode.Success.ok.codeText,
                statusText: statusCode.Success.ok.description,
                data: result
            });
        }

    } catch (error) {
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.upDatePassword = async (request, response) => {
    try {
        const payload = await fs.getUserData(request, jwt);
        let data = await model.upDatePassword(payload, request.body);
        data.modifiedCount
        if (data.modifiedCount == '1') {
            response.send({
                statusCode: statusCode.Success.ok.codeText,
                statusText: statusCode.Success.ok.description
            });
        } else {
            response.send({
                statusCode: statusCode.withdraw.updateDataFail
            });
        }
    } catch (error) {
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        });
    }
}

module.exports.upDateDataMember = async (request, response) => {
    try {
        const payload = await fs.getUserData(request, jwt);
        let checkTelephone = await model.checkTelephone(payload, request.body);
        if (checkTelephone && checkTelephone.length) {
            response.send({
                statusCode: statusCode.member.telrep.statusCode,
                statusText: statusCode.member.telrep.statusText
            });
        } else {
            let update = await model.upDateDataMember(payload, request.body);
            update.matchedCount
            if (update.matchedCount == '1') {
                response.send({
                    statusCode: statusCode.Success.ok.codeText,
                    statusText: statusCode.Success.ok.description
                });
            } else {
                response.send({
                    statusCode: statusCode.withdraw.updateDataFail
                })
            }
        }
    } catch (error) {
        console.log(error)
        response.send({
            statusCode: statusCode.Fail.err.codeText,
            statusText: statusCode.Fail.err.description
        })
    }
}




