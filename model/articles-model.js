const connection = require('../db/connection.js');

const fetchArticles = () => {
	console.log('fetchArticles here');
	// return connection.first('*').from('articles').then((article) => {
	// 	console.log(article);
	// 	return article;
	// });
};

const fetchArticlesById = (article, length) => {
	// console.log('fetchArticlesByID here');
	return connection.select('*').from('articles').where('article_id', article.article_id).then((formattedArticle) => {
		formattedArticle[0].comment_count = length;
		return formattedArticle[0];
	});
};
//.where('article_id', article.article_id)

module.exports = { fetchArticles, fetchArticlesById };
