const express = require('express');
const app = express('');
const apiRouter = require('./routes/apiRouter.js');

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
	console.log(err);
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
});

module.exports = app;
