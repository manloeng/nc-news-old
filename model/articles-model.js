const connection = require('../db/connection.js');
const checkIfExists = require('../errors/check');

// const fetchArticles = (query) => {
// 	const queryKeys = Object.keys(query);
// 	if (
// 		queryKeys.length === 0 ||
// 		queryKeys[0] === 'sort_by' ||
// 		(queryKeys[0] === 'filter' && queryKeys[1] === 'username') ||
// 		(queryKeys[0] === 'filter' && queryKeys[1] === 'topic_name')
// 	) {
// 		if (
// 			queryKeys.length === 0 ||
// 			query.sort_by === 'asc' ||
// 			query.sort_by === 'desc' ||
// 			(query.filter === 'author' && queryKeys[1] === 'username') ||
// 			(query.filter === 'topic' && queryKeys[1] === 'topic_name')
// 		) {
// 			return connection
// 				.select(
// 					'articles.article_id',
// 					'articles.title',
// 					'articles.votes',
// 					'articles.topic',
// 					'articles.created_at',
// 					'articles.author'
// 				)
// 				.count({ comment_count: 'comments.article_id' })
// 				.from('articles')
// 				.join('comments', 'articles.article_id', 'comments.article_id')
// 				.orderBy(query.order_by || 'created_at', query.sort_by || ('created_at', 'desc'))
// 				.groupBy('articles.article_id')
// 				.modify((queryBuilder) => {
// 					if (query) {
// 						if (query.filter === 'author') {
// 							queryBuilder.where(`articles.author`, query.username);
// 						}
// 						if (query.filter === 'topic') {
// 							queryBuilder.where(`articles.topic`, query.topic_name);
// 						}
// 					}
// 				})
// 				.then((articles) => {
// 					if (query.username) {
// 						const userExists = query.username ? checkIfExists(query.username, 'articles', 'author') : null;
// 						return Promise.all([ userExists, articles ]).then(([ userExists, articles ]) => {
// 							if (userExists === false) {
// 								return Promise.reject({
// 									status: 404,
// 									msg: 'User Not Found'
// 								});
// 							} else return articles;
// 						});
// 					} else if (query.topic_name) {
// 						const topicExists = query.topic_name ? checkIfExists(query.topic_name, 'articles', 'topic') : null;
// 						return Promise.all([ topicExists, articles ]).then(([ topicExists, articles ]) => {
// 							if (topicExists === false) {
// 								return Promise.reject({
// 									status: 404,
// 									msg: 'Topic Not Found'
// 								});
// 							} else return articles;
// 						});
// 					} else {
// 						return articles;
// 					}
// 				});
// 		} else {
// 			return Promise.reject({
// 				status: 400,
// 				msg: 'Invalid query value'
// 			});
// 		}
// 	} else {
// 		return Promise.reject({
// 			status: 400,
// 			msg: 'Bad Request'
// 		});
// 	}
// };

const fetchArticles = (query) => {
	if ('sort_by' in query || 'order' in query || !Object.keys(query).length) {
		const queryObj = { column: 'created_at', order: 'desc' };
		let filterQuery = [];
		if (query.sort_by) {
			queryObj.column = query.sort_by;
			if (query.author) {
				filterQuery = [ 'articles.author', query.author ];
			}
			if (query.topic) {
				filterQuery = [ 'articles.topic', query.topic ];
			}
		}
		if (query.order) {
			queryObj.order = query.order;
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
			.orderBy([ queryObj ])
			.groupBy('articles.article_id')
			.modify((queryBuilder) => {
				if (filterQuery.length === 2) {
					queryBuilder.where(filterQuery[0], filterQuery[1]);
				}
			})
			.then((articles) => {
				if (filterQuery.length === 2) {
					const userExists = query.author ? checkIfExists(query.author, 'articles', 'author') : null;
					return Promise.all([ userExists, articles ]);
				} else return articles;
			})
			.then((articleArr) => {
				if (articleArr[0] === false) {
					return Promise.reject({
						status: 404,
						msg: 'Author not found'
					});
				} else if (articleArr.length === 2) {
					return articleArr[1];
				} else {
					return articleArr;
				}
			});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}
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

const updateArticleVote = (article_id, body) => {
	if (Object.keys(body).length === 0) {
		return Promise.reject({
			status: 400,
			msg: 'Require Input'
		});
	} else if (Object.keys(body).length === 1 && Object.keys(body)[0] === 'inc_votes') {
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
				} else if (typeof body.inc_votes === 'number') {
					return article[0];
				}
			});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Invalid Key Value'
		});
	}
};

module.exports = { fetchArticleById, updateArticleVote, fetchArticles };
