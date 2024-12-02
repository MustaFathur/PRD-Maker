'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Timeline extends Model {
    static associate(models) {
      Timeline.belongsTo(models.PRD, { foreignKey: 'prd_id' });
      Timeline.belongsTo(models.Personil, { foreignKey: 'pic_id' });
    }
  }

  Timeline.init({
    timeline_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    prd_id: {
      type: DataTypes.INTEGER
    },
    start_date: {
      type: DataTypes.DATE
    },
    end_date: {
      type: DataTypes.DATE
    },
    activity: {
      type: DataTypes.STRING
    },
    pic_id: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Timeline',
    tableName: 'Timelines',
    timestamps: true
  });

  return Timeline;
};