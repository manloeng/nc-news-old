const articleRouter = require('express').Router();
const { sendArticlesById, changeArticleVote } = require('../controller/articles-controller.js');
const { addComment } = require('../controller/comments-controller.js');

articleRouter.route('/:article_id').get(sendArticlesById).patch(changeArticleVote);
articleRouter.route('/:article_id/comments').post(addComment);

module.exports = articleRouter;
