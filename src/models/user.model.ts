/* eslint-disable no-useless-catch */
import db from "../db";
import User from "../types/user.types";
import bcrypt from "bcrypt";
import config from "../config";

const hashPassword = (password: string): string => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserModel {
  async create(u: User): Promise<User> {
    try {
      const { email, firstName, lastName, password } = u;

      const connection = await db.connect();
      const existEmailSql = `select  exists (select  count(*) from users 
      where email = $1 having count(*) > 0) as exist`;
      const existEmail = await connection.query(existEmailSql, [email]);

      console.log(existEmail.rows[0].exist);

      if (existEmail.rows[0].exist) {
        throw Error("email is exist");
      }
      const sql = `INSERT INTO users (email, firstName, lastName, password)
      values ($1, $2, $3, $4)
      RETURNING id, email, firstName, lastName`;
      const result = await connection.query(sql, [
        email,
        firstName,
        lastName,
        hashPassword(password as string),
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
      const sql = "SELECT id, email, firstName, lastName from users";
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
      const sql = `SELECT id, email, firstName, lastName FROM users 
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
  async updateOne(u: User, id: string): Promise<User> {
    try {
      const values: string[] = [];
      const placeHolders: string[] = [];
      Object.entries(u).map(([key, value], i) => {
        placeHolders.push(`${key}=$${i + 1}`);
        values.push(value);
      });

      const connection = await db.connect();
      const sql = `UPDATE users
      SET ${placeHolders.toString()}
      WHERE id=$${placeHolders.length + 1}
      RETURNING *`;
      const result = await connection.query(sql, [...values, id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update user, ${(error as Error).message}`);
    }
  }

  // delete user
  async deleteOne(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM users 
                  WHERE id=($1) 
                  RETURNING id, email, firstName,lastName`;

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
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = "SELECT password FROM users WHERE email=$1";

      const result = await connection.query(sql, [email]);
      if (!result.rows.length) {
        throw Error("email not exist");
      }
      const { password: hashPassword } = result.rows[0];
      const isPasswordValid = bcrypt.compareSync(
        `${password}${config.pepper}`,
        hashPassword
      );
      if (!isPasswordValid) {
        throw Error("password not valid");
      }
      const userInfo = await connection.query(
        "SELECT id, email , firstName,lastName FROM users WHERE email=($1)",
        [email]
      );
      connection.release();
      return userInfo.rows[0];
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`);
    }
  }
}

export default UserModel;
