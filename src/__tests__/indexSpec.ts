import supertest from "supertest";

import app from "../index";

const request = supertest(app);

describe("test basic endpoint server", () => {
  it("Get the / enpoint", async () => {
    const res = await request.get("/");

    expect(res.status).toBe(200);
  });
});
