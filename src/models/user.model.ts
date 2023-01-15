import db from "../db";
import User from "../types/user.types";
import bcrypt from "bcrypt";
import config from "../config";
import query from "../helper/querybuilder";

const hashPassword = (password: string): string => {
  const salt = parseInt(config.salt as string, 10);
  console.log(`${password}${config.pepper}`);

  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserModel {
  async create(u: User): Promise<User> {
    const connection = await db.connect();

    try {
      const { email, firstName, lastName, password } = u;

      const existEmailSql = `select  exists (select  count(*) from users 
      where email = $1 having count(*) > 0) as exist`;
      const existEmail = await connection.query(existEmailSql, [email]);

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
      return result.rows[0];
    } catch (error) {
      throw {
        status: 401,
        message: `Could not create user ${u.email}, ${
          (error as Error).message
        }`,
        error: new Error(),
      };
    } finally {
      connection.release();
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
      throw {
        status: 401,
        message: `Error at retrieving user, ${(error as Error).message}`,
        error: new Error(),
      };
    }
  }
  // get specific user
  async getOne(id: string): Promise<User> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, email, firstName, lastName FROM users 
      WHERE id=($1)`;

      const result = await connection.query(sql, [id]);

      return result.rows[0];
    } catch (error) {
      throw {
        status: 401,
        message: `Could not find use, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
  // update user
  async updateOne(u: User, id: string): Promise<User> {
    const connection = await db.connect();

    try {
      const existEmailSql = `select  exists (select  count(*) from users 
      where email = $1 having count(*) > 0) as exist`;
      const existEmail = await connection.query(existEmailSql, [u.email]);

      if (existEmail.rows[0].exist) {
        throw Error("email is exist");
      }
      const { sql, values } = query.update("users", u);

      const result = await connection.query(sql, [...values, id]);

      if (!result.rows.length) {
        throw Error("user not exist");
      }
      return result.rows[0];
    } catch (error) {
      throw {
        status: 401,
        message: `Could not update user, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  // delete user
  async deleteOne(id: string): Promise<User> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM users 
                  WHERE id=($1) 
                  RETURNING id, email, firstName,lastName`;

      const result = await connection.query(sql, [id]);

      if (!result.rows.length) {
        throw Error("user not exist");
      }

      return result.rows[0];
    } catch (error) {
      throw {
        status: 401,
        message: `Could not delete user, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  // authenticate
  async authenticate(email: string, password: string): Promise<User | null> {
    const connection = await db.connect();

    try {
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
      console.log(isPasswordValid);

      if (!isPasswordValid) {
        throw Error("password not valid");
      }
      const userInfo = await connection.query(
        "SELECT id, email ,firstName,lastName FROM users WHERE email=($1)",
        [email]
      );
      return userInfo.rows[0];
    } catch (error) {
      throw {
        status: 401,
        message: `Unable to login, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
}

export default UserModel;
