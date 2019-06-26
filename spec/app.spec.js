process.env.NODE_ENV = 'test';
const connection = require('../db/connection.js');
const request = require('supertest');
const chai = require('chai');
const app = require('../app.js');

const { expect } = chai;

describe('/', () => {
	after(() => {
		connection.destroy();
	});
	beforeEach(() => {
		return connection.seed.run();
	});

	it('/not-a-route', () => {
		return request(app).get('/not-a-route').expect(404).then((res) => {
			expect(res.body.msg).to.equal('Page Not Found');
		});
	});

	describe('/api', () => {
		describe('/topics', () => {
			it('GET status:200, containing all the topics data', () => {
				return request(app).get('/api/topics').expect(200).then((res) => {
					expect(res.body.topics[0]).to.contain.keys('slug', 'description');
				});
			});
		});

		describe('/users/:username', () => {
			it('GET status:200 when passed with a valid users id ', () => {
				return request(app).get('/api/users/icellusedkars').expect(200).then((res) => {
					expect(res.body.user).to.contain.keys('username', 'name', 'avatar_url');
					expect(res.body.user.username).to.equal('icellusedkars');
				});
			});
			it('GET status:400 when passed with a invalid users id', () => {
				return request(app).get('/api/users/andrew').expect(400).then((res) => {
					expect(res.body.msg).to.equal('Invalid username');
				});
			});
		});

		describe('/articles', () => {
			describe.only('/:article_id', () => {
				it('GET status: 200, when passed with a valid article id', () => {
					return request(app).get('/api/articles/1').expect(200).then((res) => {
						expect(res.body.article).to.contain.keys(
							'article_id',
							'title',
							'topic',
							'author',
							'body',
							'created_at',
							'votes',
							'comment_count'
						);
						expect(res.body.article.article_id).to.equal(1);
					});
				});

				it('GET status:400 when passed with a invalid article id', () => {
					return request(app).get('/api/articles/andrew').expect(400).then((res) => {
						expect(res.body.msg).to.equal(
							'select "articles".*, count("comments"."article_id") as "comment_count" from "articles" inner join "comments" on "articles"."article_id" = "comments"."article_id" where "articles"."article_id" = $1 group by "articles"."article_id" limit $2 - invalid input syntax for integer: "andrew"'
						);
					});
				});

				it("GET status:404 when passed with an article id that's not in the database", () => {
					return request(app).get('/api/articles/999').expect(404).then((res) => {
						expect(res.body.msg).to.equal('Article ID Not Found');
					});
				});

				it('PATCH status:202 when the article vote has been sucessfully updated', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({
							inc_votes: 1
						})
						.expect(202)
						.then((res) => {
							expect(res.body.article).to.contain.keys(
								'article_id',
								'title',
								'topic',
								'author',
								'body',
								'created_at',
								'votes'
							);
							expect(res.body.article.votes).to.equal(101);
						});
				});

				it('PATCH status:400 when trying to update valid keys-value pairs using a string', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({
							inc_votes: 'Andrew'
						})
						.expect(400)
						.then((res) => {
							expect(res.body.msg).to.equal(
								'update "articles" set "votes" = "votes" + $1 where "article_id" = $2 returning * - invalid input syntax for integer: "NaN"'
							);
						});
				});

				it('PATCH status:400 when trying to update valid keys-value pairs that is not "vote"', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({
							author: 'Andrew'
						})
						.expect(400)
						.then((res) => {
							expect(res.body.msg).to.equal('Invalid Key');
						});
				});

				it('PATCH status:400 when trying to update invalid keys value pair', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({
							author_name: 'Andrew'
						})
						.expect(400)
						.then((res) => {
							expect(res.body.msg).to.equal('Invalid Key');
						});
				});

				it('PATCH status:400 when trying to update with one valid key and invalid keys value pair', () => {
					return request(app).patch('/api/articles/1').send({ inc_votes: 1, name: 'Mitch' }).expect(400).then((res) => {
						expect(res.body.msg).to.equal('Invalid Keys');
					});
				});

				it('PATCH status:400 when trying to update with values', () => {
					return request(app).patch('/api/articles/1').send({}).expect(400).then((res) => {
						expect(res.body.msg).to.equal('Require Input');
					});
				});

				it('PATCH status:400 when passed with a invalid article id', () => {
					return request(app).patch('/api/articles/andrew').expect(400).then((res) => {
						expect(res.body.msg).to.equal(
							'update "articles" set "votes" = "votes" + $1 where "article_id" = $2 returning * - invalid input syntax for integer: "andrew"'
						);
					});
				});

				it("PATCH status:404 when passed with an article id that's not in the database", () => {
					return request(app).get('/api/articles/999').expect(404).then((res) => {
						expect(res.body.msg).to.equal('Article ID Not Found');
					});
				});

				describe.only('/comments', () => {
					it('POST status:201, when a new comment has been created', () => {
						return request(app)
							.post('/api/articles/1/comments')
							.send({
								username: 'butter_bridge',
								body: 'Creating something new here'
							})
							.expect(201)
							.then((res) => {
								expect(res.body.comment).to.contain.keys(
									'author',
									'body',
									'comment_id',
									'article_id',
									'created_at',
									'votes'
								);
								expect(res.body.comment.article_id).to.equal(1);
							});
					});

					xit('POST status:400 when trying to create a comment with invalid key value pair', () => {
						return request(app)
							.post('/api/articles/1/comments')
							.send({
								author: 123
							})
							.expect(400)
							.then((res) => {
								expect(res.body.msg).to.equal('Invalid Key');
							});
					});

					xit('POST status:400 when trying to create a comment with one valid key and invalid keys value pair', () => {
						return request(app)
							.post('/api/articles/999/comments')
							.send({
								author: 'butter_bridge'
							})
							.expect(400)
							.then((res) => {
								expect(res.body.msg).to.equal('Invalid Article Id');
							});
					});

					it('GET status:200, when a getting the newly created comment', () => {
						return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
							expect(res.body.comment).to.contain.keys('author', 'body', 'comment_id', 'created_at', 'votes');
						});
					});
				});
			});
		});
	});
});
