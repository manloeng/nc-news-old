const { fetchUsers, fetchUsersById } = require('../model/users-model.js');

const sendUsers = (req, res, next) => {};

const sendUsersById = (req, res, next) => {
	const user = req.params;
	fetchUsersById(user)
		.then((user) => {
			// console.log(user);
			res.status(200).send({ user });
		})
		.catch(next);
};

module.exports = { sendUsers, sendUsersById };
