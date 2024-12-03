'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PRD extends Model {
    static associate(models) {
      PRD.belongsTo(models.User, { foreignKey: 'user_id' });
      PRD.belongsToMany(models.Personil, { through: models.PRD_Personil, foreignKey: 'prd_id' });
      PRD.hasMany(models.DARCI, { foreignKey: 'prd_id', as: 'darciRoles' });
      PRD.hasMany(models.Timeline, { foreignKey: 'prd_id', as: 'timelines' });
      PRD.hasMany(models.Success_Metrics, { foreignKey: 'prd_id', as: 'successMetrics' });
      PRD.hasMany(models.User_Stories, { foreignKey: 'prd_id', as: 'userStories' });
      PRD.hasMany(models.UI_UX, { foreignKey: 'prd_id', as: 'uiUx' });
      PRD.hasMany(models.References, { foreignKey: 'prd_id', as: 'references' });
      PRD.hasMany(models.ProblemStatement, { foreignKey: 'prd_id', as: 'problemStatements' });
      PRD.hasMany(models.Objective, { foreignKey: 'prd_id', as: 'objectives' });
      PRD.hasMany(models.PRD_Personil, { foreignKey: 'prd_id', as: 'prdPersonils' }); 
    }
  }

  PRD.init({
    prd_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document_version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    document_stage: {
      type: DataTypes.ENUM('draft', 'ongoing', 'completed'),
      allowNull: false
    },
    project_overview: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
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
    modelName: 'PRD',
    tableName: 'PRDs',
    timestamps: true,
    underscored: false
  });

  return PRD;
};