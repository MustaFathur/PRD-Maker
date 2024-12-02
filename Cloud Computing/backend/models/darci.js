'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DARCI extends Model {
    static associate(models) {
      DARCI.belongsTo(models.PRD, { foreignKey: 'prd_id' });
      DARCI.belongsTo(models.Personil, { foreignKey: 'person_id' });
    }
  }

  DARCI.init({
    darci_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER
    },
    role: {
      type: DataTypes.STRING
    },
    person_id: {
      type: DataTypes.INTEGER
    },
    guidelines: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'DARCI',
    tableName: 'DARCIs',
    timestamps: true
  });

  return DARCI;
};