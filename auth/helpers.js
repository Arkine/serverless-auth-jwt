const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

exports.signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '24h',
	});
}

exports.checkIfInputIsValid = (eventBody) => {
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

exports.register = async (eventBody) => {
	const {name, email, password} = eventBody;

	try {
		await checkIfInputIsValid(eventBody);

		const user = await user.findOne({ email });

		if (user) {
			return Promise.reject(new Error('User with that email already exists!'));
		}

		const hash = await bcrypt.hash(password, 8);

		const user = await User.create({
			name,
			email,
			password: hash,
		});

		return {
			auth: true,
			token: signToken(user._id),
		}
	} catch(error) {
		return new Error(error);
	}
}

exports.login = async (eventBody) => {
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
		return new Error(error);
	}
}

exports.comparePassword = async (eventPassword, userPassword, userId) => {
	try {
		const isValid = await bcrypt.compare(eventPassword, userPassword);
		if (!isValid) {
			return Promise.reject(new Error('The credentials do not match.'));
		}

		return signToken(userId);
	} catch(error) {
		return new Error(error);
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