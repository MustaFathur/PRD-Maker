'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Personil extends Model {
    static associate(models) {
      Personil.belongsTo(models.User, { foreignKey: 'created_by' });
      Personil.belongsToMany(models.PRD, {
        through: models.PRD_Personil,
        foreignKey: 'personil_id',
        otherKey: 'prd_id',
        as: 'prds'
      });
      Personil.hasMany(models.DARCI, { foreignKey: 'person_id', as: 'darciRoles' });
      Personil.hasMany(models.Timeline, { foreignKey: 'pic_id', as: 'timelines' });
    }
  }

  Personil.init({
    personil_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    personil_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING
    },
    created_by: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Personil',
    tableName: 'Personils',
    timestamps: true
  });

  return Personil;
};