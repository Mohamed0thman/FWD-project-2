import db from "../db";
import { throwError } from "../helper/error.helper";
import query from "../helper/querybuilder";
import { Order } from "../types/order.types";

class OrderModel {
  // create order
  async create(order: Order): Promise<Order[] | undefined> {
    const connection = await db.connect();

    try {
      await connection.query("BEGIN");

      const { user_Id, Order_product } = order;

      let order_id: string;

      const activeSql = `select  id from orders where user_id = $1 and status= 'active'`;

      const activeOrder = await connection.query(activeSql, [user_Id]);

      if (activeOrder.rows.length) {
        order_id = activeOrder.rows[0].id;
      } else {
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

      const { sql, values } = query.insert("order_product", addOrderId, ["*"]);

      await connection.query(sql, [...values]);

      const getOrderSql = ` SELECT o.*,json_build_object('fistName',u.firstName,'lastName',u.lastName ) as user,
      (SELECT json_agg(json_build_object('order_id',op.order_id, 'quantity',op.quantity, 'name', p.name)) 
      from order_product AS op
      INNER JOIN products AS p ON p.id = op.product_id
      where op.order_id = o.id) as products
      FROM orders as o
      INNER JOIN users AS u ON u.id = o.user_id
      WHERE  u.id = $1 and o.id = $2
      `;
      const finalResult = await connection.query(getOrderSql, [
        user_Id,
        order_id,
      ]);

      await connection.query("COMMIT");

      return finalResult.rows[0];
    } catch (error) {
      await connection.query("ROLLBACK");
      throwError(`Could not create order  ${(error as Error).message}`, 422);
    } finally {
      connection.release();
    }
  }

  // update order status to complite
  async updateOne(order: Order): Promise<Order | undefined> {
    const connection = await db.connect();

    try {
      const { user_Id } = order;

      const sql = `UPDATE orders  SET status=$1  WHERE user_id = $2 and  status = $3 RETURNING *`;

      const result = await connection.query(sql, [
        "complete",
        user_Id,
        "active",
      ]);

      if (!result.rows.length) {
        throw Error("order not exist");
      }
      return result.rows[0];
    } catch (error) {
      throwError(`Could not update order, ${(error as Error).message}`, 422);
    } finally {
      connection.release();
    }
  }

  // delete order
  async deleteOne(id: string): Promise<Order | undefined> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM orders
                        WHERE id=($1)
                        RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (!result.rows.length) {
        throw Error("order not exist");
      }
      return result.rows[0];
    } catch (error) {
      throwError(`Could not delete order, ${(error as Error).message}`, 422);
    } finally {
      connection.release();
    }
  }
}
export default OrderModel;
