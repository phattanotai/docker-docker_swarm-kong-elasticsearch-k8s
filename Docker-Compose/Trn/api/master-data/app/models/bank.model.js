const mongo = require('../../config/mongodb.js');
const ObjectID = require('mongodb').ObjectID;
const fu = require('../../../constants/functionUtil');
const {collections,masterDataActive} = require('../../../constants/constantsVariable');
const debug = fu.debug;
// MODEL CHECK BANK WHEN ADD DUPLICATE 8/9/2020
module.exports.checkBank = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $and: [
                        { bank_abb: jsonData.bankAbb},
                        { ou_id: ObjectID(userData.ou_id)}
                    ]  
                }
            }
        ];
        await mongo.db.collection(collections.bank)
        .aggregate(query).toArray().then(async result => {
            const checkNull = fu.isNull(result);
            if(checkNull){
                resolve(false);
            }else{
                let msg = '';
                for await (const i of result){
                    if(jsonData.staffTel === i.tel){
                        msg += 'Bank Abbreviation duplicate\n';
                    }
                }
                resolve(msg);
            }
        }).catch(error => {
            debug('Master-data bank.model -> checkBank -> '+ error);
            reject(error);
        });    
    });
}
// MODEL CHECK BANK WHEN EDIT  DUPLICATE 8/9/2020
module.exports.checkEditBank = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                    $and: [
                        { _id: { $ne: ObjectID(jsonData._id)}},
                        { bank_abb: (jsonData.bankAbb).toUpperCase()},
                        { ou_id: ObjectID(userData.ou_id)}
                    ]  
                }
            }
        ];
        await mongo.db.collection(collections.bank)
        .aggregate(query).toArray().then(async result => {
            const checkNull = fu.isNull(result);
            if(checkNull){
                resolve(false);
            }else{
                let msg = '';
                for await (const i of result){
                    if(jsonData.staffTel === i.tel){
                        msg += 'Bank Abbreviation duplicate\n';
                    }
                }
                resolve(msg);
            }
        }).catch(error => {
            debug('Master-data bank.model -> checkBank -> '+ error);
            reject(error);
        });    
    });
}
// MODEL ADD BANK 8/9/2020
module.exports.addBank = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        try{
            const query = {
               ou_id: ObjectID(userData.ou_id),
               bank_name: jsonData.bankName,
               bank_abb: (jsonData.bankAbb).toUpperCase(),
               bank_description: jsonData.bankDescription,
               active: (jsonData.bankActive).toString(),
               cr_by: userData.username,
               cr_date: new Date(),
               cr_prog: jsonData.program,
               upd_by: userData.username,
               upd_date: new Date(),
               upd_prog: jsonData.program
            }
             await mongo.db.collection(collections.bank)
             .insertOne(query).then(result => {
                if(result.insertedCount === 1){
                    resolve(true);
                 }else{
                    resolve(false);
                 }
             }).catch(error => {
                debug('Master-data bank.model -> addBank -> '+ error);
                reject(error);
             });   
        }catch(error){
            debug('Master-data bank.model -> addBank -> '+ error);
            reject(error);
        }
    });
}
// MODEL EDIT BANK 8/9/2020
module.exports.editBank = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        try{
            const where =  { 
                '_id' : ObjectID(jsonData._id) 
            };
            const query = { 
                $set: 
                   { 
                    bank_name: jsonData.bankName,
                    bank_abb: (jsonData.bankAbb).toUpperCase(),
                    bank_description: jsonData.bankDescription,
                    active: (jsonData.bankActive).toString(),
                    upd_by: userData.username,
                    upd_date: new Date(),
                    upd_prog: jsonData.program
                }
            };
            await mongo.db.collection(collections.bank)
            .updateOne(where,query).then(result => {
                if(result.matchedCount === 1){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }).catch(error => {
                debug('Master-data bank.model -> editBank -> '+ error);
                reject(error);
            });   
        }catch(error){
            debug('Master-data bank.model -> editBank -> '+ error);
            reject(error);
        }
    });
}
// MODEL SEARCH BANK 8/9/2020
module.exports.searchBank = (jsonData,userData) => {
    return new Promise(async (resolve, reject) => {
        const bankName = jsonData.bankName;
        const bankAbb = jsonData.bankAbb;
        const bankActive = jsonData.bankActive;
        const module = 'master_data';
        const name = 'active';
        let match = {
            $and: [
                {ou_id: ObjectID(userData.ou_id)}
            ]
        };
        if(bankName){
            match.$and.push({ bank_name: { $regex: bankName, $options: 'i' } });
        }
        if(bankAbb){
            match.$and.push({ bank_abb: { $regex:  bankAbb, $options: 'i' } });
        }
        if(bankActive){
            match.$and.push({ active: bankActive });
        }
        let query = [
            {
                $match: match
            },
            {
                $lookup: {
                    from: collections.parameter,
                    let: { active: '$active', module: module, name: name },
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $and:
                                                [
                                                    { $eq: ['$param_name', '$$name'] },
                                                    { $eq: ['$prog_module', '$$module'] },
                                                    { $eq: ['$param_value', '$$active'] },
                                                ]
                                        }
                                }
                        },
                        {
                            $project: {
                                _id: 0,
                                'active_name': '$param_desc',
        
                            }
                        }
                    ],
                    as: 'activeName'
                }
            },
            {
                $unwind: {
                    path: '$activeName',
                }
        
            },
            {
                $project: {
                    bankName : '$bank_name', 
                    bankAbb : '$bank_abb', 
                    bankDescription : '$bank_description', 
                    bankActive : '$active', 
                    bankActiveName : '$activeName.active_name', 
                    bankDate : '$cr_date', 
                }
            }
        ];
        await mongo.db.collection(collections.bank)
        .aggregate(query).toArray().then(result => {
            resolve(result);
        }).catch(error => {
            debug('Master-data bank.model -> searchBank -> '+ error);
            reject(error);
        });
    });
}
// MODEL GET BANK ACTIVE MASTER-DATA BANK 8/9/2020
module.exports.getBankActive = jsonData => {
    return new Promise(async (resolve, reject) => {
        const progModule = 'master_data';

        const query = [
            {
                $match: {
                     $and: [
                         {prog_module: progModule},
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
            debug('Master-data bank.model -> getBankActive -> '+ error);
            reject(error);
        });  
    });
}