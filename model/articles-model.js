const connection = require('../db/connection.js');

const fetchArticles = () => {
	return connection
		.select(
			'articles.article_id',
			'articles.title',
			'articles.votes',
			'articles.topic',
			'articles.created_at',
			'articles.author'
		)
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.join('comments', 'articles.article_id', 'comments.article_id')
		.orderBy('created_at')
		.groupBy('articles.article_id')
		.then((articles) => {
			return articles;
		});
};

const fetchArticlesById = (article_id) => {
	return connection
		.first('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.join('comments', 'articles.article_id', 'comments.article_id')
		.groupBy('articles.article_id')
		.where('articles.article_id', article_id)
		.then((article) => {
			if (!article) {
				return Promise.reject({
					status: 404,
					msg: 'Article ID Not Found'
				});
			} else {
				return article;
			}
		});
};

const updateArticleVote = (article_id, body) => {
	return connection
		.first('*')
		.from('articles')
		.where('article_id', article_id)
		.increment('votes', body.inc_votes)
		.returning('*')
		.then((article) => {
			if (!article.length) {
				return Promise.reject({
					status: 404,
					msg: 'Article not found'
				});
			} else {
				if (Object.keys(body).length === 1) {
					for (let i = 0; i < Object.keys(body).length; i++) {
						if (Object.keys(body)[i] === 'inc_votes') {
							if (typeof body.inc_votes === 'number') {
								return article[0];
							} else {
								return Promise.reject({
									status: 400,
									msg: 'Invalid Key Value'
								});
							}
						} else {
							return Promise.reject({
								status: 400,
								msg: 'Invalid Key'
							});
						}
					}
				} else if (Object.keys(body).length === 0) {
					return Promise.reject({
						status: 400,
						msg: 'Require Input'
					});
				} else {
					return Promise.reject({
						status: 400,
						msg: 'Invalid Keys'
					});
				}
			}
		});
	/* 
		move some err handling to before connection
		no for loop
		destructuring/getting 'first' to work
		*/
};

module.exports = { fetchArticlesById, updateArticleVote, fetchArticles };
