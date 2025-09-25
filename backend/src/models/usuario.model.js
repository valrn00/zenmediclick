import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('paciente','medico','admin'),
    defaultValue: 'paciente'
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

export default Usuario;
