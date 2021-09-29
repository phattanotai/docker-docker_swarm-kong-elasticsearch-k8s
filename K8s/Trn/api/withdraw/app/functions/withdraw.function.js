const ObjectID = require("mongodb").ObjectID;

module.exports.searchWithdraw = (jsonData) => {
  return new Promise((resolve, reject) => {
    try {
      if (jsonData) {
        let macthData = {};
        if (
          jsonData.username ||
          jsonData.status ||
          jsonData.dateFrom ||
          jsonData.dateTo
        ) {
          macthData.$and = [];
        }
        if (jsonData.username) {
          macthData.$and.push({
            username: {
              $regex: jsonData.username,
              $options: "i",
            },
          });
        }
        if (jsonData.status) {
          macthData.$and.push({
            status: jsonData.status,
          });
        }
        if (jsonData.dateFrom && jsonData.dateTo) {
          let dateFrom = new Date(jsonData.dateFrom);
          let dateTo = new Date(jsonData.dateTo);
          macthData.$and.push({
            doc_date: { $gte: dateFrom, $lte: dateTo },
          });
        } else if (jsonData.dateFrom) {
          let dateFrom = new Date(jsonData.dateFrom);
          macthData.$and.push({
            doc_date: { $gte: dateFrom },
          });
        } else if (jsonData.dateTo) {
          let dateTo = new Date(jsonData.dateTo);
          macthData.$and.push({
            doc_date: { $lte: dateTo },
          });
        }
        resolve(macthData);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
