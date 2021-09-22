const model = require('../models/staff.model');
const fu = require('../../../constants/functionUtil');
const statusCode = require('../../../constants/httpStatusCodes');
const jwt = require('jsonwebtoken');
const {returnMessage} = require('../../../constants/constantsVariable');
const debug = fu.debug;
const {validationResult}  = require('express-validator');
// CONTROLLER GETPREFIX STAFF  7/9/2020
module.exports.getPrefix = async (request, response) => {
    try {
        const userData = await fu.getUserData(request,jwt);
        if(!fu.isNull(userData)){
            const result = await model.getPrefix(userData);
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
        debug('staff.controller -> getPrefix -> '+ error);
        response.send({ 
            statusCode: statusCode.Fail.err.codeText, 
            statusText: statusCode.Fail.err.description, 
            message: error.toString()
        });
    }
}
// CONTROLLER GETSTATUS STAFF  7/9/2020
module.exports.getStatus = async (request, response) => {
    try {
        const userData = await fu.getUserData(request,jwt);
        if(!fu.isNull(userData)){
            const result = await model.getStatus(userData);
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
        debug('staff.controller -> getStatus -> '+ error);
        response.send({ 
            statusCode: statusCode.Fail.err.codeText, 
            statusText: statusCode.Fail.err.description, 
            message: error.toString()
        });
    }
}
// CONTROLLER SEARCHSTAFF   4/9/2020
module.exports.searchStaff = async (request, response) => {
    try {
        const userData = await fu.getUserData(request,jwt);
        if(!fu.isNull(userData)){
            const result = await model.searchStaff(request.body,userData);
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
        debug('staff.controller -> searchStaff -> '+ error);
        response.send({ 
            statusCode: statusCode.Fail.err.codeText, 
            statusText: statusCode.Fail.err.description, 
            message: error.toString()
        });
    }
}
// CONTROLLER ADDSTAFF   4/9/2020
module.exports.addStaff = async (request, response) => {
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
                const returnData = await model.checkEmailAndTel(request.body,userData);
                if(!returnData){
                    const result = await model.addStaff(request.body,userData);
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
            debug('staff.controller -> addStaff -> '+ error);
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description, 
                message: error.toString()
            });
        }
    }
}
// CONTROLLER EDITSTAFF   7/9/2020
module.exports.editStaff = async (request, response) => {
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
                const returnData = await model.checkTel(request.body,userData);
                if(!returnData){
                    const result = await model.editStaff(request.body,userData);
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
            debug('staff.controller -> editStaff -> '+ error);
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description, 
                message: error.toString()
            });
        }
    }
}
// CONTROLLER RESET PASSWORD STAFF   7/9/2020
module.exports.resetPassword = async (request, response) => {
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
                const result = await model.resetPassword(request.body,userData);
                if(result){
                    response.send({ 
                        statusCode: statusCode.Success.ok.codeText, 
                        statusText: statusCode.Success.ok.description, 
                        message: returnMessage.resetPassSuccess
                    });
                }else{
                    response.send({ 
                        statusCode: statusCode.ClientErrors.badRequest.codeText, 
                        statusText: statusCode.ClientErrors.badRequest.description, 
                        message: returnMessage.resetPassFail
                    });
                }
            }else{
                response.send({ 
                    statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                    statusText: statusCode.ClientErrors.unauthorized.description, 
                });
            }
        } catch (error) {
            debug('staff.controller -> resetPassword -> '+ error);
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description, 
                message: error.toString()
            });
        }
    }
}