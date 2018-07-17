const connectToDatabase = require('../db');

const register = require('./helpers').register;

module.exports.register = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		const conenct = await connectToDatabase();

		const session = await register(JSON.parse(event.body));

		return {
			statusCode: 200,
			body: JSON.stringify(session),
		};

	} catch (error) {
		return {
			statusCode: error.statusCode || 500,
			headers: {
				'Content-Type': 'text/plain',
			},
			body: error.message,
		};
	}
};

module.exports.register = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		const connection = await connectToDatabase();
		const session = await login(JSON.parse(event.body));

		return {
			statusCode: 200,
			body: JSON.stringify(session),
		};
	} catch (error) {
		return {
			statusCode: error.statusCode || 500,
			headers: {
				'Content-Type': 'text/plain',
			},
			body: {
				message: error.message,
				stack: error.stack,
			},
		};
	}
}
