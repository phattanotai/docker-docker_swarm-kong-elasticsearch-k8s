const ObjectID = require("mongodb").ObjectID;
module.exports.searchDocType = (payload, jsonData) => {
  return new Promise((resolve, reject) => {
    try {
      if (jsonData) {
        let matchData = {};
        if (jsonData.docName || jsonData.docDesc || jsonData.active) {
          matchData.$and = [
            {
              ou_id: ObjectID(payload.ou_id),
            },
          ];
        } else {
          matchData = { ou_id: ObjectID(payload.ou_id) };
        }
        if (jsonData.docName) {
          matchData.$and.push({
            doc_type_name: {
              $regex: jsonData.docName,
              $options: "i",
            },
          });
        }
        if (jsonData.docDesc) {
          matchData.$and.push({
            doc_desc: {
              $regex: jsonData.docDesc,
              $options: "i",
            },
          });
        }
        if (jsonData.active) {
          matchData.$and.push({
            active: jsonData.active,
          });
        }
        resolve(matchData);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
