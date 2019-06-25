const express = require('express');
const app = express('');
const apiRouter = require('./routes/apiRouter.js');

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

module.exports = app;
