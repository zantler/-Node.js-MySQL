// import express from "express";
// import type { Application, Request, Response } from "express";
// import { sequelize, connectDB } from "./db.js";
// import { Customer } from "./models/Customer.js";
// import "dotenv/config";

// const app: Application = express();
// app.use(express.json());

// const PORT = Number(process.env.PORT) || 3000;

// app.get("/", (_req: Request, res: Response) => {
//   res.send("Hello, World with Sequelize!");
// });

// app.get("/customers", async (_req: Request, res: Response) => {
//   console.log("GET /customers called");
//   const customers = await Customer.findAll();
//   res.json(customers);
// });

// app.post("/customers", async (req: Request, res: Response) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: "name es requerido" });
//   const customer = await Customer.create({ name });
//   res.status(201).json(customer);
// });

// async function startServer() {
//   await connectDB();
//   await sequelize.sync(); // crea tablas si no existen
//   app.listen(PORT, () =>
//     console.log(`🚀 Server running on http://localhost:${PORT}`)
//   );
// }

// startServer();

import { startServers } from "./app/server.js";
startServers().catch((e) => {
  console.error(e);
  process.exit(1);
});
