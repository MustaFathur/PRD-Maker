'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timeline extends Model {
    static associate(models) {
      Timeline.belongsTo(models.PRD, { foreignKey: 'prd_id' });
      Timeline.belongsTo(models.Personil, { foreignKey: 'pic' });
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
      type: DataTypes.INTEGER,
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
    modelName: 'Timeline',
    tableName: 'Timelines',
    timestamps: true,
    underscored: true
  });

  return Timeline;
};