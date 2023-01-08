/* eslint-disable no-useless-catch */
import db from "../db";
import Order from "../types/order.types";
import { Validation } from "../helper/validation.helpers";

class OrderModel {
  async create(o: Order): Promise<Order> {
    try {
      const { user_Id } = o;

      new Validation({ user_Id }).required();

      const connection = await db.connect();
      const sql = `INSERT INTO orders ( user_Id, product_Id, quantity, state) 
          values ($1, $2, $3,#4) 
          RETURNING id, user_Id, product_Id, quantity, state`;
      const result = await connection.query(sql, [user_Id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // get all users
  async getMany(): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql =
        "SELECT id, user_Id, product_Id, quantity, state from products";
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error at retrieving products ${(error as Error).message}`
      );
    }
  }
  // get specific user
  async getOne(id: string): Promise<Order> {
    try {
      const sql = `SELECT id, firstName, lastName FROM products 
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
  async updateOne(p: Product): Promise<Product> {
    try {
      const { id, name, price, category } = p;

      const connection = await db.connect();
      const sql = `UPDATE products 
                      SET name=$1, price=$2 , category=$3
                      WHERE id=$4
                      RETURNING id, name, price,category`;

      const result = await connection.query(sql, [name, price, category, id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update product: ${p.name}, ${(error as Error).message}`
      );
    }
  }

  // delete user
  async deleteOne(id: string): Promise<Product> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM products 
                      WHERE id=($1) 
                      RETURNING id, name, price, category`;

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete products ${id}, ${(error as Error).message}`
      );
    }
  }
}
export default OrderModel;
