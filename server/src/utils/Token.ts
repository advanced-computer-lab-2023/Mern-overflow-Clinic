import jwt from 'jsonwebtoken';
import User,{ IUser } from '../models/User.js';
import { HydratedDocument } from 'mongoose';
import config from '../config/config.js';
import { UserType, UserTypesNames } from '../enums/UserTypes.js';

const generateToken = async (user: HydratedDocument<IUser>) => {
	const secretKey = config.jwt.secret;
	const expiresIn = '7d';

	const token = jwt.sign(
		{
			patientId: user._id,
			userRole: UserTypesNames.get(user.__t),
		},
		secretKey,
		{ expiresIn }
	);

	return token;
};


export default {
	generateToken
}


