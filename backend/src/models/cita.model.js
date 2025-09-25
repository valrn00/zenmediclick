import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Usuario from './usuario.model.js';
import Medico from './medico.model.js';



const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('Pendiente','Confirmada','Cancelada','Completada'),
    defaultValue: 'Pendiente',
    allowNull: false
  }
}, {
  tableName: 'citas',
  timestamps: false
});

// Relaciones
Cita.belongsTo(Medico, { foreignKey: 'id_medico' });
Cita.belongsTo(Usuario, { foreignKey: 'id_paciente' });

export default Cita;
