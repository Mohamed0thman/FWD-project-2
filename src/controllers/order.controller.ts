import { Request, Response, NextFunction } from "express";
import { throwError } from "../helper/error.helper";
import OrderModel from "../models/order.model";

const orderModel = new OrderModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Order_product } = req.body;
    if (!Order_product.length) return throwError("please insert product", 422);

    const order = await orderModel.create({
      ...req.body,
      user_Id: res.locals.userId,
    });
    res.json({
      status: "success",
      data: { ...order },
      message: "product created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderModel.updateOne({
      ...req.body,
      user_Id: res.locals.userId,
    });
    res.json({
      status: "success",
      data: order,
      message: "product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderModel.deleteOne(
      req.params.id as unknown as string
    );
    res.json({
      status: "success",
      data: order,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
