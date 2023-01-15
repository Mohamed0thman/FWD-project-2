import supertest from "supertest";
import app from "../../index";
const HttpReqest = supertest(app);

describe("products end point", (): void => {
  let productId: string;
  let userId: string;
  let token: string;

  const name = "chair";
  const price = 200;
  const category = "living room";

  ///////////////////////////////////////////////////////////
  // signup api //
  ////////////////////////////////////////////////////////////

  it("create new user", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "product@gmail.com",
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
        email: "product@gmail.com",
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
  // create product  api //
  ////////////////////////////////////////////////////////////
  it("create new product", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/products")
      .set("Authorization", token)
      .send({
        name,
        price,
        category,
      })
      .then((res) => {
        productId = res.body.data.id;
        return res;
      });
    expect(response.status).toBe(200);
  });

  it("create product should fail product name already exists ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/products")
      .set("Authorization", token)
      .send({
        name,
        price,
        category,
      });

    expect(response.status).toBe(422);
  });
  it("create product should fail price should be integer", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/products")
      .set("Authorization", token)
      .send({
        name: "computer",
        price: -1,
        category,
      });
    expect(response.status).toBe(422);
  });
  it("create product should fail could not create not user ", async (): Promise<void> => {
    const response = await HttpReqest.delete(`/api/products/${productId}`)
      .set("Authorization", "123213213")
      .send({
        name,
        price,
        category,
      });

    expect(response.status).toBe(401);
  });
  ///////////////////////////////////////////////////////////
  // filter product  api //
  ////////////////////////////////////////////////////////////

  it("filter product by category success", async (): Promise<void> => {
    const response = await HttpReqest.get(
      `/api/products/filter?category=kitchen`
    ).set("Authorization", token);

    expect(response.status).toBe(200);
  });

  ///////////////////////////////////////////////////////////
  // get top limit product  api //
  ////////////////////////////////////////////////////////////

  it("get top  5  products success", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/products/top?limit=5`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(200);
  });

  it("get top 5 products should fail limit should be integer ", async (): Promise<void> => {
    const response = await HttpReqest.get(
      `/api/products/top?limit=dsadsadsad`
    ).set("Authorization", token);

    expect(response.status).toBe(422);
  });

  it("get top 5 products should fail limit required field", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/products/top?limit=`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(422);
  });

  ///////////////////////////////////////////////////////////
  // get all products  api //
  ////////////////////////////////////////////////////////////
  it("get all product", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/products`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(200);
  });
  it("get all product fail not user please login", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/products`).set(
      "Authorization",
      "dasdsadasd"
    );

    expect(response.status).toBe(401);
  });
  ///////////////////////////////////////////////////////////
  // get only one product  api //
  ////////////////////////////////////////////////////////////
  it("get product by id", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/products/${productId}`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(200);
  });

  it("should fail product not exist", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/products/100`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(422);
  });

  ///////////////////////////////////////////////////////////
  //  update product  api //
  ////////////////////////////////////////////////////////////

  it("update product success", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/products/${productId}`)
      .set("Authorization", token)
      .send({
        name: "screen",
        price: 3000,
        category: "office",
      });

    expect(response.status).toBe(200);
  });

  it("update should fail product name exist", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/products/${productId}`)
      .set("Authorization", token)
      .send({
        name: "bed",
        price: 3000,
        category: "bed room",
      });

    expect(response.status).toBe(422);
  });

  it("update should fail product not exsist", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/products/100`)
      .set("Authorization", token)
      .send({
        name: "tv",
        price: 3000,
        category: "living room",
      });

    expect(response.status).toBe(422);
  });
  ///////////////////////////////////////////////////////////
  // delete product  api //
  ////////////////////////////////////////////////////////////

  it("should fail could not delete not user  ", async (): Promise<void> => {
    const response = await HttpReqest.delete(`/api/products/${productId}`).set(
      "Authorization",
      "123213213"
    );

    expect(response.status).toBe(401);
  });
  it("delete product success", async (): Promise<void> => {
    const response = await HttpReqest.delete(`/api/products/${productId}`).set(
      "Authorization",
      token
    );

    expect(response.status).toBe(200);
  });
});
