import db from "../db";
import Validation from "../helper/validation.helpers";
import Product from "../types/product.types";
class ProductModel {
  async create(p: Product): Promise<Product> {
    try {
      const { name, price, category } = p;
      Validation.validate({ name }).required().isNotEmpty();
      Validation.validate({ price }).required().isInt();
      Validation.validate({ category }).isNotEmpty();

      const keys: string[] = [];
      const values: (string | number)[] = [];
      const placeHolders: string[] = [];

      Object.entries(p).map(([key, value], i) => {
        keys.push(key);
        values.push(value);
        placeHolders.push(`$${i + 1}`);
      });

      const connection = await db.connect();
      const existsql = `select  exists (select  count(*) from products 
      where name = $1 having count(*) > 0) as exist`;
      const existProduct = await connection.query(existsql, [name]);

      if (existProduct.rows[0].exist) {
        throw Error("product name is exist");
      }

      const sql = `INSERT INTO products ( ${keys.toString()}) 
        values (${placeHolders.toString()}) 
        RETURNING id, name, price,category`;

      const result = await connection.query(sql, values);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not create product ${p.name}, ${
          (error as Error).message
        }`,
        error: new Error(),
      };
    }
  }

  ///filter by category
  async filter(category: string): Promise<Product[]> {
    try {
      Validation.validate({ category }).required().isNotEmpty();

      const connection = await db.connect();
      const sql = "SELECT * from products WHERE category = $1 ";
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw {
        status: 422,
        message: `Could not filter products by category ${category}, ${
          (error as Error).message
        }`,
        error: new Error(),
      };
    }
  }

  //get top product
  async getTop(limit: string): Promise<Product[]> {
    try {
      const connection = await db.connect();
      Validation.validate({ limit }).required().isInt();
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
      throw {
        status: 422,
        message: `Could not get top ${limit} products,  ${
          (error as Error).message
        }`,
        error: new Error(),
      };
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
      throw {
        status: 422,
        message: `Could not get all products,  ${(error as Error).message}`,
        error: new Error(),
      };
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
      throw {
        status: 422,
        message: `Could not find product,  ${(error as Error).message}`,
        error: new Error(),
      };
    }
  }
  // update user
  async updateOne(p: Product, id: string): Promise<Product> {
    try {
      const { name, price, category } = p;

      Validation.validate({ name }).isNotEmpty();
      Validation.validate({ price }).isInt();
      Validation.validate({ category }).isNotEmpty();

      const connection = await db.connect();

      if (name) {
        const existNameSql = `select  exists (select  count(*) from products 
      where name = $1 having count(*) > 0) as exist`;
        const existProductName = await connection.query(existNameSql, [name]);

        if (existProductName.rows[0].exist) {
          throw Error("product name is exist");
        }
      }
      const values: (string | number)[] = [];
      const placeHolders: string[] = [];
      Object.entries(p).map(([key, value], i) => {
        placeHolders.push(`${key}=$${i + 1}`);
        values.push(value);
      });

      const sql = `UPDATE products
      SET ${placeHolders.toString()}
      WHERE id=$${placeHolders.length + 1}
      RETURNING id, name, price, category`;
      const result = await connection.query(sql, [...values, id]);
      console.log(result.rows);

      connection.release();

      if (!result.rows.length) {
        throw Error("product not exist");
      }
      return result.rows[0];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not update product,  ${(error as Error).message}`,
        error: new Error(),
      };
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

      if (!result.rows.length) {
        throw Error("product not exist");
      }

      return result.rows[0];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not delete products,  ${(error as Error).message}`,
        error: new Error(),
      };
    }
  }
}
export default ProductModel;
