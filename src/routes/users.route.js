const { Router } = require('express');

const usersRoute = Router();
const usersController = require('../controllers/users.controller');

usersRoute.post('/register', usersController.createUsers);
usersRoute.post('/login', usersController.login);
usersRoute.patch('/:id', usersController.editUsers)
usersRoute.patch('/changepassword/:id', usersController.editPassword)

module.exports = usersRoute;