'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DocumentOwner extends Model {
    static associate(models) {
      DocumentOwner.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }
  DocumentOwner.init({
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
    modelName: 'DocumentOwner',
    tableName: 'Document_Owners',
    timestamps: true
  });

  return DocumentOwner;
};