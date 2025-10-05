import { Op, Transaction } from "sequelize";
import { Product, Order, OrderItem, sequelize } from "../../db/db.js";

export async function createProduct(data: {
  name: string;
  price: number;
  stock: number;
}) {
  return Product.create(data);
}
export async function updateProduct(
  id: number,
  patch: Partial<{ price: number; stock: number }>
) {
  const [n] = await Product.update(patch, { where: { id } });
  return n > 0 ? Product.findByPk(id) : null;
}
export async function getProduct(id: number) {
  return Product.findByPk(id);
}
export async function searchProducts(params: {
  search?: string;
  cursor?: number;
  limit?: number;
}) {
  const { search = "", cursor, limit = 20 } = params;
  const where: any = {};
  if (search) where.name = { [Op.like]: `%${search}%` };
  if (cursor) where.id = { [Op.gt]: cursor };
  const rows = await Product.findAll({
    where,
    order: [["id", "ASC"]],
    limit: Math.min(Number(limit) || 20, 100),
  });
  const nextCursor =
    rows.length && rows[rows.length - 1]
      ? (rows[rows.length - 1]!.get("id") as number)
      : null;
  return { data: rows, nextCursor };
}

/* ===== Orders ===== */
export async function createOrder(payload: {
  customer_id: number;
  items: { product_id: number; qty: number }[];
}) {
  const { customer_id, items = [] } = payload;
  if (!customer_id || items.length === 0) throw new Error("payload inválido");

  return sequelize.transaction(async (tx: Transaction) => {
    // verificar stock y tomar precios actuales
    const ids = items.map((i) => i.product_id);
    const prods = await Product.findAll({
      where: { id: ids },
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
    if (prods.length !== items.length) throw new Error("producto inexistente");

    for (const it of items) {
      const p = prods.find((x) => x.get("id") === it.product_id)!;
      if ((p.get("stock") as number) < it.qty)
        throw new Error(`stock insuficiente p:${it.product_id}`);
    }

    const order = await Order.create(
      { customerId: customer_id, status: "CREATED" },
      { transaction: tx }
    );

    // descuenta stock y crea items
    for (const it of items) {
      const p = prods.find((x) => x.get("id") === it.product_id)!;
      const priceNum = Number(p.get("price"));
      await OrderItem.create(
        {
          orderId: order.get("id"),
          productId: it.product_id,
          qty: it.qty,
          price: priceNum,
        },
        { transaction: tx }
      );
      await p.update(
        { stock: (p.get("stock") as number) - it.qty },
        { transaction: tx }
      );
    }

    return order;
  });
}

export async function getOrder(id: number) {
  return Order.findByPk(id, {
    include: [{ model: OrderItem, include: [{ model: Product }] }],
  });
}

export async function searchOrders(params: {
  status?: string;
  from?: string;
  to?: string;
  cursor?: number;
  limit?: number;
}) {
  const { status, from, to, cursor, limit = 20 } = params;
  const where: any = {};
  if (status) where.status = status;
  if (from || to)
    where.createdAt = {
      ...(from ? { [Op.gte]: new Date(from) } : {}),
      ...(to ? { [Op.lte]: new Date(to) } : {}),
    };
  if (cursor) where.id = { [Op.gt]: cursor };
  const rows = await Order.findAll({
    where,
    order: [["id", "ASC"]],
    limit: Math.min(Number(limit) || 20, 100),
  });
  const lastRow = rows.length ? rows[rows.length - 1] : undefined;
  const nextCursor = lastRow ? (lastRow.get("id") as number) : null;
  return { data: rows, nextCursor };
}

export async function cancelOrder(id: number) {
  return sequelize.transaction(async (tx) => {
    const order = await Order.findByPk(id, {
      include: [OrderItem],
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
    if (!order) return { ok: false, reason: "not-found" };

    const status = order.get("status") as string;
    if (status === "CREATED") {
      // restaurar stock
      const items = order.get("OrderItems") as any[];
      for (const it of items) {
        await Product.increment(
          { stock: it.qty },
          { where: { id: it.productId }, transaction: tx }
        );
      }
      await order.update({ status: "CANCELLED" }, { transaction: tx });
      return { ok: true };
    } else if (status === "CONFIRMED") {
      const confAt = order.get("confirmedAt") as Date | null;
      if (confAt && Date.now() - confAt.getTime() <= 10 * 60 * 1000) {
        const items = order.get("OrderItems") as any[];
        for (const it of items) {
          await Product.increment(
            { stock: it.qty },
            { where: { id: it.productId }, transaction: tx }
          );
        }
        await order.update({ status: "CANCELLED" }, { transaction: tx });
        return { ok: true };
      }
      return { ok: false, reason: "cannot-cancel-confirmed" };
    }
    return { ok: false, reason: "already-cancelled-or-unknown" };
  });
}
