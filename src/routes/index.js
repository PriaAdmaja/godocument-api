const { Router } = require('express');

const masterRouter = Router();

const homeRoute = require('./home.route');
const usersRoute = require('./users.route')

masterRouter.use("/", homeRoute);
masterRouter.use("/users", usersRoute);

module.exports = masterRouter