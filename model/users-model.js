const connection = require('../db/connection.js');

const fetchUsers = () => {
	return connection.select('*').from('users');
};
const fetchUsersById = (userId) => {
	return connection.select('*').from('users').then((results) => {
		const filteredUser = results.filter((user) => {
			if (user.username === userId.username) {
				return user;
			}
		});
		return filteredUser[0];
	});
};

module.exports = { fetchUsers, fetchUsersById };
