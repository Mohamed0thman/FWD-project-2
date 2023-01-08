import { Router } from "express";
import * as controllers from "../../controllers/users.controllers";
import authenticationMiddleware from "../../middleware/authentication.middleware";

const routes = Router();
// api/users
routes.route("/signup").post(controllers.create);
routes.route("/signin").post(controllers.authenticate);
// authentication
routes.route("/").get(authenticationMiddleware, controllers.getMany);
routes.route("/:id").get(authenticationMiddleware, controllers.getOne);
routes.route("/:id").patch(authenticationMiddleware, controllers.updateOne);
routes.route("/:id").delete(authenticationMiddleware, controllers.deleteOne);

export default routes;
