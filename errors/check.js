const checkIfExists = (id, table, column) => {
	console.log(id);
	console.log(table);
	console.log(column);
	return connection.select('*').from(table).where(column, id).then((row) => {
		console.log(row, '<---- rows');
		if (row.length === 0) {
			return true;
		} else return false;
	});
};

module.exports = checkIfExists;
