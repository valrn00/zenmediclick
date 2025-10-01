import mysql from "mysql";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Cambia por tu usuario
  password: "", // Cambia por tu contraseña
  database: "zenmediclick",
  port: 3306,
  connectionLimit: 10
});

const db = {
  query: (sql, params, callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error obteniendo conexión MySQL:", err);
        return callback(err);
      }
      connection.query(sql, params, (error, results) => {
        connection.release();
        callback(error, results);
      });
    });
  }
};

export default db;
