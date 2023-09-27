const { Router } = require('express');

const masterRouter = Router();

const homeRoute = require('./home.route');

masterRouter.use("/", homeRoute)

module.exports = masterRouter