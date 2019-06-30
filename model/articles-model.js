const connection = require('../db/connection.js');
const checkIfExists = require('../errors/check');

const fetchArticles = (query) => {
	const queryObj = {
		sort_by: query.sort_by,
		author: query.author,
		topic: query.topic,
		order: query.order
	};
	const orderObj = { column: 'created_at', order: 'desc' };
	let filterQuery = [];

	if (Object.keys(query).length > 0) {
		for (let i = 0; i < Object.keys(query).length; i++) {
			if (!(Object.keys(query)[i] in queryObj)) {
				return Promise.reject({
					status: 400,
					msg: 'Bad Request'
				});
			}
		}
		checkQuery(query, queryObj, orderObj, filterQuery);
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
		.orderBy([ orderObj ])
		.groupBy('articles.article_id')
		.modify((queryBuilder) => {
			if (filterQuery.length === 2) {
				queryBuilder.where(filterQuery[0], filterQuery[1]);
			}
			if (filterQuery.length === 1) {
				queryBuilder.where(filterQuery[0]);
			}
		})
		.then((articles) => {
			if (filterQuery.length === 2) {
				const queryExist = query.author ? checkIfExists(query.author, 'articles', 'author') : null;
				return Promise.all([ queryExist, articles ]);
			} else return articles;
		})
		.then((articleArr) => {
			if (articleArr[0] === false) {
				return Promise.reject({
					status: 404,
					msg: 'Author not found'
				});
			} else if (articleArr.length === 2) {
				//array after the promise all
				return articleArr[1];
			} else {
				return articleArr;
			}
		});
};

const checkQuery = (query, queryObj, orderObj, filterQuery) => {
	if (query.author && query.topic) {
		orderObj.column = 'author';
		filterQuery.push({ 'articles.author': query.author, 'articles.topic': query.topic });
	} else {
		if (Object.keys(query)[0] in queryObj) {
			if (query.sort_by) {
				orderObj.column = query.sort_by;
			}
			if (query.author) {
				orderObj.column = 'author';
				filterQuery.push('articles.author', query.author);
			}
			if (query.topic) {
				orderObj.column = 'topic';
				filterQuery.push('articles.topic', query.topic);
			}
		}

		if (query.order) {
			orderObj.order = query.order;
		}
	}
};

// const queryExists = (sort_by) => {
// 	console.log(sort_by);
// 	const queryExist = query.author ? checkIfExists(query.author, 'articles', 'author') : null;
// };

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
