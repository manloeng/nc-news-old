const commentsRouter = require('express').Router();
const { sendComment } = require('../controller/comments-controller.js');

commentsRouter.route('/:comment_id').patch(sendComment);

module.exports = commentsRouter;
