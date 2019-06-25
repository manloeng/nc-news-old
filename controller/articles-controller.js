const { fetchArticles, fetchArticlesById } = require('../model/articles-model.js');

const sendArticles = () => {
	// console.log('sendArticles here');
	fetchArticles();
};

const sendArticlesById = (req, res, next) => {
	// console.log('sendArticlesByID here');
	const article_id = req.params;
	fetchArticlesById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

module.exports = { sendArticles, sendArticlesById };
