const commentsRouter = require('express').Router();
const { sendPatchComment, sendRemoveComment } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

commentsRouter.route('/:comment_id').patch(sendPatchComment).delete(sendRemoveComment).all(sendMethodNotAllowed);

module.exports = commentsRouter;
