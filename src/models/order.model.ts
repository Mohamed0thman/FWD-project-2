/* eslint-disable no-useless-catch */
import db from "../db";
import { Order, Order_product } from "../types/order.types";

class OrderModel {
  // create order
  async create(o: Order): Promise<Order> {
    try {
      const { user_Id, status, Order_product } = o;
      const connection = await db.connect();
      const sql = `INSERT INTO orders ( user_Id,  status)
          values ($1, $2)
          RETURNING id, user_Id, status`;
      const result = await connection.query(sql, [user_Id, status]);

      const addOrderId = Order_product.map((item) => {
        return {
          ...item,
          order_Id: result.rows[0].id,
        };
      });

      let counter = 1;
      const placeHolder: string[] = [];
      const values: (string | number)[] = [];

      addOrderId.map((item) => {
        const num: string[] = [];
        for (const val of Object.values(item)) {
          num.push(`$${counter}`);
          values.push(val);
          counter++;
        }

        placeHolder.push(`(${num.toString()})`);
      });

      const productSql = `INSERT INTO order_product (quantity,product_id,order_id )
       values ${placeHolder.toString()} RETURNING* `;
      await connection.query(productSql, [...values]);

      const getOrderSql = `SELECT * FROM orders AS o
      INNER JOIN order_product AS op ON o.id = op.order_id
      INNER JOIN products AS p ON p.id = op.product_id
      WHERE o.id = $1
      `;
      const finalResult = await connection.query(getOrderSql, [
        result.rows[0].id,
      ]);

      connection.release();
      return finalResult.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // update order status to complite
  async updateOne(o: Order): Promise<Order> {
    const { user_Id, status } = o;

    try {
      const connection = await db.connect();
      const sql = `UPDATE orders
                        SET status=$1,
                        WHERE user_id=$2
                        RETURNING *`;

      const result = await connection.query(sql, [status, user_Id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update order, ${(error as Error).message}`);
    }
  }

  // delete order
  async deleteOne(id: string): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM orders
                        WHERE id=($1)
                        RETURNING *`;

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not delete order, ${(error as Error).message}`);
    }
  }
}
export default OrderModel;
