const mongo = require('../../config/mongodb.js');
const ObjectID = require('mongodb').ObjectID;
const fu = require('../../../constants/functionUtil');
const {collections} = require('../../../constants/constantsVariable');
const debug = fu.debug;

// MODEL CHECK DATABASE STAFF WHERE USERNAME AND PASSWORD   1/9/2020
module.exports.login = jsonData => {
    return new Promise(async (resolve, reject) => {
        try{
            const password = jsonData.password? jsonData.password : '';
            const username = (jsonData.username).toLowerCase();
            const hashPass = await fu.hashPassword(password);
            const paramName = 'staff_status';
            const query = [
                {
                    $match: {
                        $and: [
                            { username: username},
                            { password: hashPass },
                        ]
                    },
                },
                {
                    $lookup: {
                        from: collections.parameter,
                        let: { paramName: paramName, staffStatus: '$status' },
                        pipeline: [
                            {
                                $match:
                                    {
                                        $expr:
                                            {
                                                $and:
                                                    [
                                                        { $eq: ['$param_name', '$$paramName'] },
                                                        { $eq: ['$param_value', '$$staffStatus'] },
                                                    ]
                                            }
                                    }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    'status_name': '$param_desc',
            
                                }
                            }
                        ],
                        as: 'statusName'
                    }
                },
                {
                    $unwind: {
                        path: '$statusName',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        su_staff: '$$ROOT'
                    }
                },
                {
                    $lookup: {
                        localField: 'su_staff.prefix',
                        from: 'db_prefix',
                        foreignField: '_id',
                        as: 'prefixName'
                    }
                },
                {
                    $unwind: {
                        path: '$prefixName',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        first_name: '$su_staff.first_name',
                        last_name: '$su_staff.last_name',
                        tel: '$su_staff.tel',
                        email: '$su_staff.email',
                        ou_id: '$su_staff.ou_id',
                        username: '$su_staff.username',
                        status: '$su_staff.status',
                        statusName: '$su_staff.statusName',
                        prefixName: '$prefixName.prefix_name',
                        prefix: '$su_staff.prefix',
                    }
                }
            ];
            await mongo.db.collection(collections.staff)
            .aggregate(query).toArray().then(result => {              
                resolve(result);
            }).catch(error => {
                debug('auth.model -> login -> ' + error);
                reject(error);
            });
        }catch(error){
            debug('auth.model -> login -> ' + error);
            reject(error);
        }
    });
}
// MODEL UPDATE DATABASE  STAFF LASTLOGIN 1/9/2020
module.exports.updateLogin = jsonData => {
    return new Promise( (resolve, reject) => {
         mongo.db.collection(collections.staff).updateOne(
            { 
                 '_id' : ObjectID(jsonData._id) 
            },
            { 
                 $set: { 'last_login_date' : new Date() } 
            }
        ,function(error,result){
            if(error){
                debug('auth.model -> updateLogin -> '+ error);
                throw error;
            }else{
                resolve(true);
            }           
        });
    });
}