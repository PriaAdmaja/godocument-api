const documentModels = require("../models/documents.model");

const createDocument = async (req, res) => {
  try {
    const { id } = req.authInfo;
    const result = await documentModels.createDocument(req.body, id);
    console.log(result.rows[0]);
    res.status(200).json({
      msg: "Create new document",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getAllDocument = async (req, res) => {
  try {
    const result = await documentModels.getAllDocument(req.query);
    if(!result.rows[0]) {
        return res.status(200).json({
            msg: 'Data not founds',
            data: []
        });
    };
    const meta = await documentModels.getMetaAllDocument(req.query);
    res.status(200).json({
        msg: "Succes get data",
        meta,
        data: result.rows
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  };
};

module.exports = {
  createDocument,
  getAllDocument
};
