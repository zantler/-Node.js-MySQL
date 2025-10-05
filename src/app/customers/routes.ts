import { Router } from "express";
import * as c from "./controller.js";
export const customersRouter = Router();

customersRouter.post("/customers", c.postCustomer);
customersRouter.get("/customers/:id", c.getCustomer);
customersRouter.get("/customers", c.searchCustomers);
customersRouter.put("/customers/:id", c.putCustomer);
customersRouter.delete("/customers/:id", c.deleteCustomer);
