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
