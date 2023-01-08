import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/product.model";

const productModel = new ProductModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productModel.create(req.body);
    res.json({
      status: "success",
      data: { ...product },
      message: "product created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getMany = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productModel.getMany();
    res.json({
      status: "success",
      data: products,
      message: "product retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productModel.getOne(
      req.params.id as unknown as string
    );
    res.json({
      status: "success",
      data: product,
      message: "product retrieved successfully",
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
    const product = await productModel.updateOne(req.body);
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
    const product = await productModel.deleteOne(
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
