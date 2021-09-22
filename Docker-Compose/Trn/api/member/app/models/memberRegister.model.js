const mongo = require('../../config/mongodb.js');
const ObjectID = require('mongodb').ObjectID;
const fu = require('../../../constants/functionUtil');
///////////////////////////////////////////
const modulename = 'member';
const paramename = 'member_status';
//////////////////////////////////////////
// MODEL CHECK EMAIL AND PASSWORD STAFF DUPLICATE 9/9/2020
module.exports.fxCheckMemberRegister = (payload, params) => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $or: [
                        { email: params.txtemail },
                        { tel: params.txttel },
                    ],
                    ou_id: ObjectID(payload.ou_id)
                }
            },
        ];
        await mongo.db.collection('member')
            .aggregate(query).toArray().then(async result => {
                const checkNull = fu.isNull(result);
                if (checkNull) {
                    resolve(false);
                } else {
                    let msg = '';
                    let telMsg = '';
                    let emailMsg = '';
                    for await (const i of result) {
                        if (params.txttel === i.tel) {
                            telMsg = 'Member Telephone duplicate';
                        }
                        if (params.txtemail === i.email) {
                            emailMsg = 'Member Email duplicate';
                        }
                        msg = telMsg + ' ' + emailMsg;
                        if (emailMsg && telMsg) {
                            break;
                        }
                    }
                    resolve(msg);
                }
            }).catch(error => {
                console.log('member.model -> fxCheckMemberRegister -> ' + error);
                reject(error)
            });
    });
}

module.exports.Getstatus = jsonData => {

    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $and: [
                        { ou_id: ObjectID(jsonData.ou_id) },
                        { prog_module: modulename },
                        { param_name: paramename },

                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    param_value: '$param_value',
                    param_desc: '$param_desc'
                }
            }
        ];
        await mongo.db.collection('su_parameter')
            .aggregate(query).toArray().then(result => {
                resolve(result);
            }).catch(error => {
                console.log('member.model -> status -> ' + error);
                reject(error)
            });
    });
}


module.exports.Getprefix = jsonData => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $and: [
                        { ou_id: ObjectID(jsonData.ou_id) },
                        { active: '1' }
                    ]
                }
            },
            {
                $project: {

                    param_value: '$_id',
                    param_desc: '$prefix_name'
                }
            }
        ];
        await mongo.db.collection('db_prefix')
            .aggregate(query).toArray().then(result => {
                resolve(result);
            }).catch(error => {
                console.log('member.model -> getPrefix -> ' + error);
                reject(error)
            });
    });
}

module.exports.mdgetdatamember = (jsonData) => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('member').aggregate([
            {
                $lookup: {
                    from: 'su_parameter',
                    let: { module: modulename, name: paramename, member_status: '$status' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$prog_module', '$$module'] },
                                        { $eq: ['$param_name', '$$name'] },
                                        { $eq: ['$param_value', '$$member_status'] }
                                    ],

                                },
                            },
                        },
                    ],
                    as: 'status_type',
                }
            },
            {
                $unwind: {
                    path: '$status_type',

                },
            },
            {
                $project: {
                    _id: '$_id',
                    ou_id: '$ou_id',
                    username: '$username',
                    prefix: '$prefix',
                    first_name: '$first_name',
                    last_name: '$last_name',
                    tel: '$tel',
                    email: '$email',
                    profile_pic: '$profile_pic',
                    password: '$password',
                    reg_date: '$reg_date',
                    status: '$status_type.param_desc',
                }
            }]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            );
    });
};


module.exports.mdmemberSeach = jsonData => {
    const and = [];

    if (jsonData.membername) {
        and.push({
            $or: [
                { first_name: { $regex: jsonData.membername, $options: 'i' } },
                { last_name: { $regex: jsonData.membername , $options: 'i'} }
            ]


        });

    }
    if (jsonData.username) {
        and.push({ username: { $regex: jsonData.username, $options: 'i' } });
    }
    if (jsonData.tel) {
        and.push({ tel: { $regex: jsonData.tel } });
    }
    if (jsonData.status) {
        and.push({ status: jsonData.status });
    }

    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('member').aggregate([
            {
                $match: {

                    $and: and,

                }
            }, {
                $lookup: {
                    from: 'su_parameter',
                    let: {
                        module: modulename,
                        name: paramename,
                        value: '$status'
                    },
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
                    ], as: 'parameter',

                }
            },
            {
                $unwind: {
                    path: '$parameter'
                }
            },
            {
                $project: {
                    _id: '$_id',
                    ou_id: '$ou_id',
                    username: '$username',
                    prefix: '$prefix',
                    first_name: '$first_name',
                    last_name: '$last_name',
                    tel: '$tel',
                    email: '$email',
                    profile_pic: '$profile_pic',
                    password: '$password',
                    reg_date: '$reg_date',
                    status: '$parameter.param_desc',
                }
            }]).toArray().then(
                result => resolve(result)

            ).catch(
                error => reject(error)
            );

    });



};
module.exports.find_member = function (query) {
    return new Promise(function (resolve) {
        var collection = mongo.db.collection('member');
        collection.aggregate(query).toArray(function (err, res) {
            if (!err) {
                if (res.length > 0) {
                    resolve({
                        status: true,
                        status_code: '200',
                        status_text: 'query completed, found.',
                        data: res
                    });
                } else {
                    resolve({
                        status: true,
                        status_code: '400',
                        status_text: 'query completed, not found.',
                        data: res
                    });
                }
            } else {
                resolve({
                    status: false,
                    status_code: '500',
                    status_text: 'query failed, db error.'
                });
            }
        });
    }).catch(function (error) {
        return error;
    });
}
module.exports.find_tel = function (query) {
    return new Promise(function (resolve) {
        var collection = mongo.db.collection('member');
        collection.aggregate(query).toArray(function (err, res) {
            if (!err) {
                if (res.length > 0) {
                    resolve({
                        status: true,
                        status_code: '200',
                        status_text: 'query completed, found.',
                        data: res
                    });
                } else {
                    resolve({
                        status: true,
                        status_code: '400',
                        status_text: 'query completed, not found.',
                        data: res
                    });
                }
            } else {
                resolve({
                    status: false,
                    status_code: '500',
                    status_text: 'query failed, db error.'
                });
            }
        });
    }).catch(function (error) {
        return error;
    });
}
module.exports.insertOne = (db, collection, data) => {
    return new Promise(function (resolve, reject) {
        mongo.db.collection(collection).insertOne(data, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                logError.historyLogError(`mongo.db('` + db + `').collection('` + collection + `').insertOne(${JSON.stringify(data)})`);
                reject(err);
            }
        });
    });
};


module.exports.mdmemberEdit = (db, collection, query, set, option) => {
    return new Promise(function (resolve, reject) {
        mongo.db.collection(collection).updateOne(query, set, option || {}, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                logError.historyLogError(`mongo.db('` + db + `').collection('` + collection + `').updateOne(${JSON.stringify(query)},${JSON.stringify(set)})`);
                reject(err);
            }
        });
    });

};