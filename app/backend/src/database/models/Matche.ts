import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import Team from './Team';

class Matche extends Model {
  declare id: number;
  declare teamName: string;
}

Matche.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  homeTeam: INTEGER,
  homeTeamGoals: INTEGER,
  awayTeam: INTEGER,
  awayTeamGoals: INTEGER,
  inProgress: BOOLEAN,
}, {
  underscored: true,
  sequelize: db,
  tableName: 'matches',
  timestamps: false,
});

Team.hasMany(Matche, { foreignKey: 'home_team', as: 'Home' });
Team.hasMany(Matche, { foreignKey: 'away_team', as: 'Away' });

Matche.belongsTo(Team, { foreignKey: 'id', as: 'Teste2' });

export default Matche;
