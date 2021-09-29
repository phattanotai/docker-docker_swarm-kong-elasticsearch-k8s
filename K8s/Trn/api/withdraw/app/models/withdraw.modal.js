const mongodb = require("../../config/mongodb");
const ObjectID = require("mongodb").ObjectID;

module.exports.searchWithdraw = (params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("tn_withdraw")
      .aggregate([
        {
          $match: params,
        },
        {
          $lookup: {
            from: "su_parameter",
            let: {
              module: "withdraw",
              name: "withdraw_status",
              value: "$status",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$prog_module", "$$module"] },
                      { $eq: ["$param_name", "$$name"] },
                      { $eq: ["$param_value", "$$value"] },
                    ],
                  },
                },
              },
            ],
            as: "parameter",
          },
        },
        {
          $unwind: {
            path: "$parameter",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            ou_id: "$ou_id",
            uid: "$uid",
            doc_date: "$doc_date",
            username: "$username",
            status: "$status",
            parameter: "$parameter",
            amount: "$amount",
            approve_by: "$approve_by",
            remark: "$remark",
            cr_by: "$cr_by",
            cr_date: "$cr_date",
            cr_prog: "$cr_date",
            upd_by: "$upd_by",
            upd_date: "$upd_date",
            upd_prog: "$upd_prog",
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.renderDdlParameter = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("su_parameter")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            prog_module: params.prog_module,
            param_name: params.param_name,
          },
        },
        {
          $project: {
            ou_id: "$ou_id",
            prog_module: "$prog_module",
            param_name: "$param_name",
            param_seq: "$param_seq",
            param_desc: "$param_desc",
            param_value: "$param_value",
            active: "$param_value",
            cr_by: "$cr_by",
            cr_date: "$cr_date",
            cr_prog: "$cr_date",
            upd_by: "$upd_by",
            upd_date: "$upd_date",
            upd_prog: "$upd_prog",
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.searchUsername = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("member")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            username: params.username,
          },
        },
        {
          $lookup: {
            from: "wallet_main",
            let: { ou: ObjectID(payload.ou_id), user_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$ou_id", "$$ou"],
                      },
                      {
                        $eq: ["$uid", "$$user_id"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "wellet",
          },
        },
        {
          $unwind: {
            path: "$wellet",
          },
        },
        {
          $project: {
            ou_id: "$ou_id",
            username: "$username",
            first_name: "$first_name",
            last_name: "$last_name",
            status: "$status",
            balance: "$wellet.cbal",
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.checkBalance = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_main")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            uid: ObjectID(params.userId),
            $expr: {
              $lte: [{ $toDecimal: params.amount }, { $toDecimal: "$cbal" }],
            },
          },
        },
        {
          $project: {
            ou_id: "$ou_id",
            uid: "$uid",
            cbal: "$cbal",
            cbal_change: {
              $toDouble: {
                $subtract: [
                  { $toDecimal: "$cbal" },
                  { $toDecimal: params.amount },
                ],
              },
            },
            cr_by: "$cr_by",
            cr_date: "$cr_date",
            cr_prog: "$cr_date",
            upd_by: "$upd_by",
            upd_date: "$upd_date",
            upd_prog: "$upd_prog",
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.insertWithdrawTransaction = (payload, params, docType) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("tn_withdraw")
      .insertOne({
        ou_id: ObjectID(payload.ou_id),
        doc_type: ObjectID(docType._id),
        doc_date: new Date(params.date),
        uid: ObjectID(params.userId),
        username: params.username,
        amount: params.amount,
        status: params.status,
        request_by: payload.username,
        request_date: new Date(),
        approve_by: null,
        approve_date: null,
        reject_by: null,
        reject_date: null,
        remark: null,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "Withdraw",
        upd_by: payload.username,
        upd_date: new Date(),
        upd_prog: "Withdraw",
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.insertWalletTransaction = (
  payload,
  params,
  withdrawId,
  balance,
  docType
) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_transaction")
      .insertOne({
        ou_id: ObjectID(payload.ou_id),
        uid: ObjectID(params.userId),
        ref_id: ObjectID(withdrawId),
        date: new Date(params.date),
        type: ObjectID(docType._id),
        cbf: balance.cbal,
        camt: params.amount * -1,
        cbal: balance.cbal_change,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "Withdraw",
        upd_by: payload.username,
        upd_date: new Date(),
        upd_prog: "Withdraw",
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.updateMainWallet = (payload, params, wallet) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_main")
      .updateOne(
        {
          _id: ObjectID(wallet._id),
          ou_id: ObjectID(payload.ou_id),
          uid: ObjectID(params.userId),
        },
        {
          $set: {
            cbal: wallet.cbal_change,
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "Withdraw",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.findWallet = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_main")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            uid: ObjectID(params.uid),
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.updateApprove = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("tn_withdraw")
      .updateOne(
        {
          _id: ObjectID(params.tid),
          ou_id: ObjectID(payload.ou_id),
        },
        {
          $set: {
            status: params.status,
            approve_by: payload.username,
            approve_date: new Date(),
            remark: params.remark,
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "Withdraw",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.findWalletRejectWithdraw = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_main")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            uid: ObjectID(params.uid),
          },
        },
        {
          $project: {
            ou_id: "$ou_id",
            uid: "$uid",
            cbal: "$cbal",
            cbal_refund: {
              $toDouble: {
                $add: [{ $toDecimal: "$cbal" }, { $toDecimal: params.amount }],
              },
            },
            cr_by: "$cr_by",
            cr_date: "$cr_date",
            cr_prog: "$cr_date",
            upd_by: "$upd_by",
            upd_date: "$upd_date",
            upd_prog: "$upd_prog",
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.insertRejectWalletTransaction = (
  payload,
  params,
  balance,
  docType
) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_transaction")
      .insertOne({
        ou_id: ObjectID(payload.ou_id),
        uid: ObjectID(params.uid),
        ref_id: ObjectID(params.tid),
        date: new Date(params.date),
        type: docType._id,
        cbf: balance.cbal,
        camt: params.amount,
        cbal: balance.cbal_refund,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "Withdraw",
        upd_by: payload.username,
        upd_date: new Date(),
        upd_prog: "Withdraw",
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.updateReject = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("tn_withdraw")
      .updateOne(
        {
          _id: ObjectID(params.tid),
          ou_id: ObjectID(payload.ou_id),
        },
        {
          $set: {
            status: params.status,
            reject_by: payload.username,
            reject_date: new Date(),
            remark: params.remark,
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "Withdraw",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.updateRejectMainWallet = (payload, params, wallet) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_main")
      .updateOne(
        {
          _id: ObjectID(wallet._id),
          ou_id: ObjectID(payload.ou_id),
          uid: ObjectID(params.uid),
        },
        {
          $set: {
            cbal: wallet.cbal_refund,
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "Withdraw",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.findDocTypeWithdraw = (payload) => {
  const docAcc = "WD";
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("db_document_type")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            doc_abb: docAcc,
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.searchUserEvent = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("member")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            username: params.username,
          },
        },
        {
          $lookup: {
            from: "wallet_main",
            let: { ou: ObjectID(payload.ou_id), user_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$ou_id", "$$ou"],
                      },
                      {
                        $eq: ["$uid", "$$user_id"],
                      },
                    ],
                  },
                },
              },
            ],
            as: "wellet",
          },
        },
        {
          $unwind: {
            path: "$wellet",
          },
        },
        {
          $project: {
            ou_id: "$ou_id",
            username: "$username",
            first_name: "$first_name",
            last_name: "$last_name",
            status: "$status",
            balance: "$wellet.cbal",
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.checkMember = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("member")
      .aggregate([
        {
          $match: {
            _id: ObjectID(params.userId),
            ou_id: ObjectID(payload.ou_id),
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.checkStatus = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("tn_withdraw")
      .aggregate([
        {
          $match: {
            _id: ObjectID(params.tid),
            ou_id: ObjectID(payload.ou_id),
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.updateInsertWithdrawTransactionReject = (payload, insertId) => {
  const rejectStatus = "300";
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("tn_withdraw")
      .updateOne(
        {
          _id: ObjectID(insertId),
          ou_id: ObjectID(payload.ou_id),
        },
        {
          $set: {
            status: rejectStatus,
            reject_by: payload.username,
            reject_date: new Date(),
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "withdraw",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.insertRefundWalletTransaction = (
  payload,
  params,
  withdrawId,
  balance,
  docType
) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_transaction")
      .insertOne({
        ou_id: ObjectID(payload.ou_id),
        uid: ObjectID(params.userId),
        ref_id: ObjectID(withdrawId),
        date: new Date(params.date),
        type: ObjectID(docType._id),
        cbf: balance.cbal_change,
        camt: params.amount,
        cbal: balance.cbal,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "Withdraw",
        upd_by: payload.username,
        upd_date: new Date(),
        upd_prog: "Withdraw",
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.insertRejectRefundWalletTransaction = (
  payload,
  params,
  balance,
  docType
) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_transaction")
      .insertOne({
        ou_id: ObjectID(payload.ou_id),
        uid: ObjectID(params.uid),
        ref_id: ObjectID(params.tid),
        date: new Date(params.date),
        type: docType._id,
        cbf: balance.cbal_refund,
        camt: params.amount * -1,
        cbal: balance.cbal,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "Withdraw",
        upd_by: payload.username,
        upd_date: new Date(),
        upd_prog: "Withdraw",
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.updateRejectMainWalletWhenTansactionFail = (
  payload,
  params,
  wallet
) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("wallet_main")
      .updateOne(
        {
          _id: ObjectID(wallet._id),
          ou_id: ObjectID(payload.ou_id),
          uid: ObjectID(params.uid),
        },
        {
          $set: {
            cbal: wallet.cbal,
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "Withdraw",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
