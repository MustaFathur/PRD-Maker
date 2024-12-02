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
      type: DataTypes.INTEGER
    },
    metric_name: {
      type: DataTypes.STRING
    },
    definition: {
      type: DataTypes.TEXT
    },
    actual_value: {
      type: DataTypes.DECIMAL
    },
    target_value: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Success_Metrics',
    tableName: 'Success_Metrics',
    timestamps: true
  });

  return Success_Metrics;
};