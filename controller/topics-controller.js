const { fetchTopics } = require('../model/topics-model.js');

const sendTopics = (req, res, next) => {
	fetchTopics()
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};

module.exports = { sendTopics };
