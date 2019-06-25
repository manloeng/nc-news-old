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
						// console.log(res.body, '<----- res body');
						expect(res.body.article).to.contain.keys('title', 'topic', 'author', 'body', 'created_at', 'votes');
					});
				});

				it('GET status:400 when passed with a invalid article id', () => {
					return request(app).get('/api/users/andrew').expect(400).then((res) => {
						expect(res.body.msg).to.equal('Invalid article ID');
					});
				});
			});
		});
	});
});
