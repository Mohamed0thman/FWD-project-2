import db from "../db";
import query from "../helper/querybuilder";
import { Order } from "../types/order.types";

class OrderModel {
  // create order
  async create(o: Order): Promise<Order[]> {
    const connection = await db.connect();

    try {
      await connection.query("BEGIN");

      const { user_Id, Order_product } = o;

      let order_id: string;

      const activeSql = `select  id from orders where user_id = $1 and status= 'active'`;

      const activeOrder = await connection.query(activeSql, [user_Id]);

      if (activeOrder.rows.length) {
        console.log("exeest");

        order_id = activeOrder.rows[0].id;
      } else {
        console.log("not");

        const orderSql = `INSERT INTO orders ( user_Id) values ($1) RETURNING id`;
        const result = await connection.query(orderSql, [user_Id]);

        order_id = result.rows[0].id;
      }

      const addOrderId = Order_product.map((item) => {
        return {
          ...item,
          order_Id: order_id,
        };
      });

      const { sql, values } = query.insert("order_product", addOrderId);

      await connection.query(sql, [...values]);

      const getOrderSql = `SELECT * FROM orders AS o
      INNER JOIN order_product AS op ON o.id = op.order_id
      INNER JOIN products AS p ON p.id = op.product_id
      WHERE o.id = $1
      `;
      const finalResult = await connection.query(getOrderSql, [order_id]);

      await connection.query("COMMIT");

      return finalResult.rows;
    } catch (error) {
      await connection.query("ROLLBACK");

      throw {
        status: 422,
        message: `Could not create order  ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  // update order status to complite
  async updateOne(o: Order): Promise<Order> {
    const connection = await db.connect();

    try {
      const { user_Id } = o;

      const sql = `UPDATE orders
                        SET status=$1,
                        WHERE user_id=$2
                        RETURNING *`;

      const result = await connection.query(sql, ["complete", user_Id]);
      return result.rows[0];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not update order, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }

  // delete order
  async deleteOne(id: string): Promise<Order> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM orders
                        WHERE id=($1)
                        RETURNING *`;

      const result = await connection.query(sql, [id]);

      return result.rows[0];
    } catch (error) {
      throw {
        status: 422,
        message: `Could not delete order, ${(error as Error).message}`,
        error: new Error(),
      };
    } finally {
      connection.release();
    }
  }
}
export default OrderModel;
