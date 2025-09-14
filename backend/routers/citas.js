
import express from 'express';
import { getDBPool } from '../db_connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = getDBPool();
    const [rows] = await pool.query('SELECT * FROM citas');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

export default router;

