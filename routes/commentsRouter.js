const commentsRouter = require('express').Router();
const { patchComment, removeComment } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

commentsRouter.route('/:comment_id').patch(patchComment).delete(removeComment).all(sendMethodNotAllowed);

module.exports = commentsRouter;
