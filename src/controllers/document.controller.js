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
  };
};

module.exports = {
    createDocument
}
