import db from "../db";
import query from "../helper/querybuilder";
import Product from "../types/product.types";
class ProductModel {
  async create(product: Product): Promise<Product[]> {
    const connection = await db.connect();

    try {
      const { name } = product;

      const existsql = `select  exists (select  count(*) from products
      where name = $1 having count(*) > 0) as exist`;
      const existProduct = await connection.query(existsql, [name]);

      if (existProduct.rows[0].exist) {
        throw Error("product name is exist");
      }

      const { sql, values } = query.insert("products", [product], ["*"]);

      const result = await connection.query(sql, values);

      return result.rows[0] as Product[];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not create product ${product.name}, ${
          (error as Error).message
        }`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  ///filter by category
  async filter(category: string): Promise<Product[]> {
    const connection = await db.connect();

    try {
      const sql = "SELECT * from products WHERE category = $1 ";
      const result = await connection.query(sql, [category]);
      return result.rows;
    } catch (error) {
      throw {
        status: 422,
        message: `Could not filter products by category ${category}, ${
          (error as Error).message
        }`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  //get top product
  async getTop(limit: string): Promise<Product[]> {
    const connection = await db.connect();

    try {
      const sql = `
      SELECT sum( op.quantity) as total_quantity, p.name, p.id  
      FROM order_product AS op
      INNER JOIN products AS p ON p.id = op.product_id
      GROUP BY  p.name, p.id
      ORDER BY total_quantity desc
      LIMIT $1
      `;
      const result = await connection.query(sql, [limit]);
      return result.rows;
    } catch (error) {
      throw {
        status: 422,
        message: `Could not get top ${limit} products,  ${
          (error as Error).message
        }`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
  // get all users
  async getAllProduct(): Promise<Product[]> {
    const connection = await db.connect();

    try {
      const sql = "SELECT id,  name, price, category from products";
      const result = await connection.query(sql);
      return result.rows;
    } catch (error) {
      throw {
        status: 422,
        message: `Could not get all products,  ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
  // get specific user
  async getOneProduct(id: string): Promise<Product> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id,  name, price, category FROM products 
        WHERE id=($1)`;

      const result = await connection.query(sql, [id]);

      if (!result.rows.length) {
        throw Error("product not exist");
      }
      return result.rows[0];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not find product,  ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
  // update user
  async updateOneProduct(product: Product, id: string): Promise<Product[]> {
    const connection = await db.connect();

    try {
      const { name } = product;

      if (name) {
        const existNameSql = `select  exists (select  count(*) from products
      where name = $1 having count(*) > 0) as exist`;
        const existProductName = await connection.query(existNameSql, [name]);

        if (existProductName.rows[0].exist) {
          throw Error("product name is exist");
        }
      }

      const { sql, values } = query.update("products", product, ["*"]);

      const result = await connection.query(sql, [...values, id]);

      if (!result.rows.length) {
        throw Error("product not exist");
      }
      return result.rows[0] as Product[];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not update product,  ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  // delete user
  async deleteOneProduct(id: string): Promise<Product> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM products 
                    WHERE id=($1) 
                    RETURNING id, name, price, category`;

      const result = await connection.query(sql, [id]);

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
    } finally {
      connection.release();
    }
  }
}
export default ProductModel;
