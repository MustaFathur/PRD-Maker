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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_story: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    acceptance_criteria: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
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
    modelName: 'User_Stories',
    tableName: 'User_Stories',
    timestamps: true,
    underscored: false
  });

  return User_Stories;
};