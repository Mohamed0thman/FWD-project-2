import db from "../db";
import User from "../types/user.types";
import bcrypt from "bcrypt";
import config from "../config";
import query from "../helper/querybuilder";

const encodePassword = (password: string): string => {
  const saltRound = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepperKey}`, saltRound);
};

class UserModel {
  async createUser(u: User): Promise<User> {
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
        encodePassword(password as string),
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
  async getAllUsers(): Promise<User[]> {
    const connection = await db.connect();

    try {
      const sql = "SELECT id, email, firstName, lastName from users";
      const result = await connection.query(sql);
      return result.rows;
    } catch (error) {
      throw {
        status: 401,
        message: `Error at retrieving user, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
  // get specific user
  async getOneUser(id: string): Promise<User> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, email, firstName, lastName FROM users 
      WHERE id=($1)`;

      const result = await connection.query(sql, [id]);
      if (!result.rows.length) {
        throw Error("user not exist");
      }

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
  async updateOneUser(user: User, id: string): Promise<User> {
    const connection = await db.connect();
    try {
      const { email } = user;
      const existEmailSql = `select  exists (select  count(*) from users 
      where email = $1 having count(*) > 0) as exist`;
      const existEmail = await connection.query(existEmailSql, [email]);

      if (existEmail.rows[0].exist) {
        throw Error("email is exist");
      }
      const { sql, values } = query.update("users", user, [
        "id",
        "email",
        "firstName",
        "lastName",
      ]);

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
  async deleteOneUser(id: string): Promise<User> {
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

  // login
  async loginUser(email: string, password: string): Promise<User | null> {
    const connection = await db.connect();

    try {
      const sql = "SELECT password FROM users WHERE email=$1";

      const result = await connection.query(sql, [email]);
      if (!result.rows.length) {
        throw Error("email not exist");
      }
      const { password: hashPassword } = result.rows[0];
      const isPasswordValid = bcrypt.compareSync(
        `${password}${config.pepperKey}`,
        hashPassword
      );
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
