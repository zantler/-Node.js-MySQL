import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Customer extends Model {
  public id!: number;
  public mail!: string;
  public phone!: number;
}

Customer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    mail: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "customers",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);
