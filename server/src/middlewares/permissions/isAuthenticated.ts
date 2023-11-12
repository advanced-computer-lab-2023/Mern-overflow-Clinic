import { Request, Response, NextFunction } from "express";
import TokenUtils from "../../utils/Token.js";
import doctor, { IDoctor } from "../../models/Doctor.js";
import { HydratedDocument } from "mongoose";
import { UserType, UserTypesNames } from "../../enums/UserTypes.js";

interface TokenPayload {
	userId: string;
	userRole: UserType;
}

declare global {
	namespace Express {
		interface Request {
			userId: string;
			userRole: UserType;
		}
	}
}

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	let token, decodedToken: any;
	try {
		token = req.cookies.authorization;
		console.log(req.cookies);
		console.log(token);
		if (!TokenUtils.verifyToken(token)) {
			console.log("bad token");
			return res
				.status(401)
				.json({ message: "Unauthorized - Invalid token signature" });
		}

		decodedToken = TokenUtils.decodeToken(token);

		if (decodedToken.userRole === UserType.DOCTOR) {
			console.log("is a doctor")
			try {
				const doc = await doctor.findById(decodedToken.userId).exec();
				console.log(doc?.status)
				if (!doc || doc.status !== "accepted") {
				  return res.status(401).json({ message: "Unauthorized - Invalid token" });
				}
			  } catch (error) {
				console.error(error);
				return res.status(500).json({ message: "Internal server error" });
			  }	
		}
	} catch {
		if (!decodedToken) {
			return res.status(401).json({ message: "Unauthorized - Invalid token" });
		}
		if (!token) {
			return res
				.status(401)
				.json({ message: "Unauthorized - No token provided" }); // TODO
		}
	}

	next();
};


export default isAuthenticated;
