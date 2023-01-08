/* eslint-disable no-useless-catch */
import db from "../db";
import User from "../types/user.types";
import bcrypt from "bcrypt";
import config from "../config";
import { validation } from "../helper/validation.helpers";

const hashPassword = (password: string): string => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserModel {
  async create(u: User): Promise<User> {
    try {
      const { firstName, lastName, password } = u;

      await new validation({ firstName })
        .required()
        .uniqe("users", "firstName");
      new validation({ lastName }).required();
      new validation({ password }).required();

      const connection = await db.connect();
      const sql = `INSERT INTO users ( firstName, lastName, password) 
      values ($1, $2, $3) 
      RETURNING id, firstName, lastName`;
      const result = await connection.query(sql, [
        u.firstName,
        u.lastName,
        hashPassword(u.password as string),
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // get all users
  async getMany(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = "SELECT id, firstName, lastName from users";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error at retrieving users ${(error as Error).message}`);
    }
  }
  // get specific user
  async getOne(id: string): Promise<User> {
    try {
      const sql = `SELECT id, firstName, lastName FROM users 
      WHERE id=($1)`;

      const connection = await db.connect();

      const result = await connection.query(sql, [id]);

      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find user ${id}, ${(error as Error).message}`);
    }
  }
  // update user
  async updateOne(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users 
                  SET firstName=$1, lastName=$2 , password=$3
                  WHERE id=$4
                  RETURNING id, firstName, lastName`;

      const result = await connection.query(sql, [
        u.firstName,
        u.lastName,
        hashPassword(u.password as string),
        u.id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update user: ${u.firstName + u.lastName}, ${
          (error as Error).message
        }`
      );
    }
  }

  // delete user
  async deleteOne(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM users 
                  WHERE id=($1) 
                  RETURNING id, firstName,lastName`;

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete user ${id}, ${(error as Error).message}`
      );
    }
  }

  // authenticate
  async authenticate(
    firstName: string,
    password: string
  ): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = "SELECT password FROM users WHERE firstName=$1";

      const result = await connection.query(sql, [firstName]);
      console.log("result", result);

      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );
        if (isPasswordValid) {
          const userInfo = await connection.query(
            "SELECT id, firstName,lastName FROM users WHERE firstName=($1)",
            [firstName]
          );
          return userInfo.rows[0];
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`);
    }
  }
}

export default UserModel;
