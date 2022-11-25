import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class Team extends Model {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  teamName: STRING,
}, {
  underscored: true,
  sequelize: db,
  tableName: 'teams',
  timestamps: false,
});

export default Team;
