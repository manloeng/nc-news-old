const { fetchArticlesById, updateArticleVote, fetchArticles } = require('../model/articles-model.js');

const sendArticle = (req, res, next) => {
	fetchArticles(req.query)
		.then((articles) => {
			res.status(200).send(articles);
		})
		.catch(next);
};

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
	updateArticleVote(article_id, body)
		.then((article) => {
			res.status(202).send({ article });
		})
		.catch(next);
};

module.exports = { sendArticlesById, changeArticleVote, sendArticle };
