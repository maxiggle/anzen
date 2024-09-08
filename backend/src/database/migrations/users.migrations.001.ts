import { DataTypes, QueryInterface } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
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
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      role: {
        type: DataTypes.TEXT,
        allowNull: true
      },
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users')
  }
}