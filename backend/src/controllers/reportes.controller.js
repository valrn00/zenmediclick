const db = require('../config/db.js');

const reportesController = {
  // Obtener estadísticas generales del dashboard
  async getDashboardStats(req, res) {
    try {
      const [usuarios] = await db.execute(
        'SELECT COUNT(*) as total, role FROM users GROUP BY role'
      );
      
      const [citas] = await db.execute(
        'SELECT COUNT(*) as total, estado FROM citas GROUP BY estado'
      );
      
      const [citasHoy] = await db.execute(
        `SELECT COUNT(*) as total FROM citas 
         WHERE DATE(fecha) = CURDATE()`
      );
      
      const [medicos] = await db.execute(
        'SELECT COUNT(*) as total FROM users WHERE role = "medico"'
      );

      res.json({
        usuarios: usuarios,
        citas: citas,
        citasHoy: citasHoy[0].total,
        totalMedicos: medicos[0].total
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ 
        message: 'Error al obtener estadísticas del dashboard' 
      });
    }
  },

  // Reporte de citas por fecha
  async getReporteCitas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      let query = `
        SELECT 
          c.id,
          c.fecha,
          c.estado,
          c.motivo,
          p.nombre as paciente_nombre,
          m.nombre as medico_nombre
        FROM citas c
        LEFT JOIN users p ON c.paciente_id = p.id
        LEFT JOIN users m ON c.medico_id = m.id
      `;
      
      const params = [];
      
      if (fechaInicio && fechaFin) {
        query += ' WHERE c.fecha BETWEEN ? AND ?';
        params.push(fechaInicio, fechaFin);
      }
      
      query += ' ORDER BY c.fecha DESC';
      
      const [citas] = await db.execute(query, params);
      
      res.json({
        total: citas.length,
        citas: citas
      });
    } catch (error) {
      console.error('Error generando reporte de citas:', error);
      res.status(500).json({ 
        message: 'Error al generar reporte de citas' 
      });
    }
  },

  // Reporte de usuarios registrados
  async getReporteUsuarios(req, res) {
    try {
      const [usuarios] = await db.execute(`
        SELECT 
          id,
          email,
          nombre,
          role,
          created_at,
          activo
        FROM users
        ORDER BY created_at DESC
      `);
      
      const [estadisticas] = await db.execute(`
        SELECT 
          role,
          COUNT(*) as total
        FROM users
        GROUP BY role
      `);

      res.json({
        total: usuarios.length,
        usuarios: usuarios,
        estadisticas: estadisticas
      });
    } catch (error) {
      console.error('Error generando reporte de usuarios:', error);
      res.status(500).json({ 
        message: 'Error al generar reporte de usuarios' 
      });
    }
  },

  // Reporte de médicos y sus citas
  async getReporteMedicos(req, res) {
    try {
      const [medicos] = await db.execute(`
        SELECT 
          u.id,
          u.nombre,
          u.email,
          COUNT(c.id) as total_citas,
          SUM(CASE WHEN c.estado = 'completada' THEN 1 ELSE 0 END) as citas_completadas,
          SUM(CASE WHEN c.estado = 'cancelada' THEN 1 ELSE 0 END) as citas_canceladas
        FROM users u
        LEFT JOIN citas c ON u.id = c.medico_id
        WHERE u.role = 'medico'
        GROUP BY u.id
        ORDER BY total_citas DESC
      `);

      res.json({
        total: medicos.length,
        medicos: medicos
      });
    } catch (error) {
      console.error('Error generando reporte de médicos:', error);
      res.status(500).json({ 
        message: 'Error al generar reporte de médicos' 
      });
    }
  }
};

module.exports = reportesController;
