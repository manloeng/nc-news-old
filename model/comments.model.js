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

const updatingCommentData = (commentObj, voteCount) => {
	return connection
		.select('*')
		.from('comments')
		.where('comment_id', commentObj.comment_id)
		.increment('votes', voteCount.inc_votes)
		.returning('*')
		.then((comment) => {
			return comment[0];
		});
};

module.exports = { updateComment, fetchCommentsByArticleId, updatingCommentData };
