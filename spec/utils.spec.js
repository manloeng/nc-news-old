const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
	it('returns null when passed without any integers', () => {
		const result = formatDate();
		expect(result).to.be.null;
	});
	it('returns the converted date when passed a Unix timestamp of 0', () => {
		const input = [ { created_at: 0 } ];
		const result = formatDate(input);
		expect(result).to.be.eql([ { created_at: new Date(0) } ]);
	});
	it('returns the converted date when passed with multiple Unix timestamp in an array', () => {
		const input = [ { created_at: 0 }, { created_at: 1561384201 }, { created_at: 1561303241 } ];
		const result = formatDate(input);
		expect(result).to.be.eql([
			{ created_at: new Date(0) },
			{ created_at: new Date(1561384201) },
			{ created_at: new Date(1561303241) }
		]);
	});
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
