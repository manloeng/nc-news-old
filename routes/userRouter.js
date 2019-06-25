const userRouter = require('express').Router();
const { sendUsers, sendUsersById } = require('../controller/users-controller.js');

userRouter.route('/:username').get(sendUsersById);

module.exports = userRouter;
