import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "zenmediclick",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Para probar la conexión
pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Error de conexión a la BD:", err.message);
  } else {
    console.log("✅ Conectado a MySQL");
    conn.release();
  }
});

export default pool;
