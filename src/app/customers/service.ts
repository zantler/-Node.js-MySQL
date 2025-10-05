import { Op } from "sequelize";
import { Customer } from "../../db/db.js";

export async function createCustomer(data: {
  name: string;
  email: string;
  phone?: string;
}) {
  return Customer.create(data);
}

export async function getCustomer(id: number) {
  return Customer.findOne({ where: { id, deletedAt: null } });
}

export async function searchCustomers(params: {
  search?: string;
  cursor?: number;
  limit?: number;
}) {
  const { search = "", cursor, limit = 20 } = params;
  const where: any = { deletedAt: null };
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
    ];
  }
  if (cursor) where.id = { [Op.gt]: cursor }; // cursor = último id visto

  const rows = await Customer.findAll({
    where,
    order: [["id", "ASC"]],
    limit: Math.min(Number(limit) || 20, 100),
  });

  const lastRow = rows.length ? rows[rows.length - 1] : undefined;
  const nextCursor = lastRow ? (lastRow.get("id") as number) : null;
  return { data: rows, nextCursor };
}

export async function updateCustomer(
  id: number,
  patch: Partial<{ name: string; email: string; phone: string }>
) {
  const updated = await Customer.update(patch, {
    where: { id, deletedAt: null },
  });
  return updated[0] > 0 ? getCustomer(id) : null;
}

export async function deleteCustomer(id: number) {
  // soft-delete opcional (guardamos timestamp)
  const [n] = await Customer.update(
    { deletedAt: new Date() },
    { where: { id, deletedAt: null } }
  );
  return n > 0;
}
