const articleRouter = require('express').Router();
const { sendArticlesById, changeArticleVote } = require('../controller/articles-controller.js');
const { addComment, sendCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/errors.js');

articleRouter.route('/:article_id').get(sendArticlesById).patch(changeArticleVote).all(sendMethodNotAllowed);
articleRouter.route('/:article_id/comments').post(addComment).get(sendCommentByArticleId).all(sendMethodNotAllowed);

module.exports = articleRouter;
