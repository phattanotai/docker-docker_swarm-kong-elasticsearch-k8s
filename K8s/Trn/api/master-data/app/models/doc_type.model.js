const ObjectID = require("mongodb").ObjectID;
const mongodb = require("../../config/mongodb");

module.exports.renderDdlDocType = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("su_parameter")
      .aggregate([
        {
          $match: {
            ou_id: ObjectID(payload.ou_id),
            prog_module: params.module,
            param_name: params.name,
            active: params.active,
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.addDocType = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("db_document_type")
      .insertOne({
        ou_id: ObjectID(payload.ou_id),
        doc_type_name: params.docName,
        doc_abb: params.docAbb,
        doc_desc: params.docDesc,
        active: params.active,
        cr_by: payload.username,
        cr_date: new Date(),
        cr_prog: "master_data",
        upd_by: payload.username,
        upd_date: new Date(),
        upd_prog: "master_data",
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.searchDocType = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("db_document_type")
      .aggregate([
        {
          $match: params,
        },
        {
          $lookup: {
            from: "su_parameter",
            let: {
              ou: ObjectID(payload.ou_id),
              module: "master_data",
              name: "active",
              value: "$active",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$ou_id", "$$ou"] },
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
            doc_type_name: "$doc_type_name",
            doc_abb: "$doc_abb",
            doc_desc: "$doc_desc",
            active: "$active",
            param_desc: "$parameter.param_desc",
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

module.exports.updateDocType = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("db_document_type")
      .updateOne(
        {
          ou_id: ObjectID(payload.ou_id),
          _id: ObjectID(params.docId),
        },
        {
          $set: {
            doc_type_name: params.docName,
            doc_desc: params.docDesc,
            active: params.active,
            upd_by: payload.username,
            upd_date: new Date(),
            upd_prog: "master_data",
          },
        }
      )
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports.findDocAbb = (payload, params) => {
  return new Promise(async (resolve, reject) => {
    await mongodb.db
      .collection("db_document_type")
      .aggregate([
        {
          $match: {
            _id: { $ne: ObjectID(params.docId) },
            ou_id: ObjectID(payload.ou_id),
            doc_abb: params.docAbb,
          },
        },
      ])
      .toArray()
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
