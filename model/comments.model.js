const connection = require('../db/connection.js');
const checkIfExists = require('../errors/check');

const updateComment = (articleObj, recievedBody) => {
	if (Object.keys(recievedBody)[0] === 'username' && Object.keys(recievedBody)[1] === 'body') {
		return connection
			.insert({
				author: recievedBody.username,
				body: recievedBody.body,
				article_id: articleObj.article_id
			})
			.into('comments')
			.returning('*')
			.then((comment) => {
				return comment[0];
			});
	} else if (Object.keys(recievedBody).length === 0) {
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

const fetchCommentsByArticleId = (idObj, recievedBody) => {
	const queryObj = {
		sort_by: recievedBody.sort_by,
		order: recievedBody.order
	};
	const orderObj = { column: 'created_at', order: 'desc' };

	if (Object.keys(recievedBody)[0] in queryObj) {
		if (Object.keys(recievedBody)[0] === 'sort_by') {
			orderObj.column = recievedBody.sort_by;
		}
		if (Object.keys(recievedBody)[0] === 'order') {
			orderObj.order = recievedBody.order;
		}
	}

	if (!Object.keys(recievedBody).length || Object.keys(recievedBody)[0] in queryObj) {
		return connection
			.select('comment_id', 'votes', 'created_at', 'author', 'body')
			.from('comments')
			.where('article_id', idObj.article_id)
			.orderBy([ orderObj ])
			.then((comment) => {
				const queryExist = idObj.article_id ? checkIfExists(idObj.article_id, 'articles', 'article_id') : null;
				return Promise.all([ queryExist, comment ]);
			})
			.then((commentArr) => {
				if (commentArr[0] === false) {
					return Promise.reject({
						status: 404,
						msg: 'Article Not Found'
					});
				} else {
					return commentArr[1];
				}
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
