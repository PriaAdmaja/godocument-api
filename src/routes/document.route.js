const { Router } = require('express');
const documentRoute = Router();

const documentController = require('../controllers/document.controller');
const authentication = require('../middleware/authentication');

documentRoute.patch('/:id', authentication.checkToken, documentController.editDocument);
documentRoute.post('/', authentication.checkToken, documentController.createDocument);
documentRoute.get('/', authentication.checkToken, documentController.getAllDocument);

module.exports = documentRoute;