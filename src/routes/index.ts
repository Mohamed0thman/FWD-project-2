import express from "express";
import usersRoutes from "./api/users.routes";
import productsRoutes from "./api/products.routes";
const routes = express.Router();

routes.use("/users", usersRoutes);
routes.use("/products", productsRoutes);
// routes.use("/orders");

export default routes;
