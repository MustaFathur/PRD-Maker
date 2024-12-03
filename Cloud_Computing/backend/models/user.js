'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Personil, { foreignKey: 'created_by' });
    }
  }

  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Allow null for OAuth users
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    google_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    google_access_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    auth_type: {
      type: DataTypes.ENUM('regular', 'oauth'),
      defaultValue: 'regular',
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
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    underscored: false
  });

  return User;
};