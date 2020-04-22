'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Smart-meter-samples', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      meterId: {
        type: Sequelize.INTEGER
      },
      authenticSample: {
        type: Sequelize.BOOLEAN
      },
      date: {
        type: Sequelize.DATE
      },
      wattsPerHour: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Smart-meter-samples');
  }
};