import { DataTypes } from "sequelize";
import sq from ".."

export default sq.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastName: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  email: {
    type: DataTypes.TEXT,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  publicKey: {
    type: DataTypes.TEXT
  },
  role: {
    type: DataTypes.TEXT
  }
});