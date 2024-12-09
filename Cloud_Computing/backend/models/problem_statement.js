const { Model } = require('sequelize');

'use strict';

module.exports = (sequelize, DataTypes) => {
  class Problem_Statement extends Model {
    static associate(models) {
      Problem_Statement.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  Problem_Statement.init({
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
    modelName: 'Problem_Statement',
    tableName: 'Problem_Statements',
    timestamps: true,
    underscored: false
  });

  return Problem_Statement;
};
