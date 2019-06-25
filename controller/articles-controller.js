const { fetchArticlesById, updateArticleVote } = require('../model/articles-model.js');
const { fetchCommentsByArticleId } = require('../model/comments.model.js');

const sendArticlesById = (req, res, next) => {
	const article_id = req.params;
	fetchCommentsByArticleId(article_id)
		.then((result) => {
			const commentLength = result.length;
			fetchArticlesById(article_id, commentLength)
				.then((article) => {
					res.status(200).send({ article });
				})
				.catch(next);
		})
		.catch(next);
};

const changeArticleVote = (req, res, next) => {
	const article_id = req.params;
	// console.log(req, '<------');
	// updateArticleVote(article_id).then();
};

module.exports = { sendArticlesById, changeArticleVote };
