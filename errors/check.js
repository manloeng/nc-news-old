const connection = require('../db/connection.js');

const checkIfExists = (id, table, column) => {
	return connection.select('*').from(table).where(column, id).then((rows) => {
		return rows.length !== 0;
	});
};

module.exports = checkIfExists;
