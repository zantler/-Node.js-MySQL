import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) =>
  sequelize.define(
    "Customer",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(180), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "customers", timestamps: true, paranoid: false }
  );
