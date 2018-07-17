const mongoose = require('mongoose');

let isConnected;

module.exports = connectToDatabase = async () => {
	if (isConnected) {
		console.log('Using existing connection...');
		return Promise.resolve();
	}

	console.log('Using a new DB connection...');

	try {
		const db = await mongoose.connect(process.env.DB);

		isConnected = db.connections[0].readyState;
	} catch(error) {
		return Promise.reject(new Error(error));
	}
};