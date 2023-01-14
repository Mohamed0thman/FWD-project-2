import supertest from "supertest";
import app from "../../index";
const HttpReqest = supertest(app);

describe("users end point", (): void => {
  let productId: string;
  let userId: string;
  let token: string;

  const name = "ttfttt ";
  const price = 200;
  const category = "shose";

  ///////////////////////////////////////////////////////////
  // signin api //
  ////////////////////////////////////////////////////////////

  it("user login in ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signin")
      .send({
        email: "test@gmail.com",
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
  // signup api //
  ////////////////////////////////////////////////////////////
  it("create new product", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup")
      .send({
        name,
        price,
        category,
      })
      .then((res) => {
        productId = res.body.data.id;
        return res;
      });
    expect(response.status).toBe(201);
  });

  it("should fail product name already exists ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup")
      .send({
        name,
        price,
        category,
      })
      .then((res) => {
        productId = res.body.data.id;
        return res;
      });
    expect(response.status).toBe(422);
  });
});
