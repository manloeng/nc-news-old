const connection = require('../db/connection.js');
const checkIfExists = require('../errors/check');

const fetchArticles = ({ sort_by = 'created_at', order, author, topic, ...rest }) => {
	if (Object.keys(rest).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}

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
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.orderBy(sort_by || 'created_at', order || 'desc')
		.groupBy('articles.article_id')
		.modify((queryBuilder) => {
			if (author) {
				queryBuilder.where({ 'articles.author': author });
			}
			if (topic) {
				queryBuilder.where({ 'articles.topic': topic });
			}
		})
		.then((articles) => {
			let queryExist = null;
			if (author) {
				queryExist = checkIfExists(author, 'articles', 'author');
			}
			if (topic) {
				queryExist = checkIfExists(topic, 'articles', 'topic');
			}
			return Promise.all([ queryExist, articles ]);
		})
		.then((articleArr) => {
			if (articleArr[0] === false) {
				return Promise.reject({
					status: 404,
					msg: 'Not Found'
				});
			}
			return articleArr[1];
		});
};

const fetchArticleById = (article_id) => {
	return connection
		.first('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
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

const updateArticleVote = (article_id, recievedBody) => {
	if (!Object.keys(recievedBody).length) {
		recievedBody.inc_votes = 0;
	}

	if (Object.keys(recievedBody).length > 1 || Object.keys(recievedBody)[0] !== 'inc_votes') {
		return Promise.reject({
			status: 400,
			msg: 'Invalid Key Value'
		});
	}

	return connection
		.first('*')
		.from('articles')
		.where('article_id', article_id)
		.increment('votes', recievedBody.inc_votes)
		.returning('*')
		.then((article) => {
			if (!article.length) {
				return Promise.reject({
					status: 404,
					msg: 'Article not found'
				});
			} else {
				return article[0];
			}
		});
};

module.exports = { fetchArticleById, updateArticleVote, fetchArticles };
