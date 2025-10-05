import express from "express";
import { connectDB } from "../db/db.js";
import { customersRouter } from "./customers/routes.js";
import { ordersRouter } from "./orders/routes.js";

export async function startServers() {
  await connectDB();

  const customersApp = express();
  customersApp.use(express.json());
  customersApp.use(customersRouter);
  customersApp.get("/health", (_req, res) => res.send("ok-customers"));
  customersApp.listen(3001, () =>
    console.log("👥 Customers API http://localhost:3001")
  );

  const ordersApp = express();
  ordersApp.use(express.json());
  ordersApp.use(ordersRouter);
  ordersApp.get("/health", (_req, res) => res.send("ok-orders"));
  ordersApp.listen(3002, () =>
    console.log("🛒 Orders API http://localhost:3002")
  );
}
