const { Router } = require('express');
const documentRoute = Router();

const documentController = require('../controllers/document.controller');
const authentication = require('../middleware/authentication');

documentRoute.post('/', authentication.checkToken, documentController.createDocument);

module.exports = documentRoute;