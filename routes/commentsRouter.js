const commentsRouter = require('express').Router();
const { sendComment, removeComment } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

commentsRouter.route('/:comment_id').patch(sendComment).delete(removeComment).all(sendMethodNotAllowed);

module.exports = commentsRouter;
