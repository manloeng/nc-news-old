const { fetchUsersById } = require('../model/users-model.js');

const sendUsersById = (req, res, next) => {
	const user = req.params;
	fetchUsersById(user)
		.then((user) => {
			// console.log(user);
			res.status(200).send({ user });
		})
		.catch(next);
};

module.exports = { sendUsersById };
