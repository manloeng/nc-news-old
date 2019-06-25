const userRouter = require('express').Router();
const { sendUsers } = require('../controller/users-controller.js');

userRouter.route('/:username').get(sendUsers);

module.exports = userRouter;
