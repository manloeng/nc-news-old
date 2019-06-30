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
	const queryObj = {
		sort_by: query.sort_by,
		order: query.order
	};
	const orderObj = { column: 'created_at', order: 'desc' };

	if (Object.keys(query)[0] in queryObj) {
		if (Object.keys(query)[0] === 'sort_by') {
			orderObj.column = query.sort_by;
		}
		if (Object.keys(query)[0] === 'order') {
			orderObj.order = query.order;
		}
	}

	if (!Object.keys(query).length || Object.keys(query)[0] in queryObj) {
		return connection
			.select('comment_id', 'votes', 'created_at', 'author', 'body')
			.from('comments')
			.where('article_id', article_id.article_id)
			.orderBy([ orderObj ])
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

const updateCommentVoteCount = (commentObj, recievedBody) => {
	if (Object.keys(recievedBody).length === 0) {
		recievedBody.inc_votes = 0;
	}
	if (Object.keys(recievedBody).length === 1 && Object.keys(recievedBody)[0] === 'inc_votes') {
		return connection
			.select('*')
			.from('comments')
			.where('comment_id', commentObj.comment_id)
			.increment('votes', recievedBody.inc_votes)
			.returning('*')
			.then((comment) => {
				if (!comment.length) {
					return Promise.reject({
						status: 404,
						msg: 'Comment not found'
					});
				} else {
					return comment[0];
				}
			});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Invalid Key Value'
		});
	}
};

const deleteComment = (commentObj) => {
	return connection.into('comments').where('comment_id', commentObj.comment_id).del().then((deleteCount) => {
		if (deleteCount === 0) {
			return Promise.reject({
				status: 404,
				msg: 'Page Not Found'
			});
		}
	});
};

module.exports = { updateComment, fetchCommentsByArticleId, updateCommentVoteCount, deleteComment };
