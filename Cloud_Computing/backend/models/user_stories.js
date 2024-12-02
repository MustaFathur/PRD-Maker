'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User_Stories extends Model {
    static associate(models) {
      User_Stories.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }

  User_Stories.init({
    story_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    user_story: {
      type: DataTypes.TEXT
    },
    acceptance_criteria: {
      type: DataTypes.TEXT
    },
    priority: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User_Stories',
    tableName: 'User_Stories',
    timestamps: true
  });

  return User_Stories;
};