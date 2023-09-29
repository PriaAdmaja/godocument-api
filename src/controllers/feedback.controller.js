const feedbackModels = require("../models/feedback.model");
const documentModels = require("../models/documents.model");

const createFeedback = async (req, res) => {
  try {
    const { body, authInfo } = req;
    const { documentId, comment } = body;
    if (!documentId && !comment) {
      return res.status(405).json({
        msg: "Incomplete form",
      });
    }
    const checkDoc = await documentModels.getSingleDocument(documentId);
    if (!checkDoc.rows[0]) {
      return res.status(404).json({
        msg: "Document not found!",
      });
    }
    const result = await feedbackModels.createFeedback(body, authInfo.id);
    res.status(200).json({
      msg: "Create new feedback",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const getFeedbackByUserId = async (req, res) => {
  try {
    const { id } = req.authInfo;
    const result = await feedbackModels.getFeedbackByUsersId(id);
    res.status(200).json({
      msg: "Succes get Data",
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await feedbackModels.deleteFeedback(id);
    res.status(200).json({
      msg: "Success delete feedback",
      feedbackId: id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByUserId,
  deleteFeedback
};
