exports.formatDate = (list) => {
	if (!list) return null;
	let date = new Date(list[0].created_at);
	return date;
};

exports.makeRefObj = (list) => {};

exports.formatComments = (comments, articleRef) => {};

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
