const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

const signToken = async (id) => {
	return await jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '24h',
	});
}

const checkIfInputIsValid = (eventBody) => {
	if (!(eventBody.password && eventBody.password.length >= 7)) {
		return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));
	}

	if (!(eventBody.name && eventBody.name.length > 5 && typeof eventBody.name === 'string')) {
		return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));
	}

	if (!(eventBody.email && typeof eventBody.email === 'string')) {
		return Promise.reject(new Error('Email error. Email must have valid characters.'));
	}

	return Promise.resolve();
};


const comparePassword = async (eventPassword, userPassword, userId) => {
	try {
		const isValid = await bcrypt.compare(eventPassword, userPassword);
		if (!isValid) {
			return Promise.reject(new Error('The credentials do not match.'));
		}

		return signToken(userId);
	} catch(error) {
		return Promise.reject(new Error(error));
	}
}

exports.register = async (eventBody) => {
	console.log('registering....');
	const {name, email, password} = eventBody;

	try {
		await checkIfInputIsValid(eventBody);
		console.log('here')


		const user = await User.findOne({ email });

		if (user) {
			return Promise.reject(new Error('User with that email already exists!'));
		}

		const hash = await bcrypt.hash(password, 8);

		const newUser = await User.create({
			name,
			email,
			password: hash,
		});
		return {
			auth: true,
			token: await signToken(newUser._id),
		}
	} catch(error) {
		return Promise.reject(new Error(error));
	}
}

exports.login = async (eventBody) => {
	console.log('Logging in....');
	const {email, password} = eventBody;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return Promise.reject(new Error('User with that email does not exist'));
		}

		const token = await comparePassword(password, user.password, user._id);

		return {
			auth: true,
			token,
		};
	} catch (error) {
		return Promise.reject(new Error(error));
	}
}

exports.me = async (userId) => {
	try {
		const user = await User.findById(userId, { password: 0 });

		if (!user) {
			return Promise.reject('No user found');
		}

		return user;
	} catch(error) {
		return Promise.reject(new Error(error));
	}
}