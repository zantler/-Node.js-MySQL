import "dotenv/config";
import { sequelize } from "../db.js";
import CustomerFactory from "../models/Customer.js";

export async function seedCustomers() {
  try {
    const Customer = CustomerFactory(sequelize);
    await Customer.bulkCreate([
      { email: "mail1@mails.com", phone: 1234567890 },
      { email: "mail2@mails.com", phone: 9876543120 },
      { email: "mail3@mails.com", phone: 7418520963 },
    ]);

    console.log("✅ Seed Customers completado");
  } catch (err) {
    console.error("❌ Error en seed:", err);
  }
}
