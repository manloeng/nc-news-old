const connection = require('../db/connection.js');

const fetchArticles = () => {
	console.log('fetchArticles here');
};

const fetchArticlesById = (article) => {
	// console.log('fetchArticlesByID here');
	console.log(article);
	return connection.first('*').from('articles').where('article_id', article.article_id).then((article) => {
		return article;
	});
};

module.exports = { fetchArticles, fetchArticlesById };
