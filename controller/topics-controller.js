const { fetchTopics } = require('../model/topics-model.js');

const sendTopics = () => {
	console.log('topic controller here');
	fetchTopics();
};

module.exports = { sendTopics };
