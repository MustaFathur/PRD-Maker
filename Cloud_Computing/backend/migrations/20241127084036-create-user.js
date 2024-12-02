'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true // Allow null for OAuth users
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      google_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      google_access_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      auth_type: {
        type: Sequelize.ENUM('regular', 'oauth'),
        defaultValue: 'regular',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};