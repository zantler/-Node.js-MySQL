import "dotenv/config";
import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import fs from "node:fs";
import CustomerModel from "./models/Customer.js";
import ProductModel from "./models/Product.js";
import OrderModel from "./models/Order.js";
import OrderItemModel from "./models/OrderItem.js";

const {
  DB_DIALECT = "mysql",
  DB_HOST,
  DB_PORT = "3306",
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL,
  DB_SSL_CA_PATH,
} = process.env;

// ---------- (1) Crear la base si no existe ----------
export async function ensureDatabaseExists() {
  try {
    if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
      throw new Error(
        "DB_HOST, DB_USER, and DB_PASSWORD must be defined in environment variables."
      );
    }
    const connectionOptions: any = {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
    };
    if (DB_SSL === "true") {
      if (DB_SSL_CA_PATH && fs.existsSync(DB_SSL_CA_PATH)) {
        connectionOptions.ssl = { ca: fs.readFileSync(DB_SSL_CA_PATH, "utf8") };
      } else {
        connectionOptions.ssl = { rejectUnauthorized: false };
      }
    }
    const connection = await mysql.createConnection(connectionOptions);

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`
    );
    console.log(`✅ Database "${DB_NAME}" verificada/creada`);
    await connection.end();
  } catch (err) {
    console.error("❌ Error verificando base:", err);
    process.exit(1);
  }
}

// ---------- (2) Configurar Sequelize ----------
const dialectOptions: any = {};
if (DB_SSL === "true") {
  if (DB_SSL_CA_PATH && fs.existsSync(DB_SSL_CA_PATH)) {
    dialectOptions.ssl = {
      require: true,
      ca: fs.readFileSync(DB_SSL_CA_PATH, "utf8"),
    };
  } else {
    dialectOptions.ssl = { require: true, rejectUnauthorized: false };
  }
}

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error(
    "DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME must be defined in environment variables."
  );
}

export const sequelize = new Sequelize({
  dialect: DB_DIALECT as any,
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
  dialectOptions,
  pool: { max: 10, min: 0, acquire: 30000 },
});

// ---------- (3) Función de conexión ----------
export async function connectDB() {
  await ensureDatabaseExists();
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos con Sequelize");
  } catch (error) {
    console.error("❌ Error al conectar con Sequelize:", error);
    process.exit(1);
  }
}

export const Customer = CustomerModel(sequelize);
export const Product = ProductModel(sequelize);
export const Order = OrderModel(sequelize);
export const OrderItem = OrderItemModel(sequelize);

Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

console.log("✅ Relaciones de modelos definidas correctamente");
