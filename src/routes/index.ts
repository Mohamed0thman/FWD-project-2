import express from "express";
import usersRoutes from "./api/userRoutes";
import productsRoutes from "./api/productsRoutes";
import ordersRoutes from "./api/ordersRoutes";

const routes = express.Router();

routes.use("/users", usersRoutes);
routes.use("/products", productsRoutes);
routes.use("/orders", ordersRoutes);

export default routes;
