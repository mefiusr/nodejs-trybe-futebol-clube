'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      home_team: Sequelize.INTEGER,
      home_team_goals: Sequelize.INTEGER,
      away_team: Sequelize.INTEGER,
      away_team_goals: Sequelize.INTEGER,
      in_progress: Sequelize.BOOLEAN,
    })
  },

  down: async (queryInterface, _Sequelize) => {
     await queryInterface.dropTable('matches')
  }
};
