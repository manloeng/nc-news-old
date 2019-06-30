const express = require('express');
const app = express('');
const apiRouter = require('./routes/apiRouter.js');
const { errStatus, sqlErrors, internalServerErrors } = require('./errors/errors.js');

app.use(express.json());
app.use('/api', apiRouter);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Page Not Found' });
});

app.use(errStatus);
app.use(sqlErrors);
app.use(internalServerErrors);

module.exports = app;
