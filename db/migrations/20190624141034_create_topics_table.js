exports.up = function(knex, Promise) {
	return knex.schema.createTable('topics', function(topicsTable) {
		topicsTable.string('slug').primary();
		topicsTable.text('description').notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('topics');
};
