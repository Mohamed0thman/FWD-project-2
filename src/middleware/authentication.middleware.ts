import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Error from "../interfaces/error.interface";
import config from "../config";

const handleUnauthorizedError = (next: NextFunction) => {
  const error: Error = new Error("Login Error, Please login again");
  error.status = 401;
  next(error);
};

const validateTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.get("Authorization");
    if (authHeader) {
      const bearer = authHeader.split(" ")[0].toLowerCase();
      const token = authHeader.split(" ")[1];


      if (token && bearer === "bearer") {
        const decode = jwt.verify(
          token,

          config.tokenSecret as unknown as string
        ) as JwtPayload;


        if (decode) {
          res.locals.userId = decode.user.id;

          next();
        } else {
          // Failed to authenticate user.
        }
      } else {
        // token type not bearer
        handleUnauthorizedError(next);
      }
    } else {
      // No Token Provided.
      handleUnauthorizedError(next);
    }
  } catch (err) {
    handleUnauthorizedError(next);
  }
};

export default validateTokenMiddleware;
