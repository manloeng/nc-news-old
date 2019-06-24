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
				console.log(articleRows);
				/* 

  Your comment data is currently in the incorrect format and will violate your SQL schema. 

  Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
  
  You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
  */

				const articleRef = makeRefObj(articleRows);
				const formattedComments = formatComments(commentData, articleRef);
				return knex('comments').insert(formattedComments);
			});
	});
};
