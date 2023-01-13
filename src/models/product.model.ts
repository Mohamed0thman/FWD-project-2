/* eslint-disable no-useless-catch */
import db from "../db";
import Product from "../types/product.types";
class ProductModel {
  async create(p: Product): Promise<Product> {
    try {
      const { name, price, category } = p;

      const connection = await db.connect();
      const sql = `INSERT INTO products ( name, price, category) 
        values ($1, $2, $3) 
        RETURNING id, name, price,category`;
      const result = await connection.query(sql, [name, price, category]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  ///filter by category
  async filter(category: string): Promise<Product[]> {
    try {
      const connection = await db.connect();
      const sql = "SELECT * from products WHERE category = $1 ";
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error at retrieving products ${(error as Error).message}`
      );
    }
  }

  //get top product
  async getTop(limit: string): Promise<Product[]> {
    try {
      const connection = await db.connect();
      console.log(limit);

      const sql = `
      SELECT sum( op.quantity) as total_quantity, p.name, p.id  FROM order_product AS op
      INNER JOIN products AS p ON p.id = op.product_id
      GROUP BY op.order_id , p.name, p.id
      ORDER BY total_quantity desc
      LIMIT $1
      `;
      const result = await connection.query(sql, [limit]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error at retrieving products ${(error as Error).message}`
      );
    }
  }
  // get all users
  async getMany(): Promise<Product[]> {
    try {
      const connection = await db.connect();
      const sql = "SELECT id,  name, price, category from products";
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
  async getOne(id: string): Promise<Product> {
    try {
      const sql = `SELECT id,  name, price, category FROM products 
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
      console.log(result.rows);

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
export default ProductModel;
