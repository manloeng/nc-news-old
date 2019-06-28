process.env.NODE_ENV = 'test';
const connection = require('../db/connection.js');
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const app = require('../app.js');

const { expect } = chai;
chai.use(chaiSorted);

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
		it.only('Responds Status:200, with all the available endpoints on your API', () => {
			return request(app).get('/api').expect(200).then((res) => {
				expect(res.body).to.be.a('object');
			});
		});

		it.only('INVALID METHOD status:405,', () => {
			const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

			const methodPromise = invalidMethods.map((method) => {
				return request(app)[method]('/api').expect(405).then((res) => {
					expect(res.body.msg).to.equal('Method Not Allowed');
				});
			});

			return Promise.all(methodPromise);
		});

		describe('/topics', () => {
			describe('CRUD methods', () => {
				describe('GET request for topics', () => {
					it('GET status:200, containing all the topics data', () => {
						return request(app).get('/api/topics').expect(200).then((res) => {
							expect(res.body.topics[0]).to.contain.keys('slug', 'description');
						});
					});
				});
			});
			it('INVALID METHOD status:405,', () => {
				const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

				const methodPromise = invalidMethods.map((method) => {
					return request(app)[method]('/api/topics').expect(405).then((res) => {
						expect(res.body.msg).to.equal('Method Not Allowed');
					});
				});

				return Promise.all(methodPromise);
			});
		});

		describe('/users/:username', () => {
			describe('CRUD methods', () => {
				describe('GET request for /users/:username', () => {
					it('GET status:200 when passed with a valid users id ', () => {
						return request(app).get('/api/users/icellusedkars').expect(200).then((res) => {
							expect(res.body.user).to.contain.keys('username', 'name', 'avatar_url');
							expect(res.body.user.username).to.equal('icellusedkars');
						});
					});
				});

				it('GET status:400 when passed with a invalid users id', () => {
					return request(app).get('/api/users/andrew').expect(400).then((res) => {
						expect(res.body.msg).to.equal('Invalid username');
					});
				});
			});

			it('INVALID METHOD status:405,', () => {
				const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

				const methodPromise = invalidMethods.map((method) => {
					return request(app)[method]('/api/users/icellusedkars').expect(405).then((res) => {
						expect(res.body.msg).to.equal('Method Not Allowed');
					});
				});

				return Promise.all(methodPromise);
			});
		});
		describe('/articles', () => {
			describe('CRUD methods', () => {
				describe('GET request for /articles', () => {
					it('GET status:200, containing all the article data', () => {
						return request(app).get('/api/articles').expect(200).then((res) => {
							expect(res.body[0]).to.contain.keys(
								'author',
								'title',
								'article_id',
								'topic',
								'created_at',
								'votes',
								'comment_count'
							);
						});
					});

					it('GET status:200, the article data should be sorted in an descending order by the date it has been created at', () => {
						return request(app).get('/api/articles').expect(200).then((res) => {
							expect(res.body).to.be.descendingBy('created_at');
						});
					});

					it('GET status:200, the article data should be sorted in an ascending order by the date it has been created at when passed with a order_by query', () => {
						return request(app).get('/api/articles?sort_by=asc').expect(200).then((res) => {
							expect(res.body).to.be.ascendingBy('created_at');
						});
					});

					it('GET status:200, the article data should be filtered in an descending order by the author', () => {
						return request(app).get('/api/articles?filter=author&username=icellusedkars').expect(200).then((res) => {
							expect(res.body).to.be.descendingBy('author');
							expect(res.body).to.have.lengthOf(1);
						});
					});

					it('GET status:200, the article data should be filtered in an descending order by the topic', () => {
						return request(app).get('/api/articles?filter=topic&topic_name=mitch').expect(200).then((res) => {
							expect(res.body).to.be.descendingBy('topic');
						});
					});

					it('GET status:400, when trying to use an invalid query', () => {
						return request(app).get('/api/articles?sorting=asc').expect(400).then((res) => {
							expect(res.body.msg).to.equal('Bad Request');
						});
					});

					it('GET status:400, when trying to use an invalid query value', () => {
						return request(app).get('/api/articles?sort_by=new').expect(400).then((res) => {
							expect(res.body.msg).to.equal('Invalid query value');
						});
					});

					it('GET status:400, when trying to use an invalid query value', () => {
						return request(app).get('/api/articles?filter=new&username=sam').expect(400).then((res) => {
							expect(res.body.msg).to.equal('Invalid query value');
						});
					});

					it('GET status:404, when trying to use an invalid username value', () => {
						return request(app).get('/api/articles?filter=author&username=sam').expect(404).then((res) => {
							expect(res.body.msg).to.eql('User Not Found');
						});
					});

					it('GET status:404, when trying to use an invalid topic_name value', () => {
						return request(app).get('/api/articles?filter=topic&topic_name=sam').expect(404).then((res) => {
							expect(res.body.msg).to.eql('Topic Not Found');
						});
					});

					// it('GET status:200, the article data should be filtered in an descending order by the author', () => {
					// 	return request(app)
					// 		.get('/api/articles?order_by=author&username=icellusedkars&sort_by=asc')
					// 		.expect(200)
					// 		.then((res) => {
					// 			expect(res.body).to.be.ascendingBy('author');
					// 			expect(res.body).to.have.lengthOf(1);
					// 		});
					// });
				});
			});
			it('INVALID METHOD status:405,', () => {
				const invalidMethods = [ 'patch', 'put', 'post', 'delete' ];

				const methodPromise = invalidMethods.map((method) => {
					return request(app)[method]('/api/articles').expect(405).then((res) => {
						expect(res.body.msg).to.equal('Method Not Allowed');
					});
				});

				return Promise.all(methodPromise);
			});

			describe('/:article_id', () => {
				describe('CRUD methods', () => {
					describe('GET Requests for /:article_id', () => {
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
					});

					describe('PATCH Request for /:article_id', () => {
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
									expect(res.body.msg).to.equal('Invalid Key Value');
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
									expect(res.body.msg).to.equal('Invalid Key Value');
								});
						});

						it('PATCH status:400 when trying to update with one valid key and invalid keys value pair', () => {
							return request(app)
								.patch('/api/articles/1')
								.send({ inc_votes: 1, name: 'Mitch' })
								.expect(400)
								.then((res) => {
									expect(res.body.msg).to.equal('Invalid Key Value');
								});
						});

						it('PATCH status:400 when trying to update with values', () => {
							return request(app).patch('/api/articles/1').send({}).expect(400).then((res) => {
								expect(res.body.msg).to.equal('Require Input');
							});
						});

						it('PATCH status:400 when passed with a invalid article id', () => {
							return request(app).patch('/api/articles/andrew').send({ inc_votes: 1 }).expect(400).then((res) => {
								expect(res.body.msg).to.equal(
									'update "articles" set "votes" = "votes" + $1 where "article_id" = $2 returning * - invalid input syntax for integer: "andrew"'
								);
							});
						});

						it("PATCH status:404 when passed with an article id that's not in the database", () => {
							return request(app).patch('/api/articles/999').send({ inc_votes: 1 }).expect(404).then((res) => {
								expect(res.body.msg).to.equal('Article not found');
							});
						});
					});
				});
				it('INVALID METHOD status:405,', () => {
					const invalidMethods = [ 'put', 'post', 'delete' ];

					const methodPromise = invalidMethods.map((method) => {
						return request(app)[method]('/api/articles/1').expect(405).then((res) => {
							expect(res.body.msg).to.equal('Method Not Allowed');
						});
					});

					return Promise.all(methodPromise);
				});

				describe('/comments', () => {
					describe('CRUD methods', () => {
						describe('POST Request for /comments', () => {
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

							it('POST status:400 when trying to create a comment with invalid key value pair', () => {
								return request(app)
									.post('/api/articles/1/comments')
									.send({
										author: 123
									})
									.expect(400)
									.then((res) => {
										expect(res.body.msg).to.equal('Invalid key has been used');
									});
							});

							it('POST status:400 when trying to create a comment with one valid key and invalid keys value pair', () => {
								return request(app).post('/api/articles/1/comments').send({}).expect(400).then((res) => {
									expect(res.body.msg).to.equal('Require username and body input');
								});
							});
						});

						describe('GET Request for /comments', () => {
							it('GET status:200, when a a valid article_id is used', () => {
								return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
									expect(res.body[0]).to.contain.keys('author', 'body', 'comment_id', 'created_at', 'votes');
									expect(res.body.length).to.equal(13);
								});
							});

							it('GET status:200, when a valid article_id is used and the comments are sorted in an ascending order by the date it has been created', () => {
								return request(app).get('/api/articles/1/comments').expect(200).then((res) => {
									expect(res.body).to.be.sortedBy('created_at');
								});
							});

							it('GET status:200, when a valid article_id is used and the comments are sorted in an descending order by the date it has been created', () => {
								return request(app).get('/api/articles/1/comments?order=desc').expect(200).then((res) => {
									expect(res.body).to.be.descendingBy('created_at');
								});
							});

							it('GET status:200, when a valid article_id is used and the comments are sorted in an descending order by author', () => {
								return request(app).get('/api/articles/1/comments?sort_by=author').expect(200).then((res) => {
									expect(res.body).to.be.ascendingBy('author');
								});
							});

							it('GET status:400, when a invalid key is used', () => {
								return request(app).get('/api/articles/1/comments?sort_by=colour').expect(400).then((res) => {
									expect(res.body.msg).to.be.equal(
										'select "comment_id", "votes", "created_at", "author", "body" from "comments" where "article_id" = $1 order by "colour" asc - column "colour" does not exist'
									);
								});
							});

							it('GET status:400, when a invalid query is used', () => {
								return request(app).get('/api/articles/1/comments?create=colour').expect(400).then((res) => {
									expect(res.body.msg).to.be.equal('Invalid query is used');
								});
							});
						});
					});
					it('INVALID METHOD status:405,', () => {
						const invalidMethods = [ 'patch', 'put', 'delete' ];

						const methodPromise = invalidMethods.map((method) => {
							return request(app)[method]('/api/articles/1/comments').expect(405).then((res) => {
								expect(res.body.msg).to.equal('Method Not Allowed');
							});
						});

						return Promise.all(methodPromise);
					});
				});
			});
		});

		describe('/comments', () => {
			describe('/:comment_id', () => {
				describe('CRUD methods', () => {
					describe('PATCH Request for /:comment_id', () => {
						it('PATCH status:202 when the comment vote has been sucessfully updated', () => {
							return request(app)
								.patch('/api/comments/1')
								.send({
									inc_votes: 1
								})
								.expect(202)
								.then((res) => {
									expect(res.body.comment).to.contain.keys('comment_id', 'author', 'body', 'created_at', 'votes');
									expect(res.body.comment.votes).to.equal(17);
								});
						});

						it('PATCH status:400 when trying to update valid keys-value pairs using a string', () => {
							return request(app)
								.patch('/api/comments/1')
								.send({
									inc_votes: 'Andrew'
								})
								.expect(400)
								.then((res) => {
									expect(res.body.msg).to.equal(
										'update "comments" set "votes" = "votes" + $1 where "comment_id" = $2 returning * - invalid input syntax for integer: "NaN"'
									);
								});
						});

						it('PATCH status:400 when trying to update valid keys-value pairs that is not "vote"', () => {
							return request(app)
								.patch('/api/comments/1')
								.send({
									author: 'Andrew'
								})
								.expect(400)
								.then((res) => {
									expect(res.body.msg).to.equal('Invalid Key Value');
								});
						});

						it('PATCH status:400 when trying to update invalid keys value pair', () => {
							return request(app)
								.patch('/api/comments/1')
								.send({
									author_name: 'Andrew'
								})
								.expect(400)
								.then((res) => {
									expect(res.body.msg).to.equal('Invalid Key Value');
								});
						});

						it('PATCH status:400 when trying to update with one valid key and invalid keys value pair', () => {
							return request(app)
								.patch('/api/comments/1')
								.send({ inc_votes: 1, name: 'Mitch' })
								.expect(400)
								.then((res) => {
									expect(res.body.msg).to.equal('Invalid Key Value');
								});
						});

						it('PATCH status:400 when trying to update with values', () => {
							return request(app).patch('/api/comments/1').send({}).expect(400).then((res) => {
								expect(res.body.msg).to.equal('Require Input');
							});
						});

						it('PATCH status:400 when passed with a invalid article id', () => {
							return request(app)
								.patch('/api/comments/andrew')
								.send({
									inc_votes: 1
								})
								.expect(400)
								.then((res) => {
									expect(res.body.msg).to.equal(
										'update "comments" set "votes" = "votes" + $1 where "comment_id" = $2 returning * - invalid input syntax for integer: "andrew"'
									);
								});
						});

						it("PATCH status:404 when passed with an article id that's not in the database", () => {
							return request(app)
								.patch('/api/comments/999')
								.send({
									inc_votes: 1
								})
								.expect(404)
								.then((res) => {
									expect(res.body.msg).to.equal('Comment not found');
								});
						});
					});

					describe('DELETE Request for /:comment_id', () => {
						it('Delete status: 204, removes the comment from the content', () => {
							return request(app).delete('/api/comments/1').expect(204);
						});

						it('Delete status: 400, when invalid comment_id is used', () => {
							return request(app).delete('/api/comments/andrew').expect(400).then((res) => {
								expect(res.body.msg).to.equal(
									'delete from "comments" where "comment_id" = $1 - invalid input syntax for integer: "andrew"'
								);
							});
						});

						it('Delete status: 404, when passed an id that is not found', () => {
							return request(app).delete('/api/comments/9999').expect(404).then((res) => {
								expect(res.body.msg).to.equal('Page Not Found');
							});
						});
					});
				});
				it('INVALID METHOD status:405,', () => {
					const invalidMethods = [ 'get', 'put', 'post' ];

					const methodPromise = invalidMethods.map((method) => {
						return request(app)[method]('/api/comments/1').expect(405).then((res) => {
							expect(res.body.msg).to.equal('Method Not Allowed');
						});
					});

					return Promise.all(methodPromise);
				});
			});
		});
	});
});
