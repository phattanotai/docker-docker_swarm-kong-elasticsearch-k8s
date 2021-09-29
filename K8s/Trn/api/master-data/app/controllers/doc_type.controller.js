const httpCode = require("../../../constants/httpStatusCodes");
const model = require("../models/doc_type.model");
const jwt = require("jsonwebtoken");
const fs = require("../../../constants/functionUtil");
const fx = require("../functions/doc_type.function");

module.exports.renderDdlDocType = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    let data = await model.renderDdlDocType(payload, request.body);
    if (data && data.length) {
      httpCode.doc_tpye.findDataSuccess.data = data;
      response.send(httpCode.doc_tpye.findDataSuccess);
    } else {
      httpCode.doc_tpye.findDataNotFound.data = [];
      response.send(httpCode.doc_tpye.findDataNotFound);
    }
  } catch (error) {
    response.send(httpCode.doc_tpye.serverError);
  }
};

module.exports.addDocType = async (request, response) => {
  try {
    const payload = await fs.getUserData(request, jwt);
    const findDocAbb = await model.findDocAbb(payload, request.body);
    if (findDocAbb && findDocAbb.length) {
      response.send(httpCode.doc_tpye.documentRepeatInsert);
    } else {
      const insertDocType = await model.addDocType(payload, request.body);
      if (insertDocType.insertedCount == "1") {
        response.send(httpCode.doc_tpye.insertDataSuccess);
      } else {
        response.send(httpCode.doc_tpye.insertDataFail);
      }
    }
  } catch (error) {
    response.send(httpCode.doc_tpye.serverError);
  }
};

module.exports.searchDocType = async (request, response) => {
  try {
    let payload = await fs.getUserData(request, jwt);
    let matchData = await fx.searchDocType(payload, request.body);
    let query = await model.searchDocType(payload, matchData);
    if (query && query.length > 0) {
      httpCode.doc_tpye.findDataSuccess.data = query;
      response.send(httpCode.doc_tpye.findDataSuccess);
    } else {
      response.send(httpCode.doc_tpye.findDataNotFound);
    }
  } catch (error) {
    response.send(httpCode.doc_tpye.serverError);
  }
};

module.exports.updateDocType = async (request, response) => {
  try {
    let payload = await fs.getUserData(request, jwt);
    const findDocAbb = await model.findDocAbb(payload, request.body);
    if (findDocAbb && findDocAbb.length) {
      response.send(httpCode.doc_tpye.documentRepeatUpdate);
    } else {
      let update = await model.updateDocType(payload, request.body);
      if (update.matchedCount == "1") {
        response.send(httpCode.doc_tpye.updateDataSuccess);
      } else {
        response.send(httpCode.doc_tpye.updateDataFail);
      }
    }
  } catch (error) {
    response.send(httpCode.doc_tpye.serverError);
  }
};
