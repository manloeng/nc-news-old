const connection = require('../db/connection.js');

const checkIfExists = (id, table, column) => {
	return connection.select('*').from(table).where(column, id).then((row) => {
		console.log(row);
		console.log(row.length);
		if (row.length === 0) {
			console.log('HERE Passing');
			return true;
		} else return false;
	});
};

module.exports = checkIfExists;
