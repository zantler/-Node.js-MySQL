import { Request, Response } from "express";
import * as svc from "./service.js";

export async function postCustomer(req: Request, res: Response) {
  const { name, email, phone } = req.body || {};
  if (!name || !email)
    return res.status(400).json({ message: "name y email son requeridos" });
  try {
    const created = await svc.createCustomer({ name, email, phone });
    res.status(201).json(created);
  } catch (e: any) {
    if (e?.name === "SequelizeUniqueConstraintError")
      return res.status(409).json({ message: "email ya existe" });
    res.status(500).json({ message: "error creando cliente" });
  }
}
export async function getCustomer(req: Request, res: Response) {
  const row = await svc.getCustomer(Number(req.params.id));
  if (!row) return res.status(404).json({ message: "no encontrado" });
  res.json(row);
}
export async function searchCustomers(req: Request, res: Response) {
  const { search, cursor, limit } = req.query as any;
  const params: { search?: string; cursor?: number; limit?: number } = {};
  if (search !== undefined) params.search = search;
  if (cursor !== undefined) params.cursor = Number(cursor);
  if (limit !== undefined) params.limit = Number(limit);
  const result = await svc.searchCustomers(params);
  res.json(result);
}
export async function putCustomer(req: Request, res: Response) {
  const row = await svc.updateCustomer(Number(req.params.id), req.body || {});
  if (!row) return res.status(404).json({ message: "no encontrado" });
  res.json(row);
}
export async function deleteCustomer(req: Request, res: Response) {
  const ok = await svc.deleteCustomer(Number(req.params.id));
  res.status(ok ? 204 : 404).send();
}
