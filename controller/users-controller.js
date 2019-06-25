const { fetchUsers } = require('../model/users-model.js');

const sendUsers = () => {
	console.log('sending users');
	fetchUsers();
};

module.exports = { sendUsers };
