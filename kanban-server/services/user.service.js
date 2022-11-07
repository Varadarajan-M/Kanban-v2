const jwt = require('jsonwebtoken');
const { hashPassword, isStrFalsy, isPasswordMatching } = require('../helper');

const User = require('../models/user.model');
const ERROR_RESPONSE = {
	ok: false,
};

exports.register = async ({ email, password, username }) => {
	try {
		const user = await User.findOne({ email });
		if (!!user) {
			return ERROR_RESPONSE;
		}
		hash = hashPassword(password);
		const dbResponse = await User.create({
			email,
			hash,
			username,
		});
		return { ok: true, user: dbResponse };
	} catch (e) {
		return ERROR_RESPONSE;
	}
};

exports.login = async ({ email, password }) => {
	try {
		const user = await User.findOne({ email }).lean();
		const userExistsAndPasswordMatches = !isStrFalsy(user?.email) && isPasswordMatching(password, user?.hash);

		if (userExistsAndPasswordMatches) {
			const token = jwt.sign({ userID: user._id, email: user.email }, process.env.SECRET, { expiresIn: '30m' });

			return {
				ok: true,
				user: {
					email: user.email,
					token: token,
					username: user.username,
				},
			};
		}
		return ERROR_RESPONSE;
	} catch (e) {
		return ERROR_RESPONSE;
	}
};
exports.fetchUsers = async (name) => {
	try {
		let users;
		const selection = { username: 1, email: 1 };
		if (!name) {
			users = await User.find({}, selection);
		} else {
			users = await User.find({ username: { $regex: name, $options: 'i' } }, selection);
		}
		return { ok: true, users };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};

exports.getOneUser = async (userId) => {
	try {
		const selection = { username: 1 };
		const user = await User.findOne({ _id: userId }, selection);
		return { ok: true, user };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};
