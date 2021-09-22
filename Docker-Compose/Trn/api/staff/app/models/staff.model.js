const mongo = require('../../config/mongodb.js');
const ObjectID = require('mongodb').ObjectID;
const fu = require('../../../constants/functionUtil');
const {collections,masterDataActive} = require('../../../constants/constantsVariable');
const debug = fu.debug;
// MODEL SEARCH STAFF 4/9/2020
module.exports.searchStaff = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        const  str = jsonData.staffName;
        const  res = str.split(' ');
        let firstName ;
        let lastName;
        let name;
        if(res.length > 1){
            firstName = res[0];
            lastName = res[1];
        }else{
            name = jsonData.staffName;
        }
        const username = jsonData.staffUsername;
        const tel = jsonData.staffTel;
        const status = jsonData.staffStatus;
        const paramName = 'staff_status';
        let match = {
            $and: [
                {ou_id: ObjectID(userData.ou_id)}
            ]
        };
        // SEARCH FIRSTNAME OR LASTNAME
        if(name){
            match.$and.push(
                {
                    $or: [
                        { first_name: { '$regex': name, '$options': 'i' } },
                        { last_name: { '$regex': name, '$options': 'i' } },
                    ]
                }
            );
        }
        // SEARCH FIRSTNAME AND LASTNAME
        if(firstName){
            match.$and.push({ first_name: { $regex: firstName, $options: 'i' } });
        }
        if(lastName){
            match.$and.push({ last_name: { $regex: lastName, $options: 'i' } });
        }
        if(username){
            match.$and.push({ username: { $regex: username, $options: 'i' } });
        }
        if(tel){
            match.$and.push( { tel: { $regex: tel, $options: 'i' }  } );
        }
        if(status){
            match.$and.push( { status:  status } );
        }
        let query = [
            {
                $match: match
            },
            {
                $lookup: {
                    from: collections.parameter,
                    let: { paramName: paramName, staffStatus: '$status'  },
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
                    staffPrefix: '$prefix',
                    staffFirstName: '$first_name',
                    staffLastName: '$last_name',
                    staffTel: '$tel',
                    staffEmail: '$email',
                    registerDate: '$reg_date',
                    staffUsername: '$username',
                    status: '$status',
                    statusName: '$statusName.status_name'
                }
            },
        ];
        await mongo.db.collection(collections.staff)
        .aggregate(query).toArray().then(result => {
            resolve(result);
        }).catch(error => {
            debug('staff.model -> searchStaff -> '+ error);
            reject(error);
        });
    });
}
// MODEL ADD STAFF 4/9/2020
module.exports.addStaff = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        try{
            const hashPass = await fu.hashPassword(jsonData.staffPassword);
            const query = {
               ou_id: ObjectID(userData.ou_id),
               username: (jsonData.staffUsername).toLowerCase(),
               prefix: ObjectID(jsonData.staffPrefix),
               first_name: jsonData.staffFirstName,
               last_name: jsonData.staffLastName,
               tel: jsonData.staffTel,
               email: (jsonData.staffEmail).toLowerCase(),
               password: hashPass,
               reg_date: new Date(),
               last_login_date: new Date(),
               status: jsonData.staffStatus,
               cr_by: userData.username,
               cr_date: new Date(),
               cr_prog: jsonData.program,
               upd_by: userData.username,
               upd_date: new Date(),
               upd_prog: jsonData.program
            }
             await mongo.db.collection(collections.staff)
             .insertOne(query).then(result => {
                 if(result.insertedCount === 1){
                    resolve(true);
                 }else{
                    resolve(false);
                 }
             }).catch(error => {
                 debug('staff.model -> addStaff -> '+ error);
                 if(error.code === 11000){
                    let err;
                    if(error.keyPattern['email'] === 1){
                       err = 'Staff Email duplicate';
                    }else if(error.keyPattern['tel'] === 1){
                       err = 'Staff Telephone duplicate';
                    }
                    reject(err);
                 }else{
                    reject(error);
                 }
             });   
        }catch(error){
            debug('staff.model -> addStaff -> '+ error);
            reject(error);
        }
    });
}
// MODEL EDIT STAFF 7/9/2020
module.exports.editStaff = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        try{
            const where =  { 
                '_id' : ObjectID(jsonData._id) 
            };
            const query = { 
                $set: 
                   { 
                    prefix: ObjectID(jsonData.staffPrefix),
                    first_name: jsonData.staffFirstName,
                    last_name: jsonData.staffLastName,
                    tel: jsonData.staffTel,
                    status: jsonData.staffStatus,
                    upd_by : userData.username,
                    upd_date : new Date(),
                    upd_prog : jsonData.program,
                }
            };
            await mongo.db.collection(collections.staff)
            .updateOne(where,query).then(result => {
                if(result.matchedCount === 1){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }).catch(error => {
                debug('staff.model -> editStaff -> '+ error);
                if(error.code === 11000){
                   let err;
                   if(error.keyPattern['email'] === 1){
                      err = 'Staff Email duplicate';
                   }else if(error.keyPattern['tel'] === 1){
                      err = 'Staff Telephone duplicate';
                   }
                    reject(err);
                }else{
                    reject(error);
                }
            });   
        }catch(error){
            debug('staff.model -> editStaff -> '+ error);
            reject(error);
        }
    });
}
// MODEL RESET PASSWORD STAFF 7/9/2020
module.exports.resetPassword = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        try{
            const hashPass = await fu.hashPassword(jsonData.staffPassword);
            const where = { 
                '_id' : ObjectID(jsonData._id) 
            };
            const query = { 
                $set: 
                   { 
                    password: hashPass,
                    upd_by : userData.username,
                    upd_date : new Date() ,
                    upd_prog : jsonData.program,
                }
            };
            await mongo.db.collection(collections.staff)
            .updateOne(where,query).then(result => {
                if(result.matchedCount === 1){
                    resolve(true);
                }else{
                    resolve(false);
                }    
            }).catch(error => {
                debug('staff.model -> resetPassword -> '+ error);
                reject(error);
            });   
        }catch(error){
            debug('staff.model -> resetPassword -> '+ error);
            reject(error);
        }
    });
}
// MODEL CHECK EMAIL AND PASSWORD STAFF DUPLICATE 4/9/2020
module.exports.checkEmailAndTel = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $or: [
                        { email: (jsonData.staffEmail).toLowerCase()},
                        { tel: jsonData.staffTel },
                    ],
                    ou_id: ObjectID(userData.ou_id)
                }
            },
        ];
        await mongo.db.collection(collections.staff)
        .aggregate(query).toArray().then(async result => {
            const checkNull = fu.isNull(result);
            if(checkNull){
                resolve(false);
            }else{
                let msg = '';
                let telMsg = '';
                let emailMsg = '';
                for await (const i of result){
                    if(jsonData.staffTel === i.tel){
                        telMsg = 'Staff Telephone  duplicate';
                    }
                    if((jsonData.staffEmail).toLowerCase() === i.email){
                        emailMsg = 'Staff Email duplicate';
                    }
                    msg = telMsg + ' ' + emailMsg;
                    if(emailMsg && telMsg){
                        break;
                    }
                }
                resolve(msg);
            }
        }).catch(error => {
            debug('staff.model -> checkEmailAndTel -> '+ error);
            reject(error);
        });    
    });
}
// MODEL CHECK PASSWORD STAFF DUPLICATE WHEN EDIT 9/9/2020
module.exports.checkTel = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $and: [
                        { _id: { $ne: ObjectID(jsonData._id)}},
                        { tel: jsonData.staffTel },
                        { ou_id: ObjectID(userData.ou_id)}
                    ]
                }
            },
        ];
        await mongo.db.collection(collections.staff)
        .aggregate(query).toArray().then(async result => {
            const checkNull = fu.isNull(result);
            if(checkNull){
                resolve(false);
            }else{
                let msg = '';
                for await (const i of result){
                    if(jsonData.staffTel === i.tel){
                        msg += 'Staff Telephone  duplicate\n';
                    }
                    if(msg){
                        break;
                    }
                }
                resolve(msg);
            }
        }).catch(error => {
            debug('staff.model -> checkEmailAndTel -> '+ error);
            reject(error);
        });    
    });
}
// MODEL GETPREFIX STAFF 7/9/2020
module.exports.getPrefix = jsonData => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                     $and: [
                         {ou_id: ObjectID(jsonData.ou_id)},
                        //  {active: masterDataActive.active}
                     ]                   
                }
            },
            {
                $project: {
                    _id: 0,
                    value: '$_id',
                    name: '$prefix_name',
                    active: 1
                }
            }
        ];
        await mongo.db.collection(collections.prefix)
        .aggregate(query).toArray().then(result => {
            resolve(result);
        }).catch(error => {
            debug('staff.model -> getPrefix -> '+ error);
            reject(error);
        });   
    });
}
// MODEL GETSTATUS STAFF 7/9/2020
module.exports.getStatus = jsonData => {
    return new Promise(async (resolve, reject) => {
        const progModule = 'staff';
        const query = [
            {
                $match: {
                     $and: [
                         {prog_module:  progModule},
                         {active: masterDataActive.active}
                     ]
                }
            },
            {
                $project: {
                    _id: 0,
                    value: '$param_value',
                    name: '$param_desc'
                }
            }
        ];
        await mongo.db.collection(collections.parameter)
        .aggregate(query).toArray().then(result => {
            resolve(result);
        }).catch(error => {
            debug('staff.model -> getStatus -> '+ error);
            reject(error);
        });  
    });
}