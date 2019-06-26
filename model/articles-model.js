const connection = require('../db/connection.js');

const fetchArticlesById = (article_id) => {
	return connection
		.first('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.join('comments', 'articles.article_id', 'comments.article_id')
		.groupBy('articles.article_id')
		.where('articles.article_id', article_id);
};

const updateArticleVote = (article, voteCounter, commentLength) => {
	return connection.first('*').from('articles').where('article_id', article.article_id).then((article) => {
		article.votes = article.votes + voteCounter.inc_votes;
		article.comment_count = commentLength;
		return article;
	});
};

module.exports = { fetchArticlesById, updateArticleVote };
