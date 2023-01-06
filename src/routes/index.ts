import express from "express";
// import usersRoutes from './api/users.routes';

const routes = express.Router();

routes.use("/users");

export default routes;
