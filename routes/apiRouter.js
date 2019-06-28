const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const userRouter = require('./userRouter.js');
const articleRouter = require('./articleRouter.js');
const commentsRouter = require('./commentsRouter.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');
const json = require('../endpoints.json');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
	.route('/')
	.get((req, res) => {
		res.status(200).send(json);
	})
	.all(sendMethodNotAllowed);

module.exports = apiRouter;
