const articleRouter = require('express').Router();
const { sendArticles, sendArticlesById } = require('../controller/articles-controller.js');

articleRouter.route('/:article_id').get(sendArticlesById);

module.exports = articleRouter;
