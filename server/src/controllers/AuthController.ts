import { Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import User, { IUser } from "../models/User.js";
import TokenUtils from "../utils/Token.js";
import sendMailService from "../services/emails/sendMailService.js";

const login = async (req: Request, res: Response) => {
	const { username, passwordHash } = req.body;
	console.log();
	try {
		const user: HydratedDocument<IUser> | null = await User.findOne({
			username,
			passwordHash,
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		} else {
			const token = await TokenUtils.generateToken(user);
			res.cookie("authorization", token, {
				httpOnly: true, // Make the cookie accessible only via HTTP (not JavaScript)
				secure: false,
			});
			const type = user.__t;
			const userId = user._id;
			res.status(200).json({ token, type, userId });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const logout = async (req: Request, res: Response) => {
	res.clearCookie("authorization");
	return res.status(200).json({ message: "Logout Successful" });
};

const changePassword = async (req: Request, res: Response) => {
	const newPasswordHash = req.body.newPasswordHash;
	const oldPassswordHash = req.body.oldPassswordHash;
	const token = req.cookies.authorization;
	const decodedToken = TokenUtils.decodeToken(token); // TODO handle verification before decoding
	try{
		const user = await User.findById(decodedToken?.userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if(user.passwordHash!= oldPassswordHash){
			return res.status(200).json({ message: "wrong password" });
		}
		user.passwordHash = newPasswordHash;
		await user.save();
	}catch(error){
		console.error(error);
		return res.status(401).json({ message: "Unauthorized - Invalid token signature" });
	}

	return res.status(200).json({ message: "changed password succesfully" });
};

const resetPassword = async (req: Request, res: Response) => {
	const to = req.body;
	console.log(to);
	sendMailService.sendMail(to ,"test","test");
}

export default {
	login,
	logout,
	changePassword,
	resetPassword,
};
