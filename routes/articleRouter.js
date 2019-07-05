const articleRouter = require('express').Router();
const { sendArticle, sendArticleById, sendUpdateArticleVote } = require('../controller/articles-controller.js');
const { sendAddComment, sendCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

articleRouter.route('/').get(sendArticle).all(sendMethodNotAllowed);
articleRouter.route('/:article_id').get(sendArticleById).patch(sendUpdateArticleVote).all(sendMethodNotAllowed);
articleRouter.route('/:article_id/comments').post(sendAddComment).get(sendCommentByArticleId).all(sendMethodNotAllowed);

module.exports = articleRouter;
