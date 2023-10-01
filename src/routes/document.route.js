const { Router } = require('express');
const documentRoute = Router();

const documentController = require('../controllers/document.controller');
const pdfController = require('../controllers/pdf.controller')
const authentication = require('../middleware/authentication');

documentRoute.patch('/:id', authentication.checkToken, documentController.editDocument);
documentRoute.post('/', authentication.checkToken, documentController.createDocument);
documentRoute.get('/pdf/:id', pdfController.generatePdf);
documentRoute.get('/:id', authentication.checkToken, documentController.getSingleDocument)
documentRoute.delete('/:id', authentication.checkToken, documentController.deleteDocument)
documentRoute.get('/', authentication.checkToken, documentController.getAllDocument);

module.exports = documentRoute;