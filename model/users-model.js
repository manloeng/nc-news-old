const connection = require('../db/connection.js');

const fetchUsersById = (userId) => {
	return connection.first('*').from('users').where('username', userId.username).then((user) => {
		console.log(user);
		if (!user) {
			return Promise.reject({
				status: 404,
				msg: 'User Not Found'
			});
		}
		return user;
	});
};

module.exports = { fetchUsersById };
