import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WaterQualityModel = sequelize.define("WaterQuality", {
  lead: DataTypes.FLOAT,
  arsenic: DataTypes.FLOAT,
  mercury: DataTypes.FLOAT,
  result: DataTypes.STRING,
});

export default WaterQualityModel;
