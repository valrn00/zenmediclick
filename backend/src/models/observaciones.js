import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Usuario from './usuario.model.js';
import Medico from './medico.model.js';

const Observacion = sequelize.define('Observacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  medicoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pacienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Relaciones
Observacion.belongsTo(Usuario, { as: 'paciente', foreignKey: 'pacienteId' });
Observacion.belongsTo(Medico, { as: 'medico', foreignKey: 'medicoId' });

export default Observacion;
