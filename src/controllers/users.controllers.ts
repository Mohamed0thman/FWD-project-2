import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import config from "../config";
import Validation from "../helper/validation.helpers";

const userModel = new UserModel();

export const createUser = async (
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
    const user = await userModel.createUser(req.body);
    res.status(201).json({
      status: "success",
      data: { ...user },
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({
      status: "success",
      data: users,
      message: "get all users successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.getOneUser(req.params.id as unknown as string);
    res.status(200).json({
      status: "success",
      data: user,
      message: "get user by id successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updateOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    Validation.validate({ email }).isNotEmpty()?.isEmail();
    Validation.validate({ password }).isNotEmpty()?.isPassword();
    Validation.validate({ firstName }).isNotEmpty();
    Validation.validate({ lastName }).isNotEmpty();

    const user = await userModel.updateOneUser({ ...req.body }, req.params.id);
    res.status(200).json({
      status: "success",
      data: user,
      message: "Update User Successed",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.deleteOneUser(
      req.params.id as unknown as string
    );
    res.status(200).json({
      status: "success",
      data: user,
      message: "Delete User Successed",
    });
  } catch (err) {
    next(err);
  }
};
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.loginUser(email, password);

    const token = jwt.sign({ user }, config.tokenSecretKey as unknown as string);

    return res.status(200).json({
      status: "success",
      data: { ...user, token },
      message: "user authenticated successfully",
    });
  } catch (err) {
    return next(err);
  }
};
