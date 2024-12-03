'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class References extends Model {
    static associate(models) {
      References.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  References.init({
    reference_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reference_link: {
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
    modelName: 'References',
    tableName: 'References',
    timestamps: true,
    underscored: false
  });

  return References;
};