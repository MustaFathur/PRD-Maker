'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Define associations here if needed
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
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};