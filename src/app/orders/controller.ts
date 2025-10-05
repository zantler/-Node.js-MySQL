import { Request, Response } from "express";
import * as svc from "./service.js";

/* Products */
export async function postProduct(req: Request, res: Response) {
  const { name, price, stock } = req.body || {};
  if (!name || price == null || stock == null)
    return res.status(400).json({ message: "name, price, stock requeridos" });
  const p = await svc.createProduct({
    name,
    price: Number(price),
    stock: Number(stock),
  });
  res.status(201).json(p);
}
export async function patchProduct(req: Request, res: Response) {
  const p = await svc.updateProduct(Number(req.params.id), req.body || {});
  if (!p) return res.status(404).json({ message: "no encontrado" });
  res.json(p);
}
export async function getProduct(req: Request, res: Response) {
  const p = await svc.getProduct(Number(req.params.id));
  if (!p) return res.status(404).json({ message: "no encontrado" });
  res.json(p);
}
export async function searchProducts(req: Request, res: Response) {
  const { search, cursor, limit } = req.query as any;
  const params: { search?: string; cursor?: number; limit?: number } = {};
  if (search !== undefined) params.search = search;
  if (cursor !== undefined) params.cursor = Number(cursor);
  if (limit !== undefined) params.limit = Number(limit);
  const r = await svc.searchProducts(params);
  res.json(r);
}

/* Orders */
export async function postOrder(req: Request, res: Response) {
  try {
    const ord = await svc.createOrder(req.body);
    res.status(201).json(ord);
  } catch (e: any) {
    res.status(400).json({ message: e?.message || "error creando orden" });
  }
}
export async function getOrder(req: Request, res: Response) {
  const o = await svc.getOrder(Number(req.params.id));
  if (!o) return res.status(404).json({ message: "no encontrada" });
  res.json(o);
}
export async function searchOrders(req: Request, res: Response) {
  const { status, from, to, cursor, limit } = req.query as any;
  const params: {
    status?: string;
    from?: string;
    to?: string;
    cursor?: number;
    limit?: number;
  } = {};
  if (status !== undefined) params.status = status;
  if (from !== undefined) params.from = from;
  if (to !== undefined) params.to = to;
  if (cursor !== undefined) params.cursor = Number(cursor);
  if (limit !== undefined) params.limit = Number(limit);
  const r = await svc.searchOrders(params);
  res.json(r);
}
export async function cancelOrder(req: Request, res: Response) {
  const r = await svc.cancelOrder(Number(req.params.id));
  if (!r.ok) return res.status(400).json({ message: r.reason });
  res.status(204).send();
}
