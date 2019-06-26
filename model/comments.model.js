const connection = require('../db/connection.js');

const updateComment = (article_id, body) => {
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
};

const fetchCommentsByArticleId = (article_id, query) => {
	return connection
		.select('comment_id', 'votes', 'created_at', 'author', 'body')
		.from('comments')
		.where('article_id', article_id.article_id)
		.orderBy(query.sort_by || 'created_at', query.order || 'created_at')
		.then((comment) => {
			return comment;
		});
};

const updatingCommentData = (commentObj, body) => {
	return connection
		.select('*')
		.from('comments')
		.where('comment_id', commentObj.comment_id)
		.increment('votes', body.inc_votes)
		.returning('*')
		.then((comment) => {
			if (Object.keys(body)[0] === 'inc_votes') {
				return comment[0];
			} else {
				return Promise.reject({
					status: 400,
					msg: 'Invalid Key Value Pair'
				});
			}
		});
};

module.exports = { updateComment, fetchCommentsByArticleId, updatingCommentData };
