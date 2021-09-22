const mongo = require('../../config/mongodb.js');
const ObjectID = require('mongodb').ObjectID;
const fu = require('../../../constants/functionUtil');

const withdraw = 'withdraw';
const withdraw_status ='withdraw_status';

module.exports.renderDdlParameter = (payload, params) => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('su_parameter')
            .aggregate([
                {
                    $match: {
                        $and: [
                            { ou_id: ObjectID(payload.ou_id) },
                            { prog_module: params.prog_module },
                            { param_name: params.param_name }
                        ]
                    }
                },
                {
                    $project: {
                        ou_id: '$ou_id',
                        prog_module: '$prog_module',
                        param_name: '$param_name',
                        param_seq: '$param_seq',
                        param_desc: '$param_desc',
                        param_value: '$param_value',
                        active: '$param_value',
                        cr_by: '$cr_by',
                        cr_date: '$cr_date',
                        cr_prog: '$cr_date',
                        upd_by: '$upd_by',
                        upd_date: '$upd_date',
                        upd_prog: '$upd_prog'
                    }
                }
            ]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            );
    });
};

module.exports.renderDdlPrefix = (payload, params) => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('db_prefix')
            .aggregate([
                {
                    $match: {
                        $and: [
                            {ou_id: ObjectID(payload.ou_id)},
                            {active:params.active}
                        ]
                    }
                }
            ]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            );
    });
};


//  TABEL DEPOSIT =========================================
const deposit = 'deposit';
const deposit_status = 'deposit_status';
module.exports.tabDepositTabel = params => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('tn_deposit').aggregate([
            {
                $match: {
                    $and: [
                        {doc_date: { $gte:new Date(params.dateFrom) , $lte:new Date(params.dateTo) }},
                        {uid: ObjectID(params.uid)}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'su_parameter',
                    let: { module: deposit, name: deposit_status, value: '$status' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$prog_module', '$$module'] },
                                        { $eq: ['$param_name', '$$name'] },
                                        { $eq: ['$param_value', '$$value'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'parameter'
                }
            },
            {
                $unwind: {
                    path: '$parameter',
                }
            },
            {
                $lookup: {
                    from: 'db_document_type',
                    localField: 'doc_type',
                    foreignField: '_id',
                    as: 'type'
                }
            },
            {
                $unwind: {
                    path: '$type',
                }
            },
            {
                $project: {
                    username: '$username',
                    date: '$doc_date',
                    type: '$type.doc_abb',
                    amount: '$amount',
                    status: '$parameter.param_desc'
                }
            }]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            );
    });
};
//  TABEL WITHDRAW =========================================
module.exports.tabWithdrawTabel = params => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('tn_withdraw').aggregate([
            {
                $match: {
                    $and: [
                        {doc_date: { $gte:new Date(params.dateFrom) , $lte:new Date(params.dateTo) }},
                        {uid: ObjectID(params.uid)}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'su_parameter',
                    let: { module: withdraw, name: withdraw_status, value: '$status' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$prog_module', '$$module'] },
                                        { $eq: ['$param_name', '$$name'] },
                                        { $eq: ['$param_value', '$$value'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'parameter'
                }
           },
            {
                $unwind:{
                    path:'$parameter',

                }
            },
             {
                 $lookup: {
                    from: 'db_document_type',
                    localField: 'doc_type',
                    foreignField: '_id',
                    as: 'type'
                }
            },
            {
                $unwind:{
                    path:'$type',

                }
            },
            {
                $project:{
                    username:'$username',
                    date:'$doc_date',
                    type:'$type.doc_abb',
                    amount:'$amount',
                    status:'$parameter.param_desc'
                }
            }
        ]).toArray().then(
            result => resolve(result)
            ).catch(
            error => reject(error)
            );
    });
};
//  TABEL STATEMENT =========================================
module.exports.tabTransactionTabel = params => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $and: [
                        {date: { $gte:new Date(params.dateFrom) , $lte:new Date(params.dateTo) }},
                        {uid: ObjectID(params.uid)}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'db_document_type',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'typeTran'
                }
            },
            {
                $unwind: {
                    path: '$typeTran',
        
                }
            },
            {
                        $project: {
                            date: '$date',
                            type: '$typeTran.doc_abb',
                            balanceForward: '$cbf',
                            amount: '$camt',
                            balance: '$cbal'
                        }
                    }
        ];
        await mongo.db.collection('wallet_transaction').aggregate(query).toArray().then(
            result => resolve(result)
            ).catch(
            error => reject(error)
            );
    });
};

//  SHOW MEMBER =========================================
module.exports.member = (params) => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('member').aggregate([
            {
                $match:{
                    _id: ObjectID(params.memberId)
                }
        },
        {
            $lookup:
                {
                    from: 'wallet_main',
                    localField: '_id',
                    foreignField: 'uid',
                    as: 'bal'
                }
        },
        {
            $unwind: {
                path: '$bal',    
            }
        },
        {
            $lookup:
            {
                from: 'db_prefix',
                localField: 'prefix',
                foreignField: '_id',
                as: 'pre'
            }
        },
        {
            $unwind: {
                path: '$pre',      
            }
        },
        {
            $project: {
                ou_id: '$ou_id',
                username: '$username',
                prefixname: '$pre.prefix_name',
                prefix_id:'$pre._id',
                prefixactive: '$pre.active',
                first_name: '$first_name',
                last_name: '$last_name',
                cbal: '$bal.cbal',
                tel: '$tel',
                email: '$email',
                profile_pic: '$profile_pic',
                password: '$password',
                reg_date: '$reg_date',
                status: '$status',
                cr_by: '$cr_by',
                cr_date: '$cr_date',
                cr_prog: '$cr_prog',
                upd_by: '$upd_by',
                upd_date: '$upd_date',
                upd_prog: '$upd_prog',
            }
        }]).toArray().then(
            result => resolve(result)
        ).catch(
            error => reject(error)
        );
    });
};
//  SHOW BALANCE =========================================
module.exports.findWallet = (payload, params) => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('wallet_main')
            .aggregate([
                {
                    $match: {
                        uid: ObjectID(params.uid)
                    }
                }, {
                    $project: {
            
                        balance: '$cbal'
                    }
                }
            ]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            )
    });
}
//  UPDATE PASSWORD =========================================
module.exports.upDatePassword = (payload, params) => {
    return new Promise(async(resolve, reject) => {
        await mongo.db.collection('member')
            .updateOne({
                _id: ObjectID(params.id)
            },{
                $set:{
                    password:params.pass,
                    upd_by:payload.username,
                    upd_date:new Date(),
                    upd_prog:'member'
                }
            }).then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            )
    })
}
//  UPDATE DATA MEMBER =========================================
module.exports.upDateDataMember = (payload, params) => {
    return new Promise(async(resolve, reject) => {
        await mongo.db.collection('member')
            .updateOne({
                _id: ObjectID(params.id)
            },{
                $set:{
                    prefix:ObjectID(params.prefix),
                    first_name:params.firstname,
                    last_name:params.lastname,
                    email:params.email,
                    tel:params.tel,
                    status:params.memberStatus,
                    upd_by:payload.username,
                    upd_date:new Date(),
                    upd_prog:'member'
                }
            }).then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            )
    })
}

module.exports.checkTelephone = (payload, params) => {
    return new Promise(async(resolve, reject) => {
        await mongo.db.collection('member').aggregate([
            {
                $match: {   
                    $and: [               
                      {tel: params.tel} ,
                      {ou_id: ObjectID(payload.ou_id)},
                      {_id: {$ne: ObjectID(params.id)}}
                    ]        
                 }
        }]).toArray().then(
            result => resolve(result)
        ).catch(
            error => reject(error)
        );
    });
};
