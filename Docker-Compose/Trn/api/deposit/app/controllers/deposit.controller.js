const jwt = require('jsonwebtoken');
const model = require('../models/deposit.model');
const fx = require('../functions/deposit.function');
const httpStatusCodes = require('../../../constants/httpStatusCodes');
const mongoUnity = require('../../config/mongoUnity');
const { depositStatus } = require('../../../constants/constantsVariable');
const fs = require('../../../constants/functionUtil');

// GET DATA DEPOSIT FROM SEARCH
module.exports.getDeposit = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const queryData = await fx.getDeposit(payload, request.body);
    const modelSet = await model.getDeposit(queryData);
    const resultDeposit = await mongoUnity.aggregate(modelSet.collection, modelSet.query);
    if (resultDeposit) {
      response.send({
        statusCode: httpStatusCodes.deposit.getDepositTransitionSuccess.code,
        statusText: httpStatusCodes.deposit.getDepositTransitionSuccess.description,
        data: resultDeposit,
      });
    } else {
      response.send({
        statusCode: httpStatusCodes.deposit.getDepositTransitionSuccess.code,
        statusText: httpStatusCodes.deposit.getDepositTransitionSuccess.description,
        data: resultDeposit,
      });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// GET DATA STATUS
module.exports.getDepositImageBill = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const modelSet = await model.getDepositImageBill(payload, request);
    const resultDeposit = await mongoUnity.aggregate(modelSet.collection, modelSet.query);
    if (resultDeposit) {
      response.send({
        statusCode: httpStatusCodes.deposit.getDepositTransitionSuccess.code,
        statusText: httpStatusCodes.deposit.getDepositTransitionSuccess.description,
        data: resultDeposit,
      });
    } else {
      response.send({
        statusCode: httpStatusCodes.deposit.getDepositTransitionSuccess.code,
        statusText: httpStatusCodes.deposit.getDepositTransitionSuccess.description,
        data: resultDeposit,
      });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// GET DATA MEMBER FROM SEARCH MODAL
module.exports.getSearchUsername = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const modelSet = await model.getSearchUsername(payload, request.body);
    const resultDeposit = await mongoUnity.aggregate(modelSet.collection, modelSet.query);
    if (resultDeposit) {
      response.send({ statusCode: httpStatusCodes.Success.ok.code, statusText: httpStatusCodes.Success.ok.description, data: resultDeposit });
    } else {
      response.send({ statusCode: httpStatusCodes.Success.noContent.code, statusText: httpStatusCodes.Success.ok.description, data: resultDeposit });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// GET DATA BANK MODAL
module.exports.getDepositBank = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const modelSet = await model.getDepositBank(payload);
    const resultDeposit = await mongoUnity.aggregate(modelSet.collection, modelSet.query);
    if (resultDeposit) {
      response.send({ statusCode: httpStatusCodes.Success.ok.code, statusText: httpStatusCodes.Success.ok.description, data: resultDeposit });
    } else {
      response.send({ statusCode: httpStatusCodes.Success.noContent.code, statusText: httpStatusCodes.Success.ok.description, data: resultDeposit });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// GET DATA STATUS
module.exports.getDepositStatus = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const modelSet = await model.getDepositStatus(payload);
    const resultDeposit = await mongoUnity.aggregate(modelSet.collection, modelSet.query);
    if (resultDeposit) {
      response.send({ statusCode: httpStatusCodes.Success.ok.code, statusText: httpStatusCodes.Success.ok.description, data: resultDeposit });
    } else {
      response.send({ statusCode: httpStatusCodes.Success.noContent.code, statusText: httpStatusCodes.Success.ok.description, data: resultDeposit });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// INSERT DEPOSIT
module.exports.insertDepositTransaction = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);

    const modelDocument = await model.getDocType(payload);
    const resultDocument = await mongoUnity.aggregate(modelDocument.collection, modelDocument.query);
    const modelSet = await model.insertDepositTransaction(payload, request, resultDocument[0]);
    const resultDeposit = await mongoUnity.insertOne(modelSet.collection, modelSet.data);
    if (resultDeposit.ops) {
      response.send({
        statusCode: httpStatusCodes.deposit.insertDepositTransitionSuccess.code,
        statusText: httpStatusCodes.deposit.insertDepositTransitionSuccess.description,
        data: resultDeposit,
      });
    } else {
      response.send({
        statusCode: httpStatusCodes.deposit.insertDepositTransitionFail.code,
        statusText: httpStatusCodes.deposit.insertDepositTransitionFail.description,
        data: resultDeposit.ops,
      });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// UPDATE DEPOSIT
module.exports.editDeposit = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const modelSet = await model.editDeposit(payload, request);
    const resultDeposit = await mongoUnity.updateOne(modelSet.collection, modelSet.query, modelSet.set);
    if (resultDeposit) {
      response.send({
        statusCode: httpStatusCodes.deposit.updateDepositSuccess.code,
        statusText: httpStatusCodes.deposit.updateDepositSuccess.description,
        data: resultDeposit,
      });
    } else {
      response.send({
        statusCode: httpStatusCodes.deposit.updateDepositFail.code,
        statusText: httpStatusCodes.updateDepositFail.description,
        data: resultDeposit,
      });
    }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
// UPDATE DEPOSIT STATUS
module.exports.updateDepositStatus = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    // CHECK MEMBER QUEUE
    // const memberQueueModel = await model.memberQueue(payload, request);
    // const memberQueueResult = await fx.memberQueue(memberQueueModel);
    // console.log(memberQueueResult);
    // if (memberQueueResult.status) {
      const updateDepositStatusFx = await fx.updateDepositStatus(payload, request);
      // CHECK STATUS NEW
      const depositStatusModel = await model.getDepositStatusRecord(payload, request);
      const depositStatusResult = await mongoUnity.aggregate(depositStatusModel.collection, depositStatusModel.query);
      if (depositStatusResult[0].status === depositStatus.new) {
        if (updateDepositStatusFx.status === depositStatus.approve) {
          // FIND FIRST WALLET TRANSITION
          const findWalletTransitionModel = await model.findWalletTransition(payload, request);
          const findWalletTransitionResult = await mongoUnity.aggregate(findWalletTransitionModel.collection, findWalletTransitionModel.query);
          // INSERT WALLET TRANSITION
          const insertWalletTransitionModel = await model.insertWalletTransition(payload, request, findWalletTransitionResult[0]);
          const insertWalletTransitionResult = await mongoUnity.insertOne(insertWalletTransitionModel.collection, insertWalletTransitionModel.data);
          if (insertWalletTransitionResult.insertedCount === 1) {
            // CHECK WALLET MAIN
            const walletMainModel = await model.findWallet(payload, insertWalletTransitionResult.ops[0]);
            const walletMainResult = await mongoUnity.aggregate(walletMainModel.collection, walletMainModel.query);
            if (walletMainResult.length) {
              // UPDATE BALANCE WALLET MAIN
              const updateBalanceWalletModel = await model.updateBalanceWallet(payload, insertWalletTransitionResult.ops[0], walletMainResult[0]);
              const updateBalanceWalletResult = await mongoUnity.updateOne(
                updateBalanceWalletModel.collection,
                updateBalanceWalletModel.query,
                updateBalanceWalletModel.set
              );
              if (updateBalanceWalletResult.modifiedCount === 1) {
                // UPDATE STATUS DEPOSIT
                const depositUpdateStatusModel = await model.updateDepositStatus(updateDepositStatusFx);
                const depositUpdateStatusResult = await mongoUnity.updateOne(
                  depositUpdateStatusModel.collection,
                  depositUpdateStatusModel.query,
                  depositUpdateStatusModel.set
                );
                if (depositUpdateStatusResult.modifiedCount === 1) {
                  response.send({
                    statusCode: httpStatusCodes.deposit.updateStatusDepositSuccess.code,
                    statusText: httpStatusCodes.deposit.updateStatusDepositSuccess.description,
                    data: depositUpdateStatusResult,
                  });
                } else {
                  // FIND FIRST WALLET TRANSITION
                  const findWalletTransitionModelAgain = await model.findWalletTransition(payload, request);
                  const findWalletTransitionResultAgain = await mongoUnity.aggregate(
                    findWalletTransitionModelAgain.collection,
                    findWalletTransitionModelAgain.query
                  );
                  // REJECT WALLET TRANSITION
                  const insertWalletTransitionModel = await model.insertWalletTransitionFail(payload, request, findWalletTransitionResultAgain[0]);
                  const insertWalletTransitionResult = await mongoUnity.insertOne(
                    insertWalletTransitionModel.collection,
                    insertWalletTransitionModel.data
                  );
                  if (insertWalletTransitionResult.insertedCount === 1) {
                    // CHECK WALLET MAIN
                    const walletMainModel = await model.findWallet(payload, insertWalletTransitionResult.ops[0]);
                    const walletMainResult = await mongoUnity.aggregate(walletMainModel.collection, walletMainModel.query);
                    if (walletMainResult.length) {
                      // UPDATE BALANCE WALLET MAIN
                      const updateBalanceWalletModel = await model.updateBalanceWallet(
                        payload,
                        insertWalletTransitionResult.ops[0],
                        walletMainResult[0]
                      );
                      const updateBalanceWalletResult = await mongoUnity.updateOne(
                        updateBalanceWalletModel.collection,
                        updateBalanceWalletModel.query,
                        updateBalanceWalletModel.set
                      );
                    }
                  } else {
                    response.send({
                      statusCode: httpStatusCodes.deposit.updateStatusDepositFail.code,
                      statusText: httpStatusCodes.deposit.updateStatusDepositFail.description,
                      data: depositUpdateStatusResult,
                    });
                  }
                }
              } else {
                // FIND FIRST WALLET TRANSITION
                const findWalletTransitionModelAgain = await model.findWalletTransition(payload, request);
                const findWalletTransitionResultAgain = await mongoUnity.aggregate(
                  findWalletTransitionModelAgain.collection,
                  findWalletTransitionModelAgain.query
                );
                // REJECT WALLET TRANSITION
                const insertWalletTransitionModel = await model.insertWalletTransitionFail(payload, request, findWalletTransitionResultAgain[0]);
                const insertWalletTransitionResult = await mongoUnity.insertOne(
                  insertWalletTransitionModel.collection,
                  insertWalletTransitionModel.data
                );
                if (insertWalletTransitionResult.insertedCount === 1) {
                } else {
                  response.send({
                    statusCode: httpStatusCodes.deposit.insertWalletTransitionFail.code,
                    statusText: httpStatusCodes.deposit.insertWalletTransitionFail.description,
                    data: insertWalletTransitionResult,
                  });
                }
                response.send({
                  statusCode: httpStatusCodes.deposit.updateWalletBalanceFail.code,
                  statusText: httpStatusCodes.deposit.updateWalletBalanceFail.description,
                  data: updateBalanceWalletResult,
                });
              }
            }
          } else {
            response.send({
              statusCode: httpStatusCodes.deposit.findWalletFail.code,
              statusText: httpStatusCodes.deposit.findWalletFail.description,
              data: insertWalletTransitionResult,
            });
          }
        } else {
          // UPDATE STATUS DEPOSIT
          const depositUpdateStatusModel = await model.updateDepositStatus(updateDepositStatusFx);
          const depositUpdateStatusResult = await mongoUnity.updateOne(
            depositUpdateStatusModel.collection,
            depositUpdateStatusModel.query,
            depositUpdateStatusModel.set
          );
          if (depositUpdateStatusResult.modifiedCount === 1) {
            response.send({
              statusCode: httpStatusCodes.deposit.updateStatusDepositSuccess.code,
              statusText: httpStatusCodes.deposit.updateStatusDepositSuccess.description,
              data: depositUpdateStatusResult,
            });
          } else {
            response.send({
              statusCode: httpStatusCodes.deposit.updateStatusDepositFail.code,
              statusText: httpStatusCodes.deposit.updateStatusDepositFail.description,
              data: depositUpdateStatusResult,
            });
          }
        }
      } else {
        response.send({
          statusCode: httpStatusCodes.deposit.updateStatusDepositFail.code,
          statusText: httpStatusCodes.deposit.updateStatusDepositFail.description,
          data: depositStatusResult,
        });
      }
      const deleteMemberQueueModel = await model.deleteMemberQueue(payload, request);
      const deleteMemberQueueResult = await mongoUnity.deleteOne(deleteMemberQueueModel.collection, deleteMemberQueueModel.query);
    // } else {
    //   if (memberQueueResult.err === 11000) {
    //     response.send('222222');
    //   }
    // }
  } catch (error) {
    console.error(error);
    response.send({ statusCode: httpStatusCodes.Fail.err.code, statusText: httpStatusCodes.Fail.err.description });
  }
};
