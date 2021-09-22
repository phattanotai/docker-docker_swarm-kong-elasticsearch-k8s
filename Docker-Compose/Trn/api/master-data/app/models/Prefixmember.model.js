const mongo = require('../../config/mongodb.js');
const ObjectID = require('mongodb').ObjectID;
/////////////////////////
const prog_name = 'master_data';
const param_name = 'active';
/////////////////////////
module.exports.GetActiveprefix = jsonData => {
    return new Promise(async (resolve, reject) => {
        const query = [
            {
                $match: {
                     $and: [
                         {prog_module: prog_name},
                         {param_name: param_name}
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
            console.log('Prefixmember.model -> getActivePrefix -> '+ error);
            reject(error)
        });   
    });
}

module.exports.Getdataprefix = jsonData => {
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('db_prefix').aggregate([
            {
                $lookup:{
                       from:'su_parameter',               
                       let:{ module: prog_name ,name:param_name,value:'$active'},
                       pipeline:[
                           {
                               $match:{
                                   $expr:{
                                       $and:[
                                       { $eq:['$prog_module','$$module']},
                                        { $eq:['$param_name','$$name']},
                                        { $eq:['$param_value','$$value']}
                                       ]
                                   }
                               }
                           }
                       ],as : 'parameter',
                       
                }
            },
            {
                $unwind:{
                    path:'$parameter'
                }
            },
            {
                $project: {                
                    prefix_name: '$prefix_name',      
                    prefix_desc: '$prefix_desc',   
                    active_value: '$active',            
                    active: '$parameter.param_desc'
                }
            }]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            );
    });
}
module.exports.seachPrefix = jsonData => {
    const and = [];
    if(jsonData.prefix){ 
        and.push({prefix_name:{ $regex: jsonData.prefix, $options: 'i'}});
    }
    if(jsonData.Active){
        and.push({active: jsonData.Active});
    }
    
    return new Promise(async (resolve, reject) => {
        await mongo.db.collection('db_prefix').aggregate([
            {
                $match: {
                    $and: and
                }
            },{
                $lookup:{
                       from:'su_parameter',               
                       let:{ module:prog_name,name:param_name,value:'$active'},
                       pipeline:[
                           {
                               $match:{
                                   $expr:{
                                       $and:[
                                       { $eq:['$prog_module','$$module']},
                                        { $eq:['$param_name','$$name']},
                                        { $eq:['$param_value','$$value']}
                                       ]
                                   }
                               }
                           }
                       ],as : 'parameter',
                       
                }
            },
            {
                $unwind:{
                    path:'$parameter'
                }
            },
            {
                $project: {                
                    prefix_name: '$prefix_name',      
                    prefix_desc: '$prefix_desc',   
                    active_value: '$active',            
                    active: '$parameter.param_desc'
                }
            }]).toArray().then(
                result => resolve(result)
            ).catch(
                error => reject(error)
            );
    });
}


module.exports.find_Prefix = function (query) {
    return new Promise(function (resolve) {
        var collection = mongo.db.collection('db_prefix');
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


module.exports.mdprefixEdit = (db, collection, query, set, option) => {
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