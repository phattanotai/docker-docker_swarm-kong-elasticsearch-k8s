
const model = require('../models/bank.model');
const statusCode = require('../../../constants/httpStatusCodes');
const fu = require('../../../constants/functionUtil');
const jwt = require('jsonwebtoken');
const {returnMessage} = require('../../../constants/constantsVariable');
const {validationResult}  = require('express-validator');
const debug = fu.debug;
// CONTROLLER ADD BANK   8/9/2020 
module.exports.addBank = async (request, response) => {
    const body = validationResult(request);
    if(!body.isEmpty()){
        response.send({ 
            statusCode: statusCode.ClientErrors.badRequest.codeText, 
            statusText: statusCode.ClientErrors.badRequest.description, 
            message: body
        });
    }else{
        try {
            const userData = await fu.getUserData(request,jwt);
            if(!fu.isNull(userData)){
                const returnData = await model.checkBank(request.body,userData);
                if(!returnData){
                    const result = await model.addBank(request.body,userData);
                    if(result){
                        response.send({ 
                            statusCode: statusCode.Success.ok.codeText, 
                            statusText: statusCode.Success.ok.description, 
                            message: returnMessage.insertSuccess
                        });
                    }else{
                        response.send({ 
                            statusCode: statusCode.ClientErrors.badRequest.codeText, 
                            statusText: statusCode.ClientErrors.badRequest.description, 
                            message: returnMessage.insertFail
                        });
                    }
                }else{
                    response.send({ 
                        statusCode: statusCode.Success.ok.codeText, 
                        statusText: returnData, 
                    });
                }         
            }else{
                response.send({ 
                    statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                    statusText: statusCode.ClientErrors.unauthorized.description, 
                });
            }
        } catch (error) {
            debug('master-data bank.controller -> addBank -> '+ error);
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description, 
                message: error.toString()
            });
        }
    }
}
// CONTROLLER ADD BANK   8/9/2020 
module.exports.editBank = async (request, response) => {
    const body = validationResult(request);
    if(!body.isEmpty()){
        response.send({ 
            statusCode: statusCode.ClientErrors.badRequest.codeText, 
            statusText: statusCode.ClientErrors.badRequest.description, 
            message: body
        });
    }else{
        try {
            const userData = await fu.getUserData(request,jwt);
            if(!fu.isNull(userData)){
                const returnData = await model.checkEditBank(request.body,userData);
                if(!returnData){
                    const result = await model.editBank(request.body,userData);
                    if(result){
                        response.send({ 
                            statusCode: statusCode.Success.ok.codeText, 
                            statusText: statusCode.Success.ok.description, 
                            message: returnMessage.updateSuccess
                        });
                    }else{
                        response.send({ 
                            statusCode: statusCode.ClientErrors.badRequest.codeText, 
                            statusText: statusCode.ClientErrors.badRequest.description,  
                            message: returnMessage.updateFail
                        });
                    }
                }else{
                    response.send({ 
                        statusCode: statusCode.ClientErrors.badRequest.codeText, 
                        statusText: statusCode.ClientErrors.badRequest.description,  
                        message: returnData
                    });
                }         
            }else{
                response.send({ 
                    statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                    statusText: statusCode.ClientErrors.unauthorized.description, 
                });
            }
        } catch (error) {
            debug('master-data bank.controller -> addBank -> '+ error);
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description, 
                message: error.toString()
            });
        }
    }
}
// CONTROLLER SEARCH BANK   8/9/2020 
module.exports.searchBank = async (request, response) => {
    try {
        const userData = await fu.getUserData(request,jwt);
        if(!fu.isNull(userData)){
            const result = await model.searchBank(request.body,userData);
            if(!fu.isNull(result)){
                response.send({ 
                    statusCode: statusCode.Success.ok.codeText, 
                    statusText: statusCode.Success.ok.description, 
                    data: result
                });
            }else{
                response.send({ 
                    statusCode: statusCode.Success.noContent.codeText, 
                    statusText: statusCode.Success.noContent.description, 
                });
            }
           
        }else{
            response.send({ 
                statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                statusText: statusCode.ClientErrors.unauthorized.description, 
            });
        }
    } catch (error) {
        debug('master-data bank.controller -> searchBank -> '+ error);
        response.send({ 
            statusCode: statusCode.Fail.err.codeText, 
            statusText: statusCode.Fail.err.description, 
            message: error.toString()
        });
    }
}
// CONTROLLER GET BANK ACTIVE  8/9/2020 
module.exports.getBankActive = async (request, response) => {
    try {
        const userData = await fu.getUserData(request,jwt);
        if(!fu.isNull(userData)){
            const result = await model.getBankActive(request.body);
            if(!fu.isNull(result)){
                response.send({ 
                    statusCode: statusCode.Success.ok.codeText, 
                    statusText: statusCode.Success.ok.description, 
                    data: result
                });
            }else{
                response.send({ 
                    statusCode: statusCode.Success.noContent.codeText, 
                    statusText: statusCode.Success.noContent.description, 
                });
            }
        }else{
            response.send({ 
                statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                statusText: statusCode.ClientErrors.unauthorized.description, 
            });
        }
    } catch (error) {
        debug('master-data bank.controller -> searchBank -> '+ error);
        response.send({ 
            statusCode: statusCode.Fail.err.codeText, 
            statusText: statusCode.Fail.err.description, 
            message: error.toString()
        });
    }
}