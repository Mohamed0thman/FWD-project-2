import OrderModel from "../../models/order.model";
import { Order } from "../../types/order.types";

const orderModel = new OrderModel();

describe("orders models test", (): void => {
  let order: Order;
  it("create order and save  order products ", async (): Promise<void> => {
    order = (await orderModel.create({
      user_Id: "1",
      Order_product: [
        {
          product_Id: "1",
          quantity: 5,
        },
        {
          product_Id: "1",
          quantity: 5,
        },
      ],
    } as Order)) as Order;
    expect(order).toBeTruthy();
  });

  it("update order status", async (): Promise<void> => {
    console.log(order.user_Id);

    const res = await orderModel.updateOne("1");
    expect(res?.status).toEqual("complete");
  });

  it("delete order", async (): Promise<void> => {
    const res = await orderModel.deleteOne(order.id as string);
    expect(res?.id).toEqual(order.id);
  });
});
