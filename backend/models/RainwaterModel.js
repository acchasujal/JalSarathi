import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const RainwaterModel = sequelize.define("Rainwater", {
  state: DataTypes.STRING,
  rainfall: DataTypes.FLOAT,
  roofArea: DataTypes.FLOAT,
  cost: DataTypes.FLOAT,
  annualSavings: DataTypes.FLOAT,
  paybackPeriod: DataTypes.FLOAT,
});

export default RainwaterModel;
