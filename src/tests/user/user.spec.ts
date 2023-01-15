import supertest from "supertest";
import app from "../../index";
import User from "../../types/user.types";
const HttpReqest = supertest(app);

describe("users end point", (): void => {
  let userId: string;
  let token: string;

  const userOne: User = {
    email: "user1@gmail.com",
    firstName: "mohamed",
    lastName: "othman",
    password: "123456asdf",
    ConfirmPassword: "123456asdf",
  };

  const userTwo: User = {
    email: "user2@gmail.com",
    firstName: "mohamed",
    lastName: "othman",
    password: "123456asdf",
    ConfirmPassword: "123456asdf",
  };

  ///////////////////////////////////////////////////////////
  // signup api //
  ////////////////////////////////////////////////////////////
  it("create new user", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup")
      .send(userOne)
      .then((res) => {
        userId = res.body.data.id;
        console.log(res.body.data.id);
        return res;
      });
    expect(response.status).toBe(201);
  });

  it("create new user two", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup")
      .send(userTwo)
      .then((res) => {
        userId = res.body.data.id;
        console.log(res.body.data.id);
        return res;
      });
    expect(response.status).toBe(201);
  });

  it("should fail email already exists ", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send(userOne);
    expect(response.status).toBe(401);
  });

  it("should fail password does not match confirm password", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user3@gmail.com",
      firstName: "mohamed",
      lastName: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456qwer",
    });
    expect(response.status).toBe(401);
  });

  it("should fail invalid email address", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user3",
      firstName: "mohamed",
      lastName: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });
    expect(response.status).toBe(401);
  });

  it("should fail  email is required", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      firstName: "mohamed",
      lastName: "othman",
      password: "123456asdf",
      ConfirmPassword: "123456asdf",
    });
    expect(response.status).toBe(401);
  });

  it("should fail  password should contain at least character", async (): Promise<void> => {
    const response = await HttpReqest.post("/api/users/signup").send({
      email: "user3@gmail.com",
      firstName: "mohamed",
      lastName: "othman",
      password: "123456",
      ConfirmPassword: "123456",
    });
    expect(response.status).toBe(401);
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
        email: userOne.email,
        password: userOne.password,
      })
      .then((res) => {
        token = `Bearer ${res.body.data.token}`;
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
        firstName: "ahmed",
        lastName: "osman",
      })
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("should fail could not update email email is exist ", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/users/${userId}`)
      .send({
        email: "user2@gmail.com",
      })
      .set("Authorization", token);
    expect(response.status).toBe(401);
  });
  it("should fail  could not update email email not valid ", async (): Promise<void> => {
    const response = await HttpReqest.patch(`/api/users/${userId}`)
      .send({
        email: "test2",
      })
      .set("Authorization", token);
    expect(response.status).toBe(401);
  });

  ///////////////////////////////////////////////////////////
  // delete user api //
  ////////////////////////////////////////////////////////////
  it("delete user", async (): Promise<void> => {
    console.log("id", userId);

    const response = await HttpReqest.delete(`/api/users/${userId}`).set(
      "Authorization",
      token
    );
    expect(response.status).toBe(200);
  });
});
