const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
	it('returns null when passed without any integers', () => {
		const result = formatDate();
		expect(result).to.be.null;
	});
	it('returns the converted date when passed a Unix timestamp of 0', () => {
		const input = [ 0 ];
		const result = formatDate(input);
		expect(result).to.be.equal('January 1, 1970 at 00:00:00');
	});
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
