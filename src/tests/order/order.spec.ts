import supertest from "supertest";
import app from "../../index";
const HttpReqest = supertest(app);

describe("order end point", (): void => {
  let productId: string;
  let userId: string;
  let token: string;
  let orderId: string;

  ///////////////////////////////////////////////////////////
  // signup api //
  ////////////////////////////////////////////////////////////
  it("create new  order", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup")
      .send()
      .then((res) => {
        orderId = res.body.data.id;
        console.log(res.body.data.id);
        return res;
      });
    expect(response.status).toBe(201);
  });
});
