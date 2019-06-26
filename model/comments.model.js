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

const fetchCommentsByArticleId = (article_id) => {
	return connection
		.select('comment_id', 'votes', 'created_at', 'author', 'body')
		.from('comments')
		.where('article_id', article_id.article_id)
		.then((article) => {
			return article;
		});
};

module.exports = { updateComment, fetchCommentsByArticleId };
