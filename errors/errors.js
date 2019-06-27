const sendMethodNotAllowed = (req, res) => {
	res.status(405).send({ msg: 'Method Not Allowed' });
};

module.exports = { sendMethodNotAllowed };
