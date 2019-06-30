const express = require('express');
const app = express('');
const apiRouter = require('./routes/apiRouter.js');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	}
	const sqlErrorCode = [ '22P02', '42703' ];
	if (sqlErrorCode.includes(err.code)) {
		res.status(400).send({ msg: err.message });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Sever Error' });
});

module.exports = app;
