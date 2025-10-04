import express from "express";
import type { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
