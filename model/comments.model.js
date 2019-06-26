const connection = require('../db/connection.js');

// const fetchCommentsByArticleId = (article) => {
// 	// console.log('fetch comments');
// 	return connection.select('*').from('comments').where('article_id', article.article_id).then((article) => {
// 		// console.log(article);
// 		return article;
// 	});
// };

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

module.exports = { updateComment };
