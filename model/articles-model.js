const connection = require('../db/connection.js');

const fetchArticles = () => {
	console.log('fetchArticles here');
};

const fetchArticlesById = () => {
	console.log('fetchArticlesByID here');
};

module.exports = { fetchArticles, fetchArticlesById };
