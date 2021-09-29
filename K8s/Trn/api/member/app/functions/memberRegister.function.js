const ObjectID = require('mongodb').ObjectID;
const model = require('../models/memberRegister.model');
const dbbase = require('../../../config/db-conn');

module.exports.fxgetdataMember = jsonData => {
    return new Promise((resolve, reject) => {
        try {
            if (jsonData) {
                let macthData = {};
                if (check_null(jsonData.ou_id) || check_null(jsonData.prog_module) || check_null(jsonData.param_name)) {
                    macthData.$and = [];
                }
                if (jsonData.ou_id) {
                    macthData.$and.push({
                        ou_id: ObjectID(jsonData.ou_id)
                    });
                }
                if (jsonData.prog_module) {
                    macthData.$and.push({
                        prog_module: jsonData.prog_module
                    });
                }
                if (jsonData.param_name) {
                    macthData.$and.push({
                        param_name: jsonData.param_name
                    });
                };
                resolve(macthData);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.query_unique_username = function (params) {
    return new Promise(function (resolve) {
        var query = {};
        query.$and = [];
        query.$and.push({
            username: { $regex: '^' + params.txtemail + '$', $options: 'i' }
        });      
        resolve([{
            $match: query
        },
        {
            $project: {
                _id: '$_id'
            }
        }
        ]);
    }).catch(function (error) {
        return error;
    });
}
module.exports.query_unique_tel = function (params) {
    return new Promise(function (resolve) {
        var query = {};
        query.$and = [];
        query.$and.push({
            tel: { $regex: '^' + params.txttel + '$', $options: 'i' }
        });      
        resolve([{
            $match: query
        },
        {
            $project: {
                _id: '$_id'
            }
        }
        ]);
    }).catch(function (error) {
        return error;
    });
}
module.exports.fxmemberRegister = async (payload,params) => {
    try {
        const prepareData = await prepareDataInsertMember(payload,params);
        let result = await model.insertOne(dbbase.db, 'member', prepareData);
        if (result.insertedCount == 1) {         
            return { status: true, statusCode: 200,data:result.insertedId };
        } else {
            return { status: true, statusCode: 500 };
        }
    } catch (error) {
        console.log('REGISTER ERROR :', error);
        //error.code Insert Data duplicate key error
        if(error.code === 11000){
            return { status: false, statusCode: 500 }
        }else{
            return { status: false, statusCode: 500};
        }
    }
}


module.exports.fxmemberWallet = async (payload,params,id) => {
    try {
       
        const prepareData = await prepareDataInsertWallet(payload,id.data);
        let result = await model.insertOne(dbbase.db, 'wallet_main', prepareData);
      
        if (result.insertedCount == 1) {         
            return { status: true, statusCode: 200,data: prepareData };
        } else {
            return { status: true, statusCode: 500 };
        }
    } catch (error) {
        console.log('Wallet ERROR :', error);
        
        if(error.code === 11000){
            return { status: false, statusCode: 500 }
        }else{
            return { status: false, statusCode: 500};
        }
    }
}
const prepareDataInsertWallet = async (payload,id) => {
    return {
        ou_id:ObjectID(payload.ou_id),     
        uid: id,
        cbal: 0,
        reg_date: new Date(),
        status: '0',
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: 'MEMBER',
        upd_by: null,
        upd_date: new Date(),
        upd_prog: 'MEMBER',
    };
}



const prepareDataInsertMember = async (payload,params) => {
    return {
        ou_id: ObjectID(payload.ou_id),     
        username: (params.txtemail).toLowerCase(),
        password: (params.txtpassword).toLowerCase(),
        prefix: ObjectID(params.prefix),
        first_name: params.txtfristname,
        last_name: params.txtlastname,
        email: (params.txtemail).toLowerCase(),
        tel: params.txttel,
        reg_date: new Date(),
        status: '0',
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: 'MEMBER',
        upd_by: null,
        upd_date: new Date(),
        upd_prog: null
    };
}



// module.exports.fxmemberUpdate = async (payload,params) => {
//     try {
//         const prepareData = await prepareDataUpdateMember(payload,params);
//         let result = await model.mdmemberEdit(dbbase.db, 'member', prepareData.query, prepareData.set);
//         if (result.insertedCount == 1) {
//             return { status: true, statusCode: 200,data: prepareData };
//         } else {
//             return { status: true, statusCode: 500 };
//         }
//     } catch (error) {
//         console.log('Update ERROR :', error);
//         //error.code Insert Data duplicate key error
//         if(error.code === 11000){
//             return { status: false, statusCode: 500 }
//         }else{
//             return { status: false, statusCode: 500};
//         }
//     }
// }

// const prepareDataUpdateMember = async (payload, params) => {
//     return {
//         query: {
//             _id: ObjectID(params.edmemberid),
//         },
//         set: {
//             $set: {
//                 username: params.edtxtemail,
//                 prefix: params.edprefix,
//                 first_name: params.edtxtfristname,
//                 last_name: params.edtxtlastname,
//                 email: params.edtxtemail,
//                 tel: params.edtxttel,
//                 upd_by: payload.username,
//                 upd_date: new Date(),
//                 upd_prog: 'MEMBER'
//             }
//             }
//         }
//     };
