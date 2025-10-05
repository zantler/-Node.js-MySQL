import { Router } from "express";
import * as c from "./controller.js";
export const ordersRouter = Router();

/* Products */
ordersRouter.post("/products", c.postProduct);
ordersRouter.patch("/products/:id", c.patchProduct);
ordersRouter.get("/products/:id", c.getProduct);
ordersRouter.get("/products", c.searchProducts);

/* Orders */
ordersRouter.post("/orders", c.postOrder);
ordersRouter.get("/orders/:id", c.getOrder);
ordersRouter.get("/orders", c.searchOrders);
ordersRouter.post("/orders/:id/cancel", c.cancelOrder);
