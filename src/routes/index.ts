import express from "express";
import usersRoutes from "./api/users.routes";

const routes = express.Router();

routes.use("/users", usersRoutes);
// routes.use("/products");
// routes.use("/orders");

export default routes;
