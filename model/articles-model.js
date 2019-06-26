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

const updateArticleVote = (article, voteCounter, commentLength) => {
	return connection.first('*').from('articles').where('article_id', article.article_id).then((article) => {
		article.votes = article.votes + voteCounter.inc_votes;
		article.comment_count = commentLength;
		return article;
	});
};

module.exports = { fetchArticlesById, updateArticleVote };
