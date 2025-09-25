import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "127.0.01",
  database: "zenmediclick"
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    return;
  }
  console.log("✅ Conexión exitosa a la base de datos");
});

export default connection;
