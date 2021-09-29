const ObjectID = require('mongodb').ObjectID;
const mongodb = require('../../config/mongodb.js');
const { depositStatus } = require('../../../constants/constantsVariable');
const programName = 'Deposit';
module.exports.getDeposit = async (payload, params) => {
  let queryData = [
    {
      ou_id: ObjectID(payload.ou_id),
    },
  ];
  if (params.username) {
    queryData.push({ username: { $regex: params.username, $options: 'i' } });
  }
  if (params.status) {
    queryData.push({ status: params.status });
  }
  if (params.dateFrom && params.dateTo) {
    queryData.push({ doc_date: { $gte: new Date(params.dateFrom), $lte: new Date(params.dateTo) } });
  } else {
    if (params.dateFrom) {
      queryData.push({ doc_date: { $gte: new Date(params.dateFrom) } });
    }
    if (params.dateTo) {
      queryData.push({ doc_date: { $lte: new Date(params.dateTo) } });
    }
  }
  if (queryData.length) {
    return { $and: queryData };
  } else {
    return {};
  }
};
// FUNCTION UPDATE DEPOSIT STATUS
module.exports.updateDepositStatus = async (payload, params) => {
  const dataSet = {
    depositId: ObjectID(params.body._id),
    uid: ObjectID(params.body.uid),
    status: params.body.status,
    amount: params.body.amount,
    doc_type: ObjectID(params.body.doc_type),
    remark: params.body.remark,
    upd_by: payload.username,
    upd_date: new Date(),
    upd_prog: programName,
  };
  if (params.body.status === depositStatus.approve) {
    dataSet.approve_by = payload.username;
    dataSet.approve_date = new Date();
  } else {
    dataSet.reject_by = payload.username;
    dataSet.reject_date = new Date();
  }
  return dataSet;
};
// FUNCTION CHECK QUEUE MEMBER
exports.memberQueue = (params) => {

  return new Promise(async (resolve, reject) => {
    let count = 0;
    await mongodb.db
      .collection(params.collection)
      .insertOne(params. data)
      .then((result) =>
        resolve({
          status: true,
          data: result.ops,
          insertId: result.insertedId,
        })
      )
      .catch((error) =>
        resolve({
          status: false,
          err: error.code,
        })
      );
  });
};
