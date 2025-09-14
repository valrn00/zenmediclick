
import mysql from 'mysql2/promise';
import process from 'process';

let pool;
export async function initDBPool() {
  try {
    pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'zenmediclick',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
    return pool;
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    process.exit(1);
  }
}

export function getDBPool() {
  if (!pool) throw new Error('Pool no inicializado. Llama a initDBPool primero.');
  return pool;
}
