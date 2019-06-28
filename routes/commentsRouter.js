const commentsRouter = require('express').Router();
const { updateComment, removeComment } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

commentsRouter.route('/:comment_id').patch(updateComment).delete(removeComment).all(sendMethodNotAllowed);

module.exports = commentsRouter;
