exports.up = function(knex, Promise) {
	return knex.schema.createTable('comments', function(commentsTable) {
		commentsTable.integer('comment_id').primary();
		commentsTable.string('author').references('users_username');
		commentsTable.integer('article_id').references('articles.article_id');
		commentsTable.integer('votes').defaultTo(0);
		commentsTable.timestamp('created_at');
		commentsTable.string('body');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('comments');
};
