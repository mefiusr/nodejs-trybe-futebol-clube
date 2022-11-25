import { Model, STRING, INTEGER } from 'sequelize';
import db from '.';

class User extends Model {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER,
  },
  username: STRING,
  role: STRING,
  email: STRING,
  password: STRING,
}, {
  underscored: true,
  sequelize: db,
  tableName: 'users',
  timestamps: false,
});

export default User;
