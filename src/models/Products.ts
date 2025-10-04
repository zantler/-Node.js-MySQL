import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Product extends Model {
  public id!: number;
  public mail!: string;
  public phone!: number;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price_cents: { type: DataTypes.INTEGER, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);
