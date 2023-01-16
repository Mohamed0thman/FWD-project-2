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

export const getAllProducts = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productModel.getAllProduct();
    res.json({
      status: "success",
      data: products,
      message: "get all products Successed",
    });
  } catch (err) {
    next(err);
  }
};

export const getOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productModel.getOneProduct(
      req.params.id as unknown as string
    );
    res.json({
      status: "success",
      data: product,
      message: "get all product Successed",
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

    const product = await productModel.updateOneProduct(
      req.body,
      req.params.id as string
    );
    res.json({
      status: "success",
      data: product,
      message: "update product Successed",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productModel.deleteOneProduct(
      req.params.id as unknown as string
    );
    res.json({
      status: "success",
      data: product,
      message: "delete  product Successed",
    });
  } catch (err) {
    next(err);
  }
};
