'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stakeholder extends Model {
    static associate(models) {
      Stakeholder.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }
  Stakeholder.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    personil_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Stakeholder',
    tableName: 'Stakeholders',
    timestamps: true
  });

  return Stakeholder;
};