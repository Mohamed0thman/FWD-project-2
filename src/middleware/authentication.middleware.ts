import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Error from "../interfaces/error.interface";
import config from "../config";

const UnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error("Login Error, Please login again");
  error.status = 401;
  next(error);
};

const unauthorizedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.get("Authorization");
    if (auth) {
      const token = auth.split(" ")[1];
      if (token) {
        jwt.verify(
          token,
          config.tokenSecret as unknown as string,
          async (err, decode) => {
            if (!err) {
              const decoded = decode as JwtPayload;
              res.locals.userId = decoded.user.id;
              next();
            } else {
              UnauthorizedError(next);
            }
          }
        );
      } else {
        // token type not bearer
        UnauthorizedError(next);
      }
    } else {
      // No Token Provided.
      UnauthorizedError(next);
    }
  } catch (err) {
    UnauthorizedError(next);
  }
};

export default unauthorizedMiddleware;
