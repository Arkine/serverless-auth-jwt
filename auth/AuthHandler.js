const connectToDatabase = require('../db');

const register = require('./helpers').register;
const login = require('./helpers').login;
const me = require('./helpers').me;

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

module.exports.login = async (event, context) => {
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

module.exports.me = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		const connect = await connectToDatabase();

		// the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
		const session = await me(event.requestContext.authorizer.principalId);

		return {
			statusCode: 200,
			body: JSON.stringify(session),
		}
	} catch(error) {
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