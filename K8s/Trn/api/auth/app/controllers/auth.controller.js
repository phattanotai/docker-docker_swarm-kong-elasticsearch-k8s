const fx = require('../functions/auth.function');
const model = require('../models/auth.model');
const statusCode = require('../../../constants/httpStatusCodes');
const {staffStatus} = require('../../../constants/constantsVariable');
const {debug} = require('../../../constants/functionUtil');
const {validationResult}  = require('express-validator');

// CONTROLLER LOGIN STAFF  1/9/2020  
module.exports.login = async (request, response) => {
    const body = validationResult(request);
    if(!body.isEmpty()){
        response.send({ 
            statusCode: statusCode.ClientErrors.badRequest.codeText, 
            statusText: statusCode.ClientErrors.badRequest.description, 
            message: body
        });
    }else{
        try {
            const data = (await model.login(request.body))[0];
            if(!data){
                response.send({ 
                    statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                    statusText: statusCode.ClientErrors.unauthorized.description, 
                });
            }else{
                if(data.status === staffStatus.normal){
                    const result = await fx.login(data);
                    await model.updateLogin(data);
                    fx.pusherLogin(data,result.token);
                    response.send({ 
                        statusCode: statusCode.Success.ok.codeText, 
                        statusText: statusCode.Success.ok.description, 
                        data: result
                    });
                }else{
                    let message;
                    if(data.status === staffStatus.lock){
                        message = 'Account locked';
                    }else{
                        message = 'Account expired';
                    }
                    response.send({ 
                        statusCode: statusCode.Success.ok.codeText, 
                        statusText: statusCode.Success.ok.description, 
                        message: message
                    });
                }
            }
        } catch (error) {
            debug('auth.controller -> login -> '+ error);
            console.log(error)
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description , 
                message: error.toString()
            });
        }
    }
}
// CONTROLLER UNLOCK STAFF  15/9/2020
module.exports.unlock = async (request, response) => {
    const body = validationResult(request);
    if(!body.isEmpty()){
        response.send({ 
            statusCode: statusCode.ClientErrors.badRequest.codeText, 
            statusText: statusCode.ClientErrors.badRequest.description,  
            message: body
        });
    }else{
        try {
            const data = (await model.login(request.body))[0];
            if(!data){
                response.send({ 
                    statusCode: statusCode.ClientErrors.unauthorized.codeText, 
                    statusText: statusCode.ClientErrors.unauthorized.description, 
                });
            }else{
                if(data.status === staffStatus.normal){
                    response.send({ 
                        statusCode: statusCode.Success.ok.codeText, 
                        statusText: statusCode.Success.ok.description, 
                        data: data
                    });
                }else{
                    let message;
                    if(data.status === staffStatus.lock){
                        message = 'Account locked';
                    }else{
                        message = 'Account expired';
                    }
                    response.send({ 
                        statusCode: statusCode.Success.ok.codeText, 
                        statusText: statusCode.Success.ok.description, 
                        message: message
                    });
                }
            }
        } catch (error) {
            debug('auth.controller -> unlock -> '+ error);
            response.send({ 
                statusCode: statusCode.Fail.err.codeText, 
                statusText: statusCode.Fail.err.description , 
                message: error
            });
        }
    }
}

// CONTROLLER CHECK STAFF LOGIN  1/9/2020
module.exports.checkLogin = async (request, response) => {
    try {
        const result = await fx.checkLogin(request);
        if(result.status === staffStatus.normal){
            response.send({ 
                statusCode: statusCode.Success.ok.codeText, 
                statusText: statusCode.Success.ok.description, 
                data: result
            });
        }else{
            response.send({ 
                statusCode: statusCode.ClientErrors.forbidden.codeText, 
                statusText: statusCode.ClientErrors.forbidden.description, 
                message: 'Username locked'
            });
        }
    } catch (error) {
        debug('auth.controller -> checkLogin -> '+ error);
        response.send({ 
            statusCode: statusCode.ClientErrors.unauthorized.codeText, 
            statusText: statusCode.ClientErrors.unauthorized.description, 
            message: error ? error.toString(): ''
        });
    }
}

// CONTROLLER CHECK STAFF LOGIN  1/9/2020
module.exports.hello = async (request, response) => {
    try {
            response.send({ 
                statusCode: statusCode.Success.ok.codeText, 
                statusText: statusCode.Success.ok.description, 
                message: 'hello world'
            });
        
    } catch (error) {
        debug('auth.controller -> checkLogin -> '+ error);
        response.send({ 
            statusCode: statusCode.ClientErrors.unauthorized.codeText, 
            statusText: statusCode.ClientErrors.unauthorized.description, 
            message: error ? error.toString(): ''
        });
    }
}