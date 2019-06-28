const connection = require('../db/connection.js');

const fetchUsersById = (userId) => {
	// console.log(userId);
	return connection.select('*').from('users').then((results) => {
		const filteredUser = results.filter((user) => {
			if (user.username === userId.username) {
				return user;
			}
		});
		if (!filteredUser.length) {
			return Promise.reject({
				status: 400,
				msg: 'Invalid username'
			});
		}
		return filteredUser[0];
	});
};

module.exports = { fetchUsersById };
