const connection = require('../db/connection.js');

const fetchArticlesById = (article, length) => {
	return connection.select('*').from('articles').where('article_id', article.article_id).then((formattedArticle) => {
		if (!length) {
			return Promise.reject({
				status: 404,
				msg: 'Article ID Not Found'
			});
		}
		formattedArticle[0].comment_count = length;
		return formattedArticle[0];
	});
};

const updateArticleVote = (article) => {
	// console.log(article);
	// return connection.select('*').from('articles').where('article_id', article.article_id).then(console.log);
};

module.exports = { fetchArticlesById, updateArticleVote };
