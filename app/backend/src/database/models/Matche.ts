import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';

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

export default Matche;
