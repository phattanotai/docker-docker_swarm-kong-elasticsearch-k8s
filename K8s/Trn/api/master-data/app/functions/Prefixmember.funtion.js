

const ObjectID = require('mongodb').ObjectID;
const md = require('../models/Prefixmember.model');
const dbbase = require('../../../config/db-conn');
const statusCode = require('../../../constants/httpStatusCodes');


module.exports.query_unique_Prefix = function (params) {
    return new Promise(function (resolve) {
        var query = {};
        query.$and = [];
        query.$and.push({
            prefix_name:  params.prefixName  
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


module.exports.fxaddPrefix = async (payload, params) => {
    try {
        const prepareData = await prepareDataInsertPrefix(payload, params);
        return {data: prepareData };      
    } catch (error) {
        //error.code Insert Data duplicate key error
        if (error.code === 11000) {
            return {status: false, statusCode: 500}
        } else {
            return { status: false, statusCode: 500 };
        }
    }
}

const prepareDataInsertPrefix = async (payload, params) => {
    return {
        ou_id: ObjectID(payload.ou_id),
        prefix_name: params.prefixName,
        prefix_desc: params.prefix_des,
        active: params.prefis_active,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "PrefixMember",

    };
}




module.exports.fxPrefixUpdate = async (payload, params) => {
    try {
        const prepareData = await prepareDataUpdatePrefix(payload, params);
        let result = await md.mdprefixEdit(dbbase.db, "db_prefix", prepareData.query, prepareData.set);
        if (result.insertedCount == 1) {
            return { status: true, statusCode: statusCode.Success.ok.codeText, data: prepareData };

        } else {
            return { status: true, statusCode: statusCode.Success.noContent.codeText };
        }
    } catch (error) {
        console.log('Update ERROR :', error);
        //error.code Insert Data duplicate key error
        if (error.code === 11000) {
            return { status: false, statusCode: statusCode.ClientErrors.unauthorized.codeText, statusText: statusCode.ClientErrors.unauthorized.description }
        } else {
            return { status: false, statusCode: statusCode.Fail.err.codeText, statusText: statusCode.Fail.err.description };
        }
    }
}

const prepareDataUpdatePrefix = async (payload, params) => {
    return {
        query: {
            _id: ObjectID(params.idprefix),
        },
        set: {
            $set: {
                username: params.edtxtemail,
                prefix_name: params.prefixName,
                prefix_desc: params.prefix_des,
                active: params.prefix_active,
                upd_by: payload.username,
                upd_date: new Date(),
                upd_prog: "PrefixMember"
            }
        }
    }
};
