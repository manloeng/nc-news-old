const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const userRouter = require('./userRouter.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
