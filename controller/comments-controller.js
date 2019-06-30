const {
	updateComment,
	fetchCommentsByArticleId,
	updateCommentVoteCount,
	deleteComment
} = require('../model/comments.model.js');

const addComment = (req, res, next) => {
	const articleObj = req.params;
	const body = req.body;
	updateComment(articleObj, body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

const sendCommentByArticleId = (req, res, next) => {
	const articleObj = req.params;
	fetchCommentsByArticleId(articleObj, req.query)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

const patchComment = (req, res, next) => {
	const commentObj = req.params;
	const body = req.body;
	updateCommentVoteCount(commentObj, body)
		.then((comment) => {
			res.status(202).send({ comment });
		})
		.catch(next);
};

const removeComment = (req, res, next) => {
	const commentObj = req.params;
	deleteComment(commentObj)
		.then((deleteCount) => {
			res.sendStatus(204);
		})
		.catch(next);
};

module.exports = { addComment, sendCommentByArticleId, patchComment, removeComment };
