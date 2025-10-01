const dashboardController = {
  // Estadísticas generales
  async getStats(req, res) {
    try {
      // Total de usuarios por rol
      const [usuarios] = await db.execute(`
        SELECT role, COUNT(*) as total 
        FROM users 
        GROUP BY role
      `);
      
      // Total de citas
      const [totalCitas] = await db.execute(
        'SELECT COUNT(*) as total FROM citas'
      );
      
      // Citas de hoy
      const [citasHoy] = await db.execute(`
        SELECT COUNT(*) as total 
        FROM citas 
        WHERE DATE(fecha) = CURDATE()
      `);
      
      // Citas por estado
      const [citasPorEstado] = await db.execute(`
        SELECT estado, COUNT(*) as total 
        FROM citas 
        GROUP BY estado
      `);
      
      // Últimos usuarios registrados
      const [ultimosUsuarios] = await db.execute(`
        SELECT id, nombre, email, role, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
      `);
      
      // Próximas citas
      const [proximasCitas] = await db.execute(`
        SELECT 
          c.id,
          c.fecha,
          c.motivo,
          p.nombre as paciente_nombre,
          m.nombre as medico_nombre
        FROM citas c
        LEFT JOIN users p ON c.paciente_id = p.id
        LEFT JOIN users m ON c.medico_id = m.id
        WHERE c.fecha >= NOW() AND c.estado = 'programada'
        ORDER BY c.fecha ASC
        LIMIT 5
      `);

      res.json({
        usuarios: usuarios,
        totalCitas: totalCitas[0].total,
        citasHoy: citasHoy[0].total,
        citasPorEstado: citasPorEstado,
        ultimosUsuarios: ultimosUsuarios,
        proximasCitas: proximasCitas
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ 
        message: 'Error al obtener estadísticas del dashboard' 
      });
    }
  }
};

module.exports = dashboardController;
