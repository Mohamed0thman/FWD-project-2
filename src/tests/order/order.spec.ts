import supertest from "supertest";
import app from "../../index";
const HttpReqest = supertest(app);

describe("order end point", (): void => {
  let userId: string;
  let token: string;
  let orderId: string;

  const order = {
    Order_product: [
      {
        quantity: 2,
        product_Id: "2",
      },
      {
        quantity: 4,
        product_Id: "3",
      },
      {
        quantity: 2,
        product_Id: "4",
      },
    ],
  };

  ///////////////////////////////////////////////////////////
  // sign up api //
  ////////////////////////////////////////////////////////////

  it("create new user", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "order@gmail.com",
      firstName: "ahmed",
      lastName: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });

    expect(response.status).toBe(201);
  });

  ///////////////////////////////////////////////////////////
  // signin api //
  ////////////////////////////////////////////////////////////

  it("user login in ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signin")
      .send({
        email: "order@gmail.com",
        password: "123456asdf",
      })
      .then((res) => {
        token = `Bearer ${res.body.data.token}`;
        userId = res.body.data.id;
        return res;
      });
    expect(response.status).toBe(200);
  });
  ///////////////////////////////////////////////////////////
  // create order api //
  ////////////////////////////////////////////////////////////
  it("create new  order", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/orders")
      .set("Authorization", token)
      .send(order)
      .then((res) => {
        console.log("orderId", res.body.data);

        orderId = res.body.data.id;
        return res;
      });
    expect(response.status).toBe(200);
  });
  it(" should fail could not create order please select product ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/orders")
      .set("Authorization", token)
      .send({
        Order_product: [],
      });

    expect(response.status).toBe(422);
  });

  it("should fail could not create order not user please login", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/orders")
      .set("Authorization", "asdas")
      .send(order);

    expect(response.status).toBe(401);
  });

  ///////////////////////////////////////////////////////////
  // update  order to complete api //
  ////////////////////////////////////////////////////////////
  it("update order", async (): Promise<void> => {
    const response = await HttpReqest.patch("/api/orders").set(
      "Authorization",
      token
    );

    expect(response.status).toBe(200);
  });

  it("should fail could not update order not user please login", async (): Promise<void> => {
    const response = await HttpReqest.patch("/api/orders").set(
      "Authorization",
      "asdas"
    );

    expect(response.status).toBe(401);
  });

  ///////////////////////////////////////////////////////////
  // delete  order  api //
  ////////////////////////////////////////////////////////////
  it("update order", async (): Promise<void> => {
    const response = await HttpReqest.delete(`/api/orders/${orderId}`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(200);
  });

  it("delete user", async (): Promise<void> => {
    console.log("id", userId);

    const response = await HttpReqest.delete(`/api/users/${userId}`)
      .set("Authorization", token)
      .then((res) => {
        console.log(res.body);
        return res;
      });
    expect(response.status).toBe(200);
  });
});
