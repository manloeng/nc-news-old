exports.formatDate = (list) => {
	if (!list) return null;
	list.forEach((item) => {
		item.created_at = new Date(item.created_at);
	});
	return list;
};

exports.makeRefObj = (list) => {
	if (!Object.keys(list[0]).length) return {};
	const newRefObj = {};
	list.forEach((article) => {
		newRefObj[article.title] = article.article_id;
	});
	return newRefObj;
};

exports.formatComments = (comments, articleRef) => {
	if (!Object.keys(comments[0]).length) return {};

	comments.forEach((comment) => {
		const keys = Object.keys(comment);
		keys.forEach((key) => {
			if (key === 'created_at') {
				comment.created_at = new Date(comment.created_at);
			}
			if (key === 'belongs_to') {
				comment.article_id = articleRef[comment.belongs_to];
				delete comment.belongs_to;
			}
		});
	});
	return comments;
};
