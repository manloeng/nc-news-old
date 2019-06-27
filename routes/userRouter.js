const userRouter = require('express').Router();
const { sendUsersById } = require('../controller/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

userRouter.route('/:username').get(sendUsersById).all(sendMethodNotAllowed);

module.exports = userRouter;
