const articleRouter = require('express').Router();
const { sendArticle, sendArticleById, sendChangeArticleVote } = require('../controller/articles-controller.js');
const { addComment, sendCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

articleRouter.route('/').get(sendArticle).all(sendMethodNotAllowed);
articleRouter.route('/:article_id').get(sendArticleById).patch(sendChangeArticleVote).all(sendMethodNotAllowed);
articleRouter.route('/:article_id/comments').post(addComment).get(sendCommentByArticleId).all(sendMethodNotAllowed);

module.exports = articleRouter;
