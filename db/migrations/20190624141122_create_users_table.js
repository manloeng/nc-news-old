exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', function(userTable) {
		userTable.sting('username').primary();
		userTable.string('avatar_url');
		userTable.string('name');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
