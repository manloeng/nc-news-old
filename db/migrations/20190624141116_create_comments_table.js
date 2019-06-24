exports.up = function(knex, Promise) {
	return knex.schema.createTable('comments', function(commentTable) {
		userTable.integer('comment_id').primary();
		userTable.string('author').references('users_username');
		userTable.integer('article_id').references('articles.article_id');
		userTable.integer('votes').defaultTo(0);
		userTable.timestamp('created_at');
		userTable.string('body');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('comments');
};
