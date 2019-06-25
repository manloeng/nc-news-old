const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const userRouter = require('./userRouter.js');
const articleRouter = require('./articleRouter.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);

module.exports = apiRouter;
