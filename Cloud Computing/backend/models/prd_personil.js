'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PRD_Personil extends Model {
    static associate(models) {
      PRD_Personil.belongsTo(models.PRD, { foreignKey: 'prd_id' });
      PRD_Personil.belongsTo(models.Personil, { foreignKey: 'personil_id' });
    }
  }

  PRD_Personil.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    personil_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'PRD_Personil',
    tableName: 'PRD_Personil',
    timestamps: true
  });

  return PRD_Personil;
};