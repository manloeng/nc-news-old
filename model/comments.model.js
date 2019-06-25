const connection = require('../db/connection.js');

const fetchCommentsByArticleId = (article) => {
	// console.log('fetch comments');
	return connection.select('*').from('comments').where('article_id', article.article_id).then((article) => {
		// console.log(article);
		return article;
	});
};

module.exports = { fetchCommentsByArticleId };
