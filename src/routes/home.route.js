const { Router } = require('express');

const homeRoute = Router();
const homeController = require('../controllers/home.controller');

homeRoute.get("/", homeController.home);

module.exports = homeRoute