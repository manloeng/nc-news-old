const { updateComment, fetchCommentsByArticleId, updatingCommentData } = require('../model/comments.model.js');

const addComment = (req, res, next) => {
	const articleObj = req.params;
	const body = req.body;
	updateComment(articleObj, body).then((comment) => {
		res.status(201).send({ comment });
	});
};

const sendCommentByArticleId = (req, res, next) => {
	const articleObj = req.params;
	fetchCommentsByArticleId(articleObj, req.query).then((comment) => {
		res.status(200).send(comment);
	});
};

const sendComment = (req, res, next) => {
	const commentObj = req.params;
	const voteCount = req.body;
	updatingCommentData(commentObj, voteCount).then((comment) => {
		res.status(202).send({ comment });
	});
};

module.exports = { addComment, sendCommentByArticleId, sendComment };
