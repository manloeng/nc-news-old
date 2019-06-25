const connection = require('../db/connection.js');

const fetchArticles = () => {
	console.log('fetchArticles here');
};

const fetchArticlesById = (article_id) => {
	// console.log('fetchArticlesByID here');
	// console.log(article_id);
	return connection.first('*').from('articles').where('article_id', article_id.article_id).then((article) => {
		return article;
	});
};

module.exports = { fetchArticles, fetchArticlesById };
