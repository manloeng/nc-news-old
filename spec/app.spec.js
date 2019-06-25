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
		connection.seed.run();
	});

	it('/not-a-route', () => {
		return request(app).get('/not-a-route').expect(404).then((res) => {
			expect(res.body.msg).to.equal('Page Not Found');
		});
	});

	describe('/api', () => {
		describe('/topics', () => {
			it('', () => {
				return request(app).get('/api/topics').expect(200).then((results) => {
					console.log(results);
				});
			});
		});
	});
});
