import { Request, Response, NextFunction } from "express";
import OrderModel from "../models/order.model";

const orderModel = new OrderModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("dsadsadasd", res.locals.userId);

    const product = await orderModel.create({
      ...req.body,
      user_Id: res.locals.userId,
    });
    res.json({
      status: "success",
      data: { ...product },
      message: "product created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await orderModel.updateOne({
      ...req.body,
      user_Id: res.locals.userId,
    });
    res.json({
      status: "success",
      data: product,
      message: "product updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await orderModel.deleteOne(
      req.params.id as unknown as string
    );
    res.json({
      status: "success",
      data: product,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
