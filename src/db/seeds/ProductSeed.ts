import "dotenv/config";
import { sequelize } from "../db.js";
import Product from "../models/Product.js";

export async function seedProducts() {
  try {
    await Product(sequelize).bulkCreate([
      { sku: "abc123", name: "Item 1", price_cents: 1, stock: 40 },
      { sku: "123abc", name: "Item 2", price_cents: 2, stock: 30 },
      { sku: "def456", name: "Item 3", price_cents: 3, stock: 20 },
      { sku: "456def", name: "Item 4", price_cents: 4, stock: 10 },
    ]);

    console.log("✅ Seed Products completado");
  } catch (err) {
    console.error("❌ Error en seed:", err);
  }
}
