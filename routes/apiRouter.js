const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const userRouter = require('./userRouter.js');
const articleRouter = require('./articleRouter.js');
const commentsRouter = require('./commentsRouter.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
