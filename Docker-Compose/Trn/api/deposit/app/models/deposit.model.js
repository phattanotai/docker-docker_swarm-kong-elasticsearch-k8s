const ObjectID = require('mongodb').ObjectID;
const Decimal = require('decimal.js');
const { collections } = require('../../../constants/constantsVariable');
const mongoInsert = {
  collection: '',
  data: {},
};
const mongoUpdate = {
  collection: '',
  query: {},
  set: {},
};
const mongoQuery = {
  collection: '',
  query: [],
};
const mongoDelete = {
  collection: '',
  query: {},
};
const progModule = 'deposit';
const bankActive = '1';
const paramActive = '1';
const docActive = '1';
const programName = 'Deposit';
const docAbb = 'DP';
// QUERY DATA DEPOSIT
module.exports.getDeposit = async (params) => {
  mongoQuery.collection = collections.deposit;
  mongoQuery.query = [
    {
      $match: params,
    },
    {
      $lookup: {
        from: collections.parameter,
        let: { depositStatus: '$status' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$param_value', '$$depositStatus'] }, { $eq: ['$prog_module', progModule] }],
              },
            },
          },
        ],
        as: 'status_type',
      },
    },
    {
      $unwind: {
        path: '$status_type',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'db_bank',
        localField: 'to_bank_abb',
        foreignField: 'bank_abb',
        as: 'bank_name',
      },
    },
    {
      $unwind: {
        path: '$bank_name',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        doc_date: 1,
        doc_type: 1,
        uid: 1,
        username: 1,
        amount: 1,
        bill_date: 1,
        to_bank_id: 1,
        to_bank_abb: 1,
        bank_name: '$bank_name.bank_name',
        status: 1,
        remark: 1,
        status_name: '$status_type.param_desc',
        approve_by: { $ifNull: ['$approve_by', '-'] },
        cr_by: 1,
        cr_date: 1,
        cr_prog: 1,
        upd_by: 1,
        upd_date: 1,
        upd_prog: 1,
      },
    },
  ];
  return mongoQuery;
};
// QUERY DATA MEMBER
module.exports.getSearchUsername = async (payload, params) => {
  mongoQuery.collection = collections.member;
  mongoQuery.query = [
    {
      $match: {
        $and: [{ ou_id: ObjectID(payload.ou_id) }, { username: params.username }],
      },
    },
    {
      $project: {
        username: 1,
        status: 1,
      },
    },
  ];
  return mongoQuery;
};
// QUERY DATA BANK
module.exports.getDepositBank = async (payload) => {
  mongoQuery.collection = collections.bank;
  mongoQuery.query = [
    {
      $match: { active: bankActive, ou_id: ObjectID(payload.ou_id) },
    },
    {
      $project: {
        bank_name: 1,
        bank_abb: 1,
      },
    },
    {
      $sort: { bank_name: 1 },
    },
  ];
  return mongoQuery;
};
// QUERY DATA STATUS
module.exports.getDepositStatus = async (payload) => {
  mongoQuery.collection = collections.parameter;
  mongoQuery.query = [
    {
      $match: {
        $and: [{ prog_module: progModule }, { active: paramActive }, { ou_id: ObjectID(payload.ou_id) }],
      },
    },
    {
      $project: {
        param_desc: 1,
        param_value: 1,
        param_default: 1,
      },
    },
    {
      $sort: {
        param_seq: 1,
        param_default: -1,
      },
    },
  ];
  return mongoQuery;
};
// QUERY DATA IMAGES
module.exports.getDepositImageBill = async (payload, params) => {
  mongoQuery.collection = collections.deposit;
  mongoQuery.query = [
    {
      $match: {
        $and: [{ _id: ObjectID(params.body._id) }, { ou_id: ObjectID(payload.ou_id) }],
      },
    },
    {
      $project: {
        bill_slip: 1,
      },
    },
  ];
  return mongoQuery;
};
// QUERY DATA IMAGES
module.exports.getDepositStatusRecord = async (payload, params) => {
  mongoQuery.collection = collections.deposit;
  mongoQuery.query = [
    {
      $match: {
        $and: [{ _id: ObjectID(params.body._id) }, { ou_id: ObjectID(payload.ou_id) }],
      },
    },
    {
      $project: {
        status: 1,
      },
    },
  ];
  return mongoQuery;
};
// QUERY INSERT STATUS
module.exports.insertDepositTransaction = async (payload, params, doc) => {
  mongoInsert.collection = collections.deposit;
  mongoInsert.data = {
    ou_id: ObjectID(payload.ou_id),
    doc_type: ObjectID(doc._id),
    uid: ObjectID(params.body.uid),
    username: params.body.username,
    to_bank_id: ObjectID(params.body.bank_id),
    to_bank_abb: params.body.bank_abb,
    doc_date: new Date(params.body.doc_date),
    bill_date: new Date(params.body.bill_date),
    amount: parseFloat(params.body.amount),
    bill_slip: params.body.bill_slip,
    status: params.body.status,
    request_by: payload.username,
    request_date: new Date(params.body.request_date),
    approve_by: null,
    approve_date: null,
    reject_by: null,
    reject_date: null,
    remark: null,
    cr_by: payload.username,
    cr_date: new Date(),
    cr_prog: programName,
    upd_by: payload.username,
    upd_date: new Date(),
    upd_prog: programName,
  };
  return mongoInsert;
};
// QUERY EDIT
module.exports.editDeposit = async (payload, params) => {
  mongoUpdate.collection = collections.deposit;
  mongoUpdate.query = { _id: ObjectID(params.body.depositId) };
  mongoUpdate.set = {
    $set: {
      depositId: ObjectID(params.body._id),
      uid: ObjectID(params.body.uid),
      username: params.body.username,
      to_bank_id: ObjectID(params.body.bank_id),
      to_bank_abb: params.body.bank_abb,
      bill_date: new Date(params.body.bill_date),
      amount: parseFloat(params.body.amount),
      bill_slip: params.body.bill_slip,
      upd_by: payload.username,
      upd_date: new Date(),
      upd_prog: programName,
    },
  };
  return mongoUpdate;
};
// QUERY UPDATE STATUS
module.exports.updateDepositStatus = async (params) => {
  mongoUpdate.collection = collections.deposit;
  mongoUpdate.query = { _id: ObjectID(params.depositId) };
  mongoUpdate.set = { $set: params };
  return mongoUpdate;
};
// QUERY WALLET MAIN
module.exports.findWallet = async (payload, params) => {
  mongoQuery.collection = collections.walletMain;
  mongoQuery.query = [
    {
      $match: {
        ou_id: ObjectID(payload.ou_id),
        uid: ObjectID(params.uid),
      },
    },
  ];
  return mongoQuery;
};
// QUERY WALLET TRANSITION
module.exports.findWalletTransition = async (payload, params) => {
  mongoQuery.collection = collections.walletTransaction;
  mongoQuery.query = [
    { $sort: { date: -1 } },
    {
      $match: {
        $and: [{ ou_id: ObjectID(payload.ou_id) }, { uid: ObjectID(params.body.uid) }],
      },
    },
    {
      $group: {
        _id: '$uid',
        firstWalletTransition: {
          $first: {
            ou_id: '$ou_id',
            uid: '$uid',
            ref_id: '$ref_id',
            date: '$date',
            type: '$type',
            cbf: '$cbf',
            camt: '$camt',
            cbal: '$cbal',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        ou_id: '$firstWalletTransition.ou_id',
        uid: '$firstWalletTransition.uid',
        ref_id: '$firstWalletTransition.ref_id',
        date: '$firstWalletTransition.date',
        type: '$firstWalletTransition.type',
        cbf: '$firstWalletTransition.cbf',
        camt: '$firstWalletTransition.camt',
        cbal: '$firstWalletTransition.cbal',
      },
    },
  ];
  return mongoQuery;
};
// QUERY CHECK WALLET TRANSITION
module.exports.checkWalletTransition = async (payload, params) => {
  mongoQuery.collection = collections.walletTransaction;
  mongoQuery.query = [
    {
      $match: {
        $and: [{ ou_id: ObjectID(payload.ou_id) }, { ref_id: ObjectID(params.body.ref_id) }],
      },
    },
  ];
  return mongoQuery;
};
// INSERT WALLET TRANSITION
module.exports.insertWalletTransition = async (payload, params, balance) => {
  mongoInsert.collection = collections.walletTransaction;
  mongoInsert.data = {
    ou_id: ObjectID(payload.ou_id),
    uid: ObjectID(params.body.uid),
    ref_id: ObjectID(params.body._id),
    date: new Date(),
    type: ObjectID(params.body.doc_type),
    cbf: 0,
    camt: params.body.amount,
    cbal: 0,
    cr_by: payload.username,
    cr_date: new Date(),
    cr_prog: programName,
    upd_by: payload.username,
    upd_date: new Date(),
    upd_prog: programName,
  };
  if (balance) {
    mongoInsert.data.cbf = balance.cbal;
    mongoInsert.data.cbal = parseFloat(new Decimal(balance.cbal).plus(new Decimal(params.body.amount)).toFixed(2));
  } else {
    mongoInsert.data.cbal = parseFloat(new Decimal(0).plus(new Decimal(params.body.amount)).toFixed(2));
  }

  return mongoInsert;
};
// INSERT WALLET TRANSITION
module.exports.insertWalletTransitionFail = async (payload, params, balance) => {
  mongoInsert.collection = collections.walletTransaction;
  mongoInsert.data = {
    ou_id: ObjectID(payload.ou_id),
    uid: ObjectID(params.body.uid),
    ref_id: ObjectID(params.body._id),
    date: new Date(),
    type: ObjectID(params.body.doc_type),
    cbf: 0,
    camt: params.body.amount,
    cbal: 0,
    cr_by: payload.username,
    cr_date: new Date(),
    cr_prog: programName,
    upd_by: payload.username,
    upd_date: new Date(),
    upd_prog: programName,
  };
  if (balance) {
    mongoInsert.data.cbf = balance.cbal;
    mongoInsert.data.camt = params.body.amount * -1;
    mongoInsert.data.cbal = parseFloat(new Decimal(balance.cbal).minus(new Decimal(params.body.amount)).toFixed(2));
  }

  return mongoInsert;
};
// UPDATE WALLET MAIN
module.exports.updateBalanceWallet = (payload, transition, wallet) => {
  mongoUpdate.collection = collections.walletMain;
  mongoUpdate.query = {
    _id: ObjectID(wallet._id),
    ou_id: ObjectID(payload.ou_id),
    uid: ObjectID(transition.uid),
  };
  mongoUpdate.set = {
    $set: {
      cbal: parseFloat(transition.cbal),
      upd_by: payload.username,
      upd_date: new Date(),
      upd_prog: programName,
    },
  };
  return mongoUpdate;
};
// QUERY DOCUMENT TYPES
module.exports.getDocType = (payload) => {
  mongoQuery.collection = collections.docType;
  mongoQuery.query = [
    {
      $match: {
        ou_id: ObjectID(payload.ou_id),
        doc_abb: docAbb,
        active: docActive,
      },
    },
    {
      $project: {
        doc_abb: 1,
        doc_desc: 1,
      },
    },
  ];
  return mongoQuery;
};
// INSERT QUEUE
module.exports.memberQueue = async (payload, params) => {
  mongoInsert.collection = collections.queue;
  mongoInsert.data = {
    ou_id: ObjectID(payload.ou_id),
    doc_type: ObjectID(params.body.doc_type),
    uid:  ObjectID(params.body.uid),
    ref_id:  ObjectID(params.body._id),
    username: params.body.username,
    cr_by: payload.username,
    cr_date: new Date(),
    cr_prog: params.body.cr_prog,
    upd_by: payload.username,
    upd_date: new Date(),
    upd_prog: params.body.cr_prog,
  };
  return mongoInsert;
};
// DELETE MEMBER QUEUE
module.exports.deleteMemberQueue = (payload, params) => {
  mongoDelete.collection = collections.queue;
  mongoDelete.query = {
    uid: ObjectID(params.body.uid),
    ou_id: ObjectID(payload.ou_id),
  };
  return mongoDelete;
};
// INSERT WALLET TRANSITION QUEUE
module.exports.insertWalletTransitionQueue = async (payload, params, balance) => {
  mongoInsert.collection = collections.walletTransaction;
  mongoInsert.data = {
    ou_id: ObjectID(payload.ou_id),
    uid: ObjectID(params.body.uid),
    ref_id: ObjectID(params.body._id),
    date: new Date(),
    type: ObjectID(params.body.doc_type),
    cbf: 0,
    camt: params.body.amount,
    cbal: 0,
    cr_by: payload.username,
    cr_date: new Date(),
    cr_prog: programName,
    upd_by: payload.username,
    upd_date: new Date(),
    upd_prog: programName,
  };
  if (balance) {
    mongoInsert.data.cbf = balance.cbal;
    mongoInsert.data.cbal = parseFloat(new Decimal(balance.cbal).plus(new Decimal(params.body.amount)).toFixed(2));
  } else {
    mongoInsert.data.cbal = parseFloat(new Decimal(0).plus(new Decimal(params.body.amount)).toFixed(2));
  }

  return mongoInsert;
};
