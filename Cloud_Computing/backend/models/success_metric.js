'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Success_Metrics extends Model {
    static associate(models) {
      Success_Metrics.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  Success_Metrics.init({
    metric_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    definition: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    current: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target: {
      type: DataTypes.STRING,
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
    modelName: 'Success_Metrics',
    tableName: 'Success_Metrics',
    timestamps: true,
    underscored: false
  });

  return Success_Metrics;
};