const topicsRouter = require('express').Router();
const { sendTopics } = require('../controller/topics-controller.js');

topicsRouter.route('/').get(sendTopics);

module.exports = topicsRouter;
