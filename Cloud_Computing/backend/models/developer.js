'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Developer extends Model {
    static associate(models) {
      Developer.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }
  Developer.init({
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
    modelName: 'Developer',
    tableName: 'Developers',
    timestamps: true
  });

  return Developer;
};