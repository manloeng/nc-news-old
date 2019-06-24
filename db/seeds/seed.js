const { topicData, articleData, commentData, userData } = require('../index.js');

const { formatDate, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex, Promise) {
	const topicsInsertions = knex('topics').insert(topicData);
	const usersInsertions = knex('users').insert(userData);

	return knex.migrate.rollback().then(() => knex.migrate.latest()).then(() => {
		return Promise.all([ topicsInsertions, usersInsertions ])
			.then(() => {
				topicsInsertions.returning('*');
			})
			.then(() => {
				usersInsertions.returning('*');
			})
			.then(() => {
				const formattedArticle = formatDate(articleData);
				return knex('articles').insert(formattedArticle).returning('*');
			})
			.then((articleRows) => {
				// console.log(result);
				// console.log(articleRows);
				const articleRef = makeRefObj(articleRows);

				console.log(articleRef);
				const formattedComments = formatComments(commentData, articleRef);
				return knex('comments').insert(formattedComments);
			});
	});
};
