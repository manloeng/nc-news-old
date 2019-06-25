const { fetchArticles, fetchArticlesById } = require('../model/articles-model.js');

const sendArticles = () => {
	// console.log('sendArticles here');
	fetchArticles();
};

const sendArticlesById = (req, res, next) => {
	// console.log('sendArticlesByID here');
	fetchArticlesById();
};

module.exports = { sendArticles, sendArticlesById };
