'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DARCI extends Model {
    static associate(models) {
      DARCI.belongsTo(models.PRD, { foreignKey: 'prd_id' });
      DARCI.belongsTo(models.Personil, { foreignKey: 'personil_id' });
    }
  }

  DARCI.init({
    darci_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('decider', 'accountable', 'responsible', 'consulted', 'informed'),
      allowNull: false
    },
    personil_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    guidelines: {
      type: DataTypes.TEXT,
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
    modelName: 'DARCI',
    tableName: 'DARCIs',
    timestamps: true,
    underscored: true
  });

  return DARCI;
};