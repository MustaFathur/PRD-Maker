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
    }
  }, {
    sequelize,
    modelName: 'References',
    tableName: 'References',
    timestamps: true
  });

  return References;
};