const articleRouter = require('express').Router();
const { sendArticlesById, changeArticleVote } = require('../controller/articles-controller.js');

articleRouter.route('/:article_id').get(sendArticlesById).patch(changeArticleVote);

module.exports = articleRouter;
