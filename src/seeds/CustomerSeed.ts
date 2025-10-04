import "dotenv/config";
import { sequelize } from "../db.js";
import { Customer } from "../models/Customer.js";

export async function seedCustomers() {
  try {
    await Customer.bulkCreate([
      { mail: "mail1@mails.com", phone: 1234567890 },
      { mail: "mail2@mails.com", phone: 9876543120 },
      { mail: "mail3@mails.com", phone: 7418520963 },
    ]);

    console.log("✅ Seed Customers completado");
  } catch (err) {
    console.error("❌ Error en seed:", err);
  }
}
