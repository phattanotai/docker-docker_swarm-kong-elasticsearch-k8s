const ObjectID = require('mongodb').ObjectID;
const model = require('../models/memberDetail.model');
const dbbase = require('../../../config/db-conn');

module.exports.getDdlParameter = jsonData => {
    return new Promise((resolve, reject) => {
        try {
            if (jsonData) {
                let macthData = {};
                if (check_null(jsonData.ou_id) || check_null(jsonData.prog_module) || check_null(jsonData.param_name)) {
                    macthData.$and = [];
                }
                if (jsonData.ou_id) {
                    macthData.$and.push({
                        ou_id: ObjectID(jsonData.ou_id)
                    });
                }
                if (jsonData.prog_module) {
                    macthData.$and.push({
                        prog_module: jsonData.prog_module
                    });
                }
                if (jsonData.param_name) {
                    macthData.$and.push({
                        param_name: jsonData.param_name
                    });
                };
                resolve(macthData);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.tabWithdrawTabel = jsonData => {
    return new Promise((resolve, reject) => {
        try {
            if (jsonData) {
                let macthData = {};
                if (check_null(jsonData.dateFrom) || check_null(jsonData.dateTo)) {
                    macthData.$and = [];
                }
                if (jsonData.status) {
                    macthData.$and.push({
                        status: jsonData.status
                    });
                };
                if (jsonData.dateFrom && jsonData.dateTo) {
                    let dateFrom = new Date(jsonData.dateFrom);
                    let dateTo = new Date(jsonData.dateTo);
                    macthData.$and.push({
                        doc_date: { $gte: dateFrom, $lte: dateTo }
                    });
                } else if (jsonData.dateFrom) {
                    let dateFrom = new Date(jsonData.dateFrom);
                    macthData.$and.push({
                        doc_date: { $gte: dateFrom }
                    });
                } else if (jsonData.dateTo) {
                    let dateTo = new Date(jsonData.dateTo);
                    macthData.$and.push({
                        doc_date: { $lte: dateTo }
                    });
                }
                resolve(macthData)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        };
    });
};

module.exports.tabDepositTabel = jsonData => {
    return new Promise((resolve, reject) => {
        try {
            if (jsonData) {
                let macthData = {};
                if (check_null(jsonData.dateFrom) || check_null(jsonData.dateTo)) {
                    macthData.$and = [];
                }
                if (jsonData.status) {
                    macthData.$and.push({
                        status: jsonData.status
                    });
                };
                if (jsonData.dateFrom && jsonData.dateTo) {
                    let dateFrom = new Date(jsonData.dateFrom);
                    let dateTo = new Date(jsonData.dateTo);
                    macthData.$and.push({
                        doc_date: { $gte: dateFrom, $lte: dateTo }
                    });
                } else if (jsonData.dateFrom) {
                    let dateFrom = new Date(jsonData.dateFrom);
                    macthData.$and.push({
                        doc_date: { $gte: dateFrom }
                    });
                } else if (jsonData.dateTo) {
                    let dateTo = new Date(jsonData.dateTo);
                    macthData.$and.push({
                        doc_date: { $lte: dateTo }
                    });
                }
                resolve(macthData)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        };
    });
};

module.exports.tabStatementTabel = jsonData => {
    return new Promise((resolve, reject) => {
        try {
            if (jsonData) {
                let macthData = {};
                if (check_null(jsonData.dateFrom) || check_null(jsonData.dateTo)) {
                    macthData.$and = [];
                }
                if (jsonData.status) {
                    macthData.$and.push({
                        status: jsonData.status
                    });
                };
                if (jsonData.dateFrom && jsonData.dateTo) {
                    let dateFrom = new Date(jsonData.dateFrom);
                    let dateTo = new Date(jsonData.dateTo);
                    macthData.$and.push({
                        doc_date: { $gte: dateFrom, $lte: dateTo }
                    });
                } else if (jsonData.dateFrom) {
                    let dateFrom = new Date(jsonData.dateFrom);
                    macthData.$and.push({
                        doc_date: { $gte: dateFrom }
                    });
                } else if (jsonData.dateTo) {
                    let dateTo = new Date(jsonData.dateTo);
                    macthData.$and.push({
                        doc_date: { $lte: dateTo }
                    });
                }
                resolve(macthData)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        };
    });
};

function check_null(param) {
    if (param !== '' && typeof param !== 'undefined' && typeof param !== null) {
        return true;
    } else {
        return false;
    }
}

