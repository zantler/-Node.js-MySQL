import "dotenv/config";
import { sequelize } from "../db.js";
import { seedCustomers } from "./CustomerSeed.js";
import { seedProducts } from "./ProductSeed.js";

async function main() {
  try {
    await sequelize.sync({ force: true });
    console.log("🗃️ Tablas sincronizadas");

    await seedCustomers();
    await seedProducts();

    console.log("🎉 Todos los seeds completados correctamente");
  } catch (error) {
    console.error("❌ Error ejecutando seeds:", error);
  } finally {
    await sequelize.close();
  }
}

main();
