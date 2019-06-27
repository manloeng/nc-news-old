const connection = require('../db/connection.js');
const checkIfExists = require('../errors/check');

const updateComment = (article_id, body) => {
	if (Object.keys(body)[0] === 'username' && Object.keys(body)[1] === 'body') {
		return connection
			.insert({
				author: body.username,
				body: body.body,
				article_id: article_id.article_id
			})
			.into('comments')
			.returning('*')
			.then((comment) => {
				return comment[0];
			});
	} else if (Object.keys(body).length === 0) {
		return Promise.reject({
			status: 400,
			msg: 'Require username and body input'
		});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Invalid key has been used'
		});
	}
};

const fetchCommentsByArticleId = (article_id, query) => {
	if (!Object.keys(query).length || (Object.keys(query)[0] === 'order' || Object.keys(query)[0] === 'sort_by')) {
		return connection
			.select('comment_id', 'votes', 'created_at', 'author', 'body')
			.from('comments')
			.where('article_id', article_id.article_id)
			.orderBy(query.sort_by || 'created_at', query.order || 'created_at')
			.then((comment) => {
				return comment;
			});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Invalid query is used'
		});
	}
};

const updatingCommentData = (commentObj, body) => {
	return connection
		.select('*')
		.from('comments')
		.where('comment_id', commentObj.comment_id)
		.increment('votes', body.inc_votes)
		.returning('*')
		.then((comment) => {
			if (!comment.length) {
				return Promise.reject({
					status: 404,
					msg: 'Comment not found'
				});
			} else {
				if (Object.keys(body).length === 1) {
					for (let i = 0; i < Object.keys(body).length; i++) {
						if (Object.keys(body)[i] === 'inc_votes') {
							if (typeof body.inc_votes === 'number') {
								return comment[0];
							} else {
								return Promise.reject({
									status: 400,
									msg: 'Invalid Key Value'
								});
							}
						} else {
							return Promise.reject({
								status: 400,
								msg: 'Invalid Key Value Pair'
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
};

const deleteComment = (commentObj) => {
	// const commentExists = commentObj.comment_id ? checkIfExists(commentObj.comment_id, 'comments', 'comment_id') : null;
	// return Promise.all([ commentExists, comments ]).then(([ commentExists, comments ]) => {
	// 	console.log(commentExists, '<-----');
	// 	console.log(comments);
	// });
	return connection.into('comments').where('comment_id', commentObj.comment_id).del();
};

module.exports = { updateComment, fetchCommentsByArticleId, updatingCommentData, deleteComment };
