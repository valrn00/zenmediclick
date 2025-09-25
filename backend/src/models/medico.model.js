import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';



const Medico = sequelize.define('Medico', {
	id_usuario: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: false
	},
	especialidad: {
		type: DataTypes.STRING,
		allowNull: true
	},
	id_ips: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, {
	tableName: 'medicos',
	timestamps: false
});

export default Medico;