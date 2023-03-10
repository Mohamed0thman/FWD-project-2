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
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user1@gmail.com",
      firstname: "mohamed",
      lastname: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });

    expect(response.status).toBe(201);
  });

  it("should fail email already exists ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user1@gmail.com",
      firstname: "mohamed",
      lastname: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });
    expect(response.status).toBe(401);
  });

  it("should fail password does not match confirm password", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user3@gmail.com",
      firstname: "mohamed",
      lastname: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456qwer",
    });
    expect(response.status).toBe(422);
  });

  it("should fail invalid email address", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user3",
      firstname: "mohamed",
      lastname: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });
    expect(response.status).toBe(422);
  });

  it("should fail  email is required", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      firstname: "mohamed",
      lastname: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });
    expect(response.status).toBe(422);
  });

  it("should fail  password should contain at least character", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user3@gmail.com",
      firstname: "mohamed",
      lastname: "othman",
      password: "123456",
      ConfirmPassword: "123456",
    });
    expect(response.status).toBe(422);
  });

  ///////////////////////////////////////////////////////////
  // signin api //
  ////////////////////////////////////////////////////////////

  it("should fail email not exists  ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signin").send({
      email: "user3@gmail.com",
      password: "123456asdf",
    });
    expect(response.status).toBe(401);
  });
  it("should fail password not correct", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signin").send({
      email: "user3@gmail.com",
      password: "123456qwer",
    });
    expect(response.status).toBe(401);
  });
  it("user login in ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signin")
      .send({
        email: "user1@gmail.com",
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
  // get all users api //
  ////////////////////////////////////////////////////////////

  it("get all users information", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/users`).set(
      "Authorization",
      token
    );
    expect(response.status).toBe(200);
  });

  it("should fail not logged in please login", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/users`).set(
      "Authorization",
      "123456"
    );
    expect(response.status).toBe(401);
  });

  ///////////////////////////////////////////////////////////
  // get one user api //
  ////////////////////////////////////////////////////////////

  it("get one user information", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/users/${userId}`).set(
      "Authorization",
      token
    );
    expect(response.status).toBe(200);
  });

  it("should fail not logged in please login", async (): Promise<void> => {
    const response = await HttpReqest.get(`/api/users/${userId}`);
    expect(response.status).toBe(401);
  });

  ///////////////////////////////////////////////////////////
  // update user api //
  ////////////////////////////////////////////////////////////
  it("update user first and last name", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/users/${userId}`)
      .send({
        firstname: "ahmed",
        lastname: "osman",
      })
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("should fail could not update email email is exist ", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/users/${userId}`)
      .send({
        email: "user1@gmail.com",
      })
      .set("Authorization", token);
    expect(response.status).toBe(401);
  });
  it("should fail could not update email email not valid ", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/users/${userId}`)
      .send({
        email: "test2",
      })
      .set("Authorization", token);
    expect(response.status).toBe(422);
  });

  ///////////////////////////////////////////////////////////
  // delete user api //
  ////////////////////////////////////////////////////////////
  it("delete user", async (): Promise<void> => {
    const response = await HttpReqest.delete(`/api/users/${userId}`).set(
      "Authorization",
      token
    );
    expect(response.status).toBe(200);
  });
});
