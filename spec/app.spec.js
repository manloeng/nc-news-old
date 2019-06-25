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
			it('returns a single users data', () => {
				return request(app).get('/api/users/sam').expect(200).then((res) => {
					const user = {
						username: 'butter_bridge',
						name: 'sam',
						avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
					};
					console.log(res.body);
					expect(res.body).to.contain.keys('username', 'name', 'avatar_url');
					// expect(res.body).to.contain.keys('username', 'name', 'avatar_url');
				});
			});
		});
	});
});
