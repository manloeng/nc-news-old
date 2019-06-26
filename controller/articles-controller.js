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
	const voteCounter = req.body;
	updateArticleVote(article_id, voteCounter).then((article) => {
		console.log(article);
		res.status(202).send({ article });
	});
};

module.exports = { sendArticlesById, changeArticleVote };
