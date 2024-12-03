'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProblemStatement extends Model {
    static associate(models) {
      ProblemStatement.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  ProblemStatement.init({
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
    modelName: 'ProblemStatement',
    tableName: 'ProblemStatements',
    timestamps: true,
    underscored: false
  });

  return ProblemStatement;
};