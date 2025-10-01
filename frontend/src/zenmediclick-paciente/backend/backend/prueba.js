import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("✅ Hola, servidor básico funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba en http://localhost:${PORT}`);
});
