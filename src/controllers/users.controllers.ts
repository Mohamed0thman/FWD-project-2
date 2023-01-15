import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import config from "../config";
import Validation from "../helper/validation.helpers";

const userModel = new UserModel();

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, lastName, password, ConfirmPassword } = req.body;

    Validation.validate({ email }).required().isEmail();
    Validation.validate({ firstName }).required();
    Validation.validate({ lastName }).required();
    Validation.validate({ password })
      .required()
      .isPassword()
      ?.ConfirmPassword(ConfirmPassword);
    const user = await userModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: { ...user },
      message: "User created successfully",
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
    const users = await userModel.getMany();
    res.status(200).json({
      status: "success",
      data: users,
      message: "User retrieved successfully",
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
    const user = await userModel.getOne(req.params.id as unknown as string);
    res.status(200).json({
      status: "success",
      data: user,
      message: "User retrieved successfully",
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
    const user = await userModel.updateOne({ ...req.body }, req.params.id);
    res.status(200).json({
      status: "success",
      data: user,
      message: "User updated successfully",
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
    const user = await userModel.deleteOne(req.params.id as unknown as string);
    res.status(200).json({
      status: "success",
      data: user,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.authenticate(email, password);

    console.log(user);

    const token = jwt.sign({ user }, config.tokenSecret as unknown as string);

    return res.status(200).json({
      status: "success",
      data: { ...user, token },
      message: "user authenticated successfully",
    });
  } catch (err) {
    return next(err);
  }
};
