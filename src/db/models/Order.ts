import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) =>
  sequelize.define(
    "Order",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      customerId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM("CREATED", "CONFIRMED", "CANCELLED"),
        allowNull: false,
        defaultValue: "CREATED",
      },
      confirmedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "orders", timestamps: true }
  );
