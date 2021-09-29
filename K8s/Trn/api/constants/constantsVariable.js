module.exports.staffStatus = {
  normal: "0",
  lock: "1",
  expired: "2",
};

module.exports.masterDataActive = {
  active: "1",
  inActive: "0",
};

module.exports.collections = {
  bank: "db_bank",
  docType: "db_document_type",
  prefix: "db_prefix",
  member: "member",
  organization: "su_organization",
  parameter: "su_parameter",
  staff: "su_staff",
  deposit: "tn_deposit",
  withdraw: "tn_withdraw",
  walletMain: "wallet_main",
  walletTransaction: "wallet_transaction",
  queue: "tn_queue",
  queue: "tn_waiting"
};
module.exports.returnMessage = {
  insertSuccess: "Insert data success",
  insertFail: "Insert data fail",
  updateSuccess: "Update data success",
  updateFail: "Update data fail",
  resetPassSuccess: "Reset Password success",
  resetPassFail: "Reset Password fail",
};
module.exports.depositStatus = {
  new: "000",
  approve: "200",
  reject: "300",
};
module.exports.withdraw = {
  memberStatus: {
    normal: "0",
    lock: "1",
    expired: "2",
  },
  insertOne: {
    success: "1",
  },
  updateOne: {
    success: "1",
  },
  moreLength: 0,
  positionMain: 0,
  status: {
    new: "000",
    approve: "200",
    reject: "300",
  },
};
