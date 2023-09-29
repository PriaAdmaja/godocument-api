const { Router } = require('express');

const masterRouter = Router();

const homeRoute = require('./home.route');
const usersRoute = require('./users.route');
const documentRoute = require('./document.route');
const feedbackRoute = require('./feedback.route')

masterRouter.use("/users", usersRoute);
masterRouter.use("/documents", documentRoute);
masterRouter.use("/feedback", feedbackRoute);
masterRouter.use("/", homeRoute);

module.exports = masterRouter;