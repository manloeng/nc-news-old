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
			it('return the topics data', () => {
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
	});
});
