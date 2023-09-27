const { Router } = require('express');

const usersRoute = Router();
const usersController = require('../controllers/users.controller');

usersRoute.post('/register', usersController.createUsers);
usersRoute.post('/login', usersController.login);

module.exports = usersRoute;