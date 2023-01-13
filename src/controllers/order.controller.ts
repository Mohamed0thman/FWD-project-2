import { Request, Response, NextFunction } from "express";
import OrderModel from "../models/order.model";

const orderModel = new OrderModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await orderModel.create(req.body);
    res.json({
      status: "success",
      data: { ...product },
      message: "product created successfully",
    });
  } catch (err) {
    next(err);
  }
};
