const connectToDatabase = require('../db');
const User = require('./User');

/**
 * Functions
 */

 module.exports.getUsers = async (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;

	try {
		const connect = await connectToDatabase();
		const users = await getUsers();

		return {
			statusCode: 200,
			body: JSON.stringify(users),
		};

	} catch (error) {
		return {
			statusCode: error.statusCode || 500,
			headers: {
				'Content-Type': 'text/plain',
			},
			body: JSON.stringify({ message: err.message }),
		};
	}
 };

 async function getUsers() {
	 try {
		 return await User.find({})
	 } catch(error) {
		throw new Error(error);
	 }
 }