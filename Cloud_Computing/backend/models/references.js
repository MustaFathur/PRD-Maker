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
      type: DataTypes.INTEGER
    },
    reference_link: {
      type: DataTypes.STRING
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
    modelName: 'References',
    tableName: 'References',
    timestamps: true
  });

  return References;
};