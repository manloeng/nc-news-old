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
	it('returns the converted date when passed with multiple keys value pairs and the Unix timestamp in an array', () => {
		const input = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			},
			{
				title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
				topic: 'coding',
				author: 'jessjelly',
				body:
					'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
				created_at: 1500584273256
			},
			{
				title: '22 Amazing open source React projects',
				topic: 'coding',
				author: 'happyamy2016',
				body:
					'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
				created_at: 1500659650346
			}
		];
		const result = formatDate(input);
		expect(result[0]).to.contain.keys('title', 'topic', 'author', 'body', 'created_at');
	});
});

describe('makeRefObj', () => {
	it('returns an empty object when passed with an array containing an empty object', () => {
		const input = [ {} ];
		const result = makeRefObj(input);
		expect(result).to.be.eql({});
	});
	it('returns an amended key-value pair in the object', () => {
		const input = [
			{
				article_id: 1000,
				title: 'Running a Node App'
			}
		];
		const result = makeRefObj(input);
		expect(result).to.be.eql({ 'Running a Node App': 1000 });
	});
	it('returns an amended key-value pair in the object when passed with multiple articles', () => {
		const input = [
			{
				article_id: 1000,
				title: 'Running a Node App'
			},
			{
				article_id: 10,
				title: 'Running away'
			},
			{
				article_id: 1,
				title: 'Running so far'
			}
		];
		const result = makeRefObj(input);
		expect(result).to.be.eql({ 'Running a Node App': 1000, 'Running away': 10, 'Running so far': 1 });
	});
});

describe('formatComments', () => {
	it('returns an empty object when passed with an array containing an empty object', () => {
		const input = [ {} ];
		const result = formatComments(input);
		expect(result).to.be.eql({});
	});
	it('returns the converted date when passed with multiple Unix timestamp in an array', () => {
		const input = [ { created_at: 1471522072389 } ];
		const result = formatComments(input);
		expect(result).to.be.eql([ { created_at: new Date(1471522072389) } ]);
	});
	it('returns the converted date when passed with multiple Unix timestamp in an array', () => {
		const input = [ { created_at: 0 }, { created_at: 1561384201 }, { created_at: 1561303241 } ];
		const result = formatComments(input);
		expect(result).to.be.eql([
			{ created_at: new Date(0) },
			{ created_at: new Date(1561384201) },
			{ created_at: new Date(1561303241) }
		]);
	});
	it('returns a single amended key-value pair in the object', () => {
		const articleRef = {
			'Running a Node App': 1,
			'Running away': 2,
			'Running so far': 3,
			'Running for your dream': 4,
			'Run while you can': 5
		};
		const input = [
			{
				belongs_to: 'Running a Node App'
			}
		];
		const result = formatComments(input, articleRef);
		expect(result).to.be.eql([ { article_id: 1 } ]);
	});
	it('returns a new key "author" in the object ', () => {
		const input = [ { created_by: 'tickle122' } ];
		const result = formatComments(input);
		expect(result).to.be.eql([ { author: 'tickle122' } ]);
	});
	it('returns multiple amended key-value pair in the object', () => {
		const articleRef = {
			'Running a Node App': 10,
			'Running away': 22,
			'Running so far': 333,
			'Running for your dream': 14,
			'Run while you can': 55
		};
		const input = [
			{
				belongs_to: 'Running a Node App'
			},
			{
				belongs_to: 'Run while you can'
			},
			{
				belongs_to: 'Running so far'
			}
		];
		const result = formatComments(input, articleRef);
		expect(result).to.be.eql([ { article_id: 10 }, { article_id: 55 }, { article_id: 333 } ]);
	});
	it('returns all the key-value pair in the object including the newly ammended ones', () => {
		const articleRef = {
			'Running a Node App': 10,
			'Running away': 22,
			'Running so far': 333,
			'Running for your dream': 14,
			'Run while you can': 55
		};
		const input = [
			{
				body:
					'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
				belongs_to: 'Running away',
				created_by: 'tickle122',
				votes: -1,
				created_at: 1468087638932
			}
		];
		const result = formatComments(input, articleRef);
		expect(result[0]).to.contain.keys('body', 'article_id', 'author', 'votes', 'created_at');
	});
});
