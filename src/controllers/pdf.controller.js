const pdfDocument = require("pdfkit");
const documentModel = require("../models/documents.model");

const generatePdf = async (req, res) => {
  try {
    const document = new pdfDocument({size: 'a4'});
    const { id } = req.params;
    const doc = await documentModel.getSingleDocument(id);
    console.log(doc.rows[0]);
    let filename = encodeURIComponent(doc.rows[0].title) + '.pdf';
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    const content = doc.rows[0].content;
    document.y = 300
    document.text(content);
    document.pipe(res);
    document.end()
    // res.status(200).json({
    //     msg: 'Succes create pdf'
    // });
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