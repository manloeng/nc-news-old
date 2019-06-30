const {
	updateComment,
	fetchCommentsByArticleId,
	updateCommentVoteCount,
	deleteComment
} = require('../model/comments.model.js');

const addComment = (req, res, next) => {
	const articleObj = req.params;
	const recievedBody = req.body;
	updateComment(articleObj, recievedBody)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

const sendCommentByArticleId = (req, res, next) => {
	const idObj = req.params;
	fetchCommentsByArticleId(idObj, req.query)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

const patchComment = (req, res, next) => {
	const commentObj = req.params;
	const recievedBody = req.body;
	updateCommentVoteCount(commentObj, recievedBody)
		.then((comment) => {
			res.status(200).send({ comment });
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
