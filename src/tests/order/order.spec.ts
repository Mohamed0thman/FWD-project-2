import supertest from "supertest";
import app from "../../index";
const HttpReqest = supertest(app);

describe("users end point", (): void => {
  let userId: string;
  let token: string;

  ///////////////////////////////////////////////////////////
  // signup api //
  ////////////////////////////////////////////////////////////
  it("create new user", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup")
      .send({
        email: "test@gmail.com",
        firstName: "mohamed",
        lastName: "othman",
        password: "123456asdf",
        ConfirmPassword: "123456asdf",
      })
      .then((res) => {
        userId = res.body.data.id;
        console.log(res.body.data.id);
        return res;
      });
    expect(response.status).toBe(201);
  });
});
