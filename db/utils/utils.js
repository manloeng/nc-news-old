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
		if (Object.keys(comment)[0] === 'created_at') {
			comment.created_at = new Date(comment.created_at);
		}
		if (Object.keys(comment)[0] === 'belongs_to') {
			comment.article_id = articleRef[comment.belongs_to];
			delete comment.belongs_to;
		}
	});
	return comments;
};

/**
 * 		(datevalues = [
			date.getDate(),
			date.getMonth() + 1,
			date.getFullYear(),
			date.getHours() - 1,
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		]);
	console.log(datevalues[0]);
	let formattedDate = `${datevalues[0]} ${datevalues[1]} ${datevalues[2]} ${datevalues[3]}:${datevalues[4]}:${datevalues[5]}:${datevalues[6]}`;
	console.log(formattedDate);
	return formattedDate;
 */
