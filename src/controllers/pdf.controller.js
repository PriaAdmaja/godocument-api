const pdfDocument = require("pdfkit");
const documentModel = require("../models/documents.model");

const generatePdf = async (req, res) => {
  try {
    const document = new pdfDocument({size: 'a4'});
    const { id } = req.params;
    const doc = await documentModel.getSingleDocument(id);
    let filename = encodeURIComponent(doc.rows[0].title) + '.pdf';
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    const content = doc.rows[0].content;
    document.text(content);
    document.pipe(res);
    document.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

module.exports = {
    generatePdf
}