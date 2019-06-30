const sendMethodNotAllowed = (req, res) => {
	res.status(405).send({ msg: 'Method Not Allowed' });
};

const errStatus = (err, req, res, next) => {
	if (err.status) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

const sqlErrors = (err, req, res, next) => {
	const sqlErrorCode = {
		'22P02': '22P02',
		'42703': '42703'
	};

	if (err.code in sqlErrorCode) {
		res.status(400).send({ msg: err.message });
	} else {
		next(err);
	}
	// const sqlErrorCode = [ '22P02', '42703' ];
	// if (sqlErrorCode.includes(err.code)) {
	// 	res.status(400).send({ msg: err.message });
	// } else {
	// 	next(err);
	// }
};

const internalServerErrors = (err, req, res, next) => {
	res.status(500).send({ msg: 'Internal Sever Error' });
};

module.exports = { sendMethodNotAllowed, errStatus, sqlErrors, internalServerErrors };
