const jwt = require('jsonwebtoken');

const generatePolicy = (principalId, effect, resource) => {
	const authResponse = {};

	authResponse.principalId = principalId;

	if (effect && resource) {
		const policyDocument = {};
		policyDocument.Version = '2012-10-17';
		policyDocument.Statement = [];

		const statementOne = {};
		statementOne.Action = 'execute-api:Invoke';
		statementOne.Effect = effect;
		statementOne.Resource = resource;

		policyDocument.Statement[0] = statementOne;

		authResponse.policyDocument = policyDocument;
	}

	return authResponse;
};

module.exports.auth = async (event, context, callback) => {
	// Check header, url params or post params for token
	const token = event.authorizationToken;

	if (!token) {
		return callback(null, 'Unauthorized');
	}

	try {
		const isValid = await jwt.verify(token, process.env.JWT_SECRET);

		if (!isValid || !isValid.id) {
			return callback(null, 'Unauthorized');
		}

		return callback(null, generatePolicy(isValid.id, 'Allow', event.methodArn));
	} catch(errror) {
		return new Error(error);
	}
};