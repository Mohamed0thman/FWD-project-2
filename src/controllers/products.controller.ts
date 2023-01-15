import { Request, Response, NextFunction } from "express";
import Validation from "../helper/validation.helpers";
import ProductModel from "../models/product.model";

const productModel = new ProductModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, category } = req.body;
    Validation.validate({ name }).required().isNotEmpty();
    Validation.validate({ price }).required().isInt();
    Validation.validate({ category }).isNotEmpty();
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

export const filter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    Validation.validate({ category: req.query.category as string })
      .required()
      .isNotEmpty();

    const product = await productModel.filter(req.query.category as string);
    res.json({
      status: "success",
      data: { ...product },
      message: "product filterd successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getTop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req.params.limit");

  try {
    Validation.validate({ limit: req.query.limit as string })
      .required()
      .isInt();

    const product = await productModel.getTop(req.query.limit as string);
    res.json({
      status: "success",
      data: { ...product },
      message: "get top products successfully",
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
    const { name, price, category } = req.body;

    Validation.validate({ name }).isNotEmpty();
    Validation.validate({ price }).isInt();
    Validation.validate({ category }).isNotEmpty();

    const product = await productModel.updateOne(
      req.body,
      req.params.id as string
    );
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
      message: "product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
