const { updateComment } = require('../model/comments.model.js');

const addComment = (req, res, next) => {
	const article_id = req.params;
	const body = req.body;
	updateComment(article_id, body).then((comment) => {
		res.status(201).send({ comment });
	});
};

module.exports = { addComment };
