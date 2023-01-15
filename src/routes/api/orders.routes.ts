import { Router } from "express";
import * as controllers from "../../controllers/order.controller";
import authenticationMiddleware from "../../middleware/authentication.middleware";

const routes = Router();
// api/products
routes.route("/").post(authenticationMiddleware, controllers.create);
routes.route("/").patch(authenticationMiddleware, controllers.updateOne);
routes.route("/:id").delete(authenticationMiddleware, controllers.deleteOne);

export default routes;
