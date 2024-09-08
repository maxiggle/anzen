import { DataTypes, QueryInterface } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('attestations', {
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
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('attestations')
  }
}
