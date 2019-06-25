const { fetchArticles, fetchArticlesById } = require('../model/articles-model.js');
const { fetchCommentsByArticleId } = require('../model/comments.model.js');

const sendArticles = () => {
	// console.log('sendArticles here');
	fetchArticles();
};

const sendArticlesById = (req, res, next) => {
	// console.log('sendArticlesByID here');
	const article_id = req.params;
	fetchCommentsByArticleId(article_id)
		.then((result) => {
			const commentLength = result.length;
			// console.log(commentLength);
			fetchArticlesById(article_id, commentLength).then((article) => {
				res.status(200).send({ article });
			});
		})
		.catch(next);
};

module.exports = { sendArticles, sendArticlesById };
