const express = require('express');
const app = express('');
const apiRouter = require('./routes/apiRouter.js');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
	// console.log(err.message);
	// console.log(err);
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
	if (err.code === '22P02') {
		res.status(400).send({ msg: err.message });
	}
	if (err.code === '42703') {
		res.status(400).send({ msg: err.message });
	}
});

module.exports = app;
