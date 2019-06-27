const {
	updateComment,
	fetchCommentsByArticleId,
	updatingCommentData,
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
			res.status(200).send(comment);
		})
		.catch(next);
};

const sendComment = (req, res, next) => {
	const commentObj = req.params;
	const body = req.body;
	updatingCommentData(commentObj, body)
		.then((comment) => {
			res.status(202).send({ comment });
		})
		.catch(next);
};

const removeComment = (req, res, next) => {
	console.log('removing comments');
	deleteComment();
};

module.exports = { addComment, sendCommentByArticleId, sendComment, removeComment };
