const { Router } = require('express');

const usersRoute = Router();
const usersController = require('../controllers/users.controller');
const authentication = require('../middleware/authentication')

usersRoute.post('/register', usersController.createUsers);
usersRoute.post('/login', usersController.login);
usersRoute.post('/logout', authentication.checkToken, usersController.logout)
usersRoute.patch('/editpassword', authentication.checkToken, usersController.editPassword);
usersRoute.get('/private', authentication.checkToken, usersController.privateAccess);
usersRoute.get('/:id', usersController.getUserData);
usersRoute.patch('/requestreset', usersController.reqResetPassword);
usersRoute.patch('/resetpassword', usersController.resetPassword);
usersRoute.delete('/delete/:id', usersController.deleteUser)
usersRoute.patch('/', authentication.checkToken, usersController.editUsers);
usersRoute.get('/', usersController.getDataAllUser);

module.exports = usersRoute;