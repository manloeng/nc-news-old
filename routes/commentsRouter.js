const commentsRouter = require('express').Router();
const { sendComment,removeComment } = require('../controller/comments-controller.js');

commentsRouter.route('/:comment_id').patch(sendComment).delete(removeComment)

module.exports = commentsRouter;
