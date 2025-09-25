// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

console.log('El nombre de la DB es:', process.env.DB_NAME);
const sequelize = new Sequelize(
    process.env.DB_NAME,
    'root', // <--- Usa 'root' directamente
    'Administrador1234_', // <--- Usa tu contraseña directamente
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
    }
);

export default sequelize;