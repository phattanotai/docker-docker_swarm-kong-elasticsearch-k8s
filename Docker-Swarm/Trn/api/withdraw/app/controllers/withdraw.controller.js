const modal = require("../models/withdraw.modal");
const fx = require("../functions/withdraw.function");
const jwt = require("jsonwebtoken");
const fs = require("../../../constants/functionUtil");
const httpStatus = require("../../../constants/httpStatusCodes");
const stTxt = require("../../../constants/constantsVariable");

module.exports.renderDdlParameter = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let data = await modal.renderDdlParameter(payload, request.body);
    httpStatus.withdraw.success.data = data;
    response.send(httpStatus.withdraw.success);
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.searchWithdraw = async (request, response) => {
  try {
    let prepareData = await fx.searchWithdraw(request.body);
    let data = await modal.searchWithdraw(prepareData);
    httpStatus.withdraw.success.data = data;
    response.send(httpStatus.withdraw.success);
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.searchUsername = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let data = await modal.searchUsername(payload, request.body);
    if (data && data.length) {
      let status = data[0].status;
      if (status == stTxt.withdraw.memberStatus.normal) {
        httpStatus.withdraw.success.data = data;
        response.send(httpStatus.withdraw.success);
      } else if (status == stTxt.withdraw.memberStatus.lock) {
        httpStatus.withdraw.success.data = [];
        response.send(httpStatus.withdraw.memberLock);
      } else if (status == stTxt.withdraw.memberStatus.expired) {
        httpStatus.withdraw.success.data = [];
        response.send(httpStatus.withdraw.memberExpired);
      }
    } else {
      httpStatus.withdraw.success.data = data;
      response.send(httpStatus.withdraw.noContent);
    }
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.addWithdraw = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let checkMember = await modal.checkMember(payload, request.body);
    if (checkMember && checkMember.length) {
      let checkBalance = await modal.checkBalance(payload, request.body);
      if (checkBalance && checkBalance.length) {
        let findDocTypeWithdraw = await modal.findDocTypeWithdraw(payload);
        if (findDocTypeWithdraw && findDocTypeWithdraw.length) {
          let insertWithdraw = await modal.insertWithdrawTransaction(
            payload,
            request.body,
            findDocTypeWithdraw[stTxt.withdraw.positionMain]
          );
          if (
            insertWithdraw.insertedCount == stTxt.withdraw.insertOne.success
          ) {
            let insertWallet = await modal.insertWalletTransaction(
              payload,
              request.body,
              insertWithdraw.insertedId,
              checkBalance[stTxt.withdraw.positionMain],
              findDocTypeWithdraw[stTxt.withdraw.positionMain]
            );
            if (
              insertWallet.insertedCount == stTxt.withdraw.insertOne.success
            ) {
              let updateWallet = await modal.updateMainWallet(
                payload,
                request.body,
                checkBalance[stTxt.withdraw.positionMain]
              );
              if (
                updateWallet.matchedCount == stTxt.withdraw.updateOne.success
              ) {
                httpStatus.withdraw.insertDataSuccess.data = [];
                response.send(httpStatus.withdraw.insertDataSuccess);
              } else {
                let insertRefundWalletTransaction = await modal.insertRefundWalletTransaction(
                  payload,
                  request.body,
                  insertWithdraw.insertedId,
                  checkBalance[stTxt.withdraw.positionMain],
                  findDocTypeWithdraw[stTxt.withdraw.positionMain]
                );
                let updateInsertWithdrawTransactionReject = await modal.updateInsertWithdrawTransactionReject(
                  payload,
                  insertWithdraw.insertedId
                );
                if (
                  insertRefundWalletTransaction.insertedCount ==
                    stTxt.withdraw.insertOne.success &&
                  updateInsertWithdrawTransactionReject.matchedCount ==
                    stTxt.withdraw.updateOne.success
                ) {
                  httpStatus.withdraw.updateMainWalletFail.data = [];
                  response.send(httpStatus.withdraw.updateMainWalletFail);
                } else {
                  httpStatus.withdraw.criticalUpdateWallet.data = [];
                  response.send(httpStatus.withdraw.criticalUpdateWallet);
                }
              }
            } else {
              let updateInsertWithdrawTransactionReject = await modal.updateInsertWithdrawTransactionReject(
                payload,
                insertWithdraw.insertedId
              );
              if (
                updateInsertWithdrawTransactionReject.matchedCount ==
                stTxt.withdraw.updateOne.success
              ) {
                httpStatus.withdraw.insertWalletTransactionFail.data = [];
                response.send(httpStatus.withdraw.insertWalletTransactionFail);
              } else {
                httpStatus.withdraw.criticalUpdateWithdraw.data = [];
                response.send(httpStatus.withdraw.criticalUpdateWithdraw);
              }
            }
          } else {
            httpStatus.withdraw.insertWithTransactionFail.data = [];
            response.send(httpStatus.withdraw.insertWithTransactionFail);
          }
        } else {
          response.send(httpStatus.withdraw.findDocNotFound);
        }
      } else {
        httpStatus.withdraw.balanceLessAmount.data = [];
        response.send(httpStatus.withdraw.balanceLessAmount);
      }
    } else {
      httpStatus.withdraw.findMemberNotFound.data = [];
      response.send(httpStatus.withdraw.findMemberNotFound);
    }
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.findWallet = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let result = await modal.findWallet(payload, request.body);
    if (result && result.length > stTxt.withdraw.moreLength) {
      httpStatus.withdraw.findDataSuccess.data = result;
      response.send(httpStatus.withdraw.findDataSuccess);
    } else {
      httpStatus.withdraw.findDataNotFound.data = result;
      response.send(httpStatus.withdraw.findDataNotFound);
    }
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.approveWithdraw = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let checkMember = await modal.checkMember(payload, request.body);
    if (checkMember && checkMember.length) {
      let checkStatus = await modal.checkStatus(payload, request.body);
      if (checkStatus && checkStatus.length) {
        let status = checkStatus[stTxt.withdraw.positionMain].status;
        if (status == stTxt.withdraw.status.new) {
          let statusMember = checkMember[stTxt.withdraw.positionMain].status;
          if (statusMember == stTxt.withdraw.memberStatus.normal) {
            let update = await modal.updateApprove(payload, request.body);
            if (update.matchedCount == stTxt.withdraw.updateOne.success) {
              response.send(httpStatus.withdraw.updateDataSuccess);
            } else {
              response.send(httpStatus.withdraw.updateDataFail);
            }
          } else if (statusMember == stTxt.withdraw.memberStatus.lock) {
            response.send(httpStatus.withdraw.memberLock);
          } else if (statusMember == stTxt.withdraw.memberStatus.expired) {
            response.send(httpStatus.withdraw.memberExpired);
          } else {
            response.send(httpStatus.withdraw.memberNotNormal);
          }
        } else if (status == stTxt.withdraw.status.approve) {
          response.send(httpStatus.withdraw.approved);
        } else if (status == stTxt.withdraw.status.reject) {
          response.send(httpStatus.withdraw.rejected);
        } else {
          response.send(httpStatus.withdraw.findStatusNotFound);
        }
      } else {
        response.send(httpStatus.withdraw.findStatusNotFound);
      }
    } else {
      response.send(httpStatus.withdraw.findMemberNotFound);
    }
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.rejectWithdraw = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let checkStatus = await modal.checkStatus(payload, request.body);
    if (checkStatus && checkStatus.length) {
      let status = checkStatus[stTxt.withdraw.positionMain].status;
      if (status == stTxt.withdraw.status.new) {
        let findDocTypeWithdraw = await modal.findDocTypeWithdraw(payload);
        if (findDocTypeWithdraw && findDocTypeWithdraw.length) {
          let findWallet = await modal.findWalletRejectWithdraw(
            payload,
            request.body
          );
          if (findWallet && findWallet.length) {
            let insertWalletTransaction = await modal.insertRejectWalletTransaction(
              payload,
              request.body,
              findWallet[stTxt.withdraw.positionMain],
              findDocTypeWithdraw[stTxt.withdraw.positionMain]
            );
            if (
              insertWalletTransaction.insertedCount ==
              stTxt.withdraw.insertOne.success
            ) {
              let updateWalletMain = await modal.updateRejectMainWallet(
                payload,
                request.body,
                findWallet[stTxt.withdraw.positionMain]
              );
              if (
                updateWalletMain.matchedCount ==
                stTxt.withdraw.updateOne.success
              ) {
                let updateReject = await modal.updateReject(
                  payload,
                  request.body
                );
                if (
                  updateReject.matchedCount == stTxt.withdraw.updateOne.success
                ) {
                  response.send(httpStatus.withdraw.updateDataSuccess);
                } else {
                  let insertRejectRefundWalletTransaction = await modal.insertRejectRefundWalletTransaction(
                    payload,
                    request.body,
                    findWallet[stTxt.withdraw.positionMain],
                    findDocTypeWithdraw[stTxt.withdraw.positionMain]
                  );
                  let updateWalletMainWhenErr = await modal.updateRejectMainWalletWhenTansactionFail(
                    payload,
                    request.body,
                    findWallet[stTxt.withdraw.positionMain]
                  );
                  if (
                    insertRejectRefundWalletTransaction.insertedCount ==
                      stTxt.withdraw.insertOne.success &&
                    updateWalletMainWhenErr.matchedCount ==
                      stTxt.withdraw.updateOne.success
                  ) {
                    response.send(httpStatus.withdraw.updateTransactionFail);
                  } else {
                    response.send(
                      httpStatus.withdraw.criticalRejectUpdateTransactionFail
                    );
                  }
                }
              } else {
                let insertRejectRefundWalletTransaction = await modal.insertRejectRefundWalletTransaction(
                  payload,
                  request.body,
                  findWallet[stTxt.withdraw.positionMain],
                  findDocTypeWithdraw[stTxt.withdraw.positionMain]
                );
                if (
                  insertRejectRefundWalletTransaction.insertedCount ==
                  stTxt.withdraw.insertOne.success
                ) {
                  response.send(httpStatus.withdraw.updateMainWalletFail);
                } else {
                  response.send(
                    httpStatus.withdraw.criticalRejectInsertWalletFail
                  );
                }
              }
            } else {
              response.send(httpStatus.withdraw.insertWalletTransactionFail);
            }
          } else {
            response.send(httpStatus.withdraw.findWalletMainFail);
          }
        } else {
          response.send(httpStatus.withdraw.findDocNotFound);
        }
      } else if (status == stTxt.withdraw.status.approve) {
        response.send(httpStatus.withdraw.approved);
      } else if (status == stTxt.withdraw.status.reject) {
        response.send(httpStatus.withdraw.rejected);
      } else {
        response.send(httpStatus.withdraw.findStatusNotFound);
      }
    } else {
      response.send(httpStatus.withdraw.findStatusNotFound);
    }
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};

module.exports.searchUserEvent = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let data = await modal.searchUserEvent(payload, request.body);
    if (data && data.length) {
      let status = data[stTxt.withdraw.positionMain].status;
      if (status == stTxt.withdraw.memberStatus.normal) {
        httpStatus.withdraw.findDataSuccess.data = data;
        response.send(httpStatus.withdraw.findDataSuccess);
      } else if (status == stTxt.withdraw.memberStatus.lock) {
        httpStatus.withdraw.memberLock.data = data;
        response.send(httpStatus.withdraw.memberLock);
      } else if (status == stTxt.withdraw.memberStatus.expired) {
        httpStatus.withdraw.memberExpired.data = data;
        response.send(httpStatus.withdraw.memberExpired);
      } else {
        httpStatus.withdraw.memberNotNormal.data = [];
        response.send(httpStatus.withdraw.memberNotNormal);
      }
    } else {
      httpStatus.withdraw.findDataSuccess.data = [];
      response.send(httpStatus.withdraw.findDataNotFound);
    }
  } catch (error) {
    response.send(httpStatus.withdraw.serverError);
  }
};
