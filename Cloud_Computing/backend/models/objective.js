'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Objective extends Model {
    static associate(models) {
      Objective.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  Objective.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
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
    modelName: 'Objective',
    tableName: 'Objectives',
    timestamps: true,
    underscored: false
  });

  return Objective;
};