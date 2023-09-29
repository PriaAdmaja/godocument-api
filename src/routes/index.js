const { Router } = require('express');

const masterRouter = Router();

const homeRoute = require('./home.route');
const usersRoute = require('./users.route')
const documentRoute = require('./document.route')

masterRouter.use("/", homeRoute);
masterRouter.use("/users", usersRoute);
masterRouter.use("/documents", documentRoute);

module.exports = masterRouter;