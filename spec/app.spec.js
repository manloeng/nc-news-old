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
						expect(res.body.msg).to.equal('Invalid article ID');
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

				it.only('PATCH status:400 when trying to update valid keys-value pairs that is not "vote"', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({
							author: 'Andrew'
						})
						.expect(400)
						.then((res) => {
							expect(res.body.msg).to.equal('Bad Request');
						});
				});

				it('PATCH status:404 when trying to update invalid keys value pair', () => {
					return request(app)
						.patch('/api/articles/1')
						.send({
							author_name: 'Andrew'
						})
						.expect(404)
						.then((res) => {
							expect(res.body.msg).to.equal('The key value is not found');
						});
				});

				it('PATCH status:404 when passed with a invalid article id', () => {
					return request(app).patch('/api/articles/andrew').expect(404).then((res) => {
						expect(res.body.msg).to.equal('Bad Request');
					});
				});

				it("PATCH status:404 when passed with an article id that's not in the database", () => {
					return request(app).get('/api/articles/999').expect(404).then((res) => {
						expect(res.body.msg).to.equal('Article ID Not Found');
					});
				});

				describe('/comments', () => {
					it('POST status:201, when a new comment has been created', () => {
						return request(app)
							.post('/api/articles/1/comments')
							.send({
								username: 'butter_bridge',
								body: 'Creating something new here'
							})
							.expect(201)
							.then((res) => {
								console.log(res.body, '<----- test here');
								expect(res.body.comment).to.contain.keys('username', 'body');
							});
					});
				});
			});
		});
	});
});
