'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timeline extends Model {
    static associate(models) {
      Timeline.belongsTo(models.PRD, { foreignKey: 'prd_id' });
    }
  }
  Timeline.init({
    timeline_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time_period: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING,
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
    modelName: 'Timeline',
    tableName: 'Timelines',
    timestamps: true,
    underscored: false
  });

  return Timeline;
};