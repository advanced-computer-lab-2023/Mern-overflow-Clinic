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

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  let token, decodedToken;
  try {
    token = req.cookies.authorization;

    decodedToken = TokenUtils.decodeToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    } else if (decodedToken.userRole === UserType.DOCTOR) {
      getDoctor(decodedToken.userId)
        .then((doc) => {
          if (!doc || doc.status != "accepted") {
            return res
              .status(401)
              .json({ message: "Unauthorized - Invalid token" });
          }
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        });
    }

    next();
  } catch {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });// TODO
    }

    if (!TokenUtils.verifyToken(token)) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token signature" });
    }
  }
};

const getDoctor = async (
  id: string,
): Promise<HydratedDocument<IDoctor> | null> => {
  const doc: HydratedDocument<IDoctor> | null = await doctor
    .findById(id)
    .exec();
  return doc;
};

export default isAuthenticated;
