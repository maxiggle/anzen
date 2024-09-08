
import { DataTypes } from "sequelize";
import sq from "..";
import User from "./User";

const Attestation = sq.define('Attestation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  json_data: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Attestation.belongsTo(User, { foreignKey: 'user_id' });

export default Attestation;
