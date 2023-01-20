import UserModel from "../../models/user.model";
import User from "../../types/user.types";

const userModel = new UserModel();
describe("create user models", (): void => {
  let user: User;
  it("create user", async (): Promise<void> => {
    user = await userModel.createUser({
      email: "user0@email.com",
      firstname: "user",
      lastname: "user",
      password: "123456asdf",
    });
    expect(user.id).toBeTruthy();
  });

  it("get all users model", async (): Promise<void> => {
    expect((await userModel.getAllUsers()).length).toBeGreaterThan(0);
  });
  it("get one user model", async (): Promise<void> => {
    expect(await userModel.getOneUser(user.id as string)).toBeTruthy();
  });

  it("update user", async (): Promise<void> => {
    const u = await userModel.updateOneUser(
      {
        lastname: "totoooo",
      } as User,
      user.id as string
    );

    expect(u.lastname).toEqual("totoooo");
  });
  it("delete user model", async (): Promise<void> => {
    expect(await userModel.deleteOneUser(user.id as string)).toEqual({
      ...user,
      lastname: "totoooo",
    });
  });
});
