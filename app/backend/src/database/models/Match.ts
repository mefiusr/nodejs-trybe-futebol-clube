import { Model, INTEGER, BOOLEAN } from 'sequelize';
import IMatch from '../../interfaces/IMatch';
import db from '.';
import Team from './Team';

class Match extends Model implements IMatch {
  declare id: number;
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
  declare teamHome: { teamName: string; };
  declare teamAway: { teamName: string; };
}

Match.init({
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

Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'teamHome' });
Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'teamAway' });

Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Match;
