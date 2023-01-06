import { Request, Response } from "express";
import Error from "../interfaces/error.interface";
const errorMiddleware = (error: Error, _req: Request, res: Response) => {
  const status = error.status || 500;
  const message = error.message || "opps";
  res.status(status).json({ status, message });
};

export default errorMiddleware;
