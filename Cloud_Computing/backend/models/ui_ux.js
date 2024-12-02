'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UI_UX extends Model {
    static associate(models) {
      UI_UX.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  UI_UX.init({
    uiux_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER
    },
    link: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'UI_UX',
    tableName: 'UI_UXes',
    timestamps: true
  });

  return UI_UX;
};