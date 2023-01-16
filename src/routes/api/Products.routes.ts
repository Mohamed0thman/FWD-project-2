import { Router } from "express";
import * as controllers from "../../controllers/products.controller";
import unauthorizedMiddleware from "../../middleware/authentication.middleware";

const routes = Router();
// api/products
routes.route("/").post(unauthorizedMiddleware, controllers.create);
routes.route("/").get(unauthorizedMiddleware, controllers.getAllProducts);
routes.route("/filter").get(unauthorizedMiddleware, controllers.filter);
routes.route("/top").get(unauthorizedMiddleware, controllers.getTop);
routes.route("/:id").get(unauthorizedMiddleware, controllers.getOneProduct);
routes.route("/:id").patch(unauthorizedMiddleware, controllers.updateOne);
routes
  .route("/:id")
  .delete(unauthorizedMiddleware, controllers.deleteOneProduct);

export default routes;
