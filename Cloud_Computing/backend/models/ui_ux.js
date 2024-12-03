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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'UI_UX',
    tableName: 'UI_UXes',
    timestamps: true,
    underscored: true
  });

  return UI_UX;
};