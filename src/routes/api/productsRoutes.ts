import { Router } from "express";
import * as controllers from "../../controllers/products.controller";
import unauthorizedMiddleware from "../../middleware/authentication.middleware";

const routes = Router();
// api/products
routes.route("/").get(controllers.getAllProducts);
routes.route("/filter").get(controllers.filter);
routes.route("/top").get(controllers.getTop);
routes.route("/:id").get(controllers.getOneProduct);

///unauthorized
routes.route("/").post(unauthorizedMiddleware, controllers.create);
routes.route("/:id").patch(unauthorizedMiddleware, controllers.updateOne);
routes
  .route("/:id")
  .delete(unauthorizedMiddleware, controllers.deleteOneProduct);

export default routes;
