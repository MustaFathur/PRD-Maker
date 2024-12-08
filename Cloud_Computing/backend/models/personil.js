'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Personil extends Model {
    static associate(models) {
      Personil.belongsTo(models.User, { foreignKey: 'created_by' });
    }
  }
  Personil.init({
    personil_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    personil_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Personil',
    tableName: 'Personils',
    timestamps: true,
    underscored: false
  });

  return Personil;
};