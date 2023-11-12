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
  let token, decodedToken: any;

  try {
    token = req.cookies.authorization;

    if (!TokenUtils.verifyToken(token)) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token signature" });
    }

    decodedToken = TokenUtils.decodeToken(token);

    if (decodedToken.userRole === UserType.DOCTOR) {
      getDoctor(decodedToken.userId)
        .then((doc) => {
          console.debug(
            "DEBUGPRINT[9]: isAuthenticated.ts:38: doc.status=",
            doc?.status,
          );
          if (!doc || doc.status != "accepted") {
            return res
              .status(401)
              .json({ message: "Unauthorized - Invalid token" });
          }
          console.debug(
            "DEBUGPRINT[9]: isAuthenticated.ts:38: doc.status=",
            doc?.status,
          );
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        });
    }
  } catch {
    if (!decodedToken) {
      console.log("UNAUTHORIZED");
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" }); // TODO
    }
  }

  console.log("SHOULDN't GO TO NEXT");
  next();
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
