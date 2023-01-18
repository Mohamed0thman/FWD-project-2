import { Router } from "express";
import * as controllers from "../../controllers/order.controller";
import unauthorizedMiddleware from "../../middleware/authentication.middleware";

const routes = Router();
// api/products
routes.route("/").post(unauthorizedMiddleware, controllers.create);
routes.route("/").patch(unauthorizedMiddleware, controllers.updateOrder);
routes.route("/:id").delete(unauthorizedMiddleware, controllers.deleteOrder);

export default routes;
