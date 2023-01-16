import { Router } from "express";
import * as controllers from "../../controllers/users.controllers";
import unauthorizedMiddleware from "../../middleware/authentication.middleware";

const routes = Router();
// api/users
routes.route("/signup").post(controllers.createUser);
routes.route("/signin").post(controllers.loginUser);
// authentication
routes.route("/").get(unauthorizedMiddleware, controllers.getAllUsers);
routes.route("/:id").get(unauthorizedMiddleware, controllers.getOneUser);
routes.route("/:id").patch(unauthorizedMiddleware, controllers.updateOneUser);
routes.route("/:id").delete(unauthorizedMiddleware, controllers.deleteOneUser);

export default routes;
