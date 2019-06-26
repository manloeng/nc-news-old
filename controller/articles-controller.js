const { fetchArticlesById, updateArticleVote } = require('../model/articles-model.js');
const { fetchCommentsByArticleId } = require('../model/comments.model.js');

const sendArticlesById = (req, res, next) => {
	const { article_id } = req.params;
	fetchArticlesById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const changeArticleVote = (req, res, next) => {
	const { article_id } = req.params;
	const body = req.body;
	// console.log(body);
	updateArticleVote(article_id, body)
		.then((article) => {
			res.status(202).send({ article });
		})
		.catch(next);
};

module.exports = { sendArticlesById, changeArticleVote };
