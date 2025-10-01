// backend/src/controllers/citasController.js
const db = require ('../config/db.js'); // Ajustar según tu archivo de conexión

const citasController = {
    // Obtener todas las especialidades disponibles
    obtenerEspecialidades: async (req, res) => {
        try {
            const [especialidades] = await db.execute(`
                SELECT DISTINCT m.especialidad as nombre, m.especialidad as id
                FROM medicos m
                INNER JOIN usuarios u ON m.id_usuario = u.id
                WHERE m.especialidad IS NOT NULL 
                AND m.especialidad != ''
                AND u.rol = 'Medico'
                ORDER BY m.especialidad
            `);
            
            res.json(especialidades);
        } catch (error) {
            console.error('Error al obtener especialidades:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Obtener médicos por especialidad
    obtenerMedicosPorEspecialidad: async (req, res) => {
        try {
            const { especialidad } = req.params;
            
            const [medicos] = await db.execute(`
                SELECT m.id_usuario as id, u.nombre, m.especialidad
                FROM medicos m
                INNER JOIN usuarios u ON m.id_usuario = u.id
                WHERE m.especialidad = ? AND u.rol = 'Medico'
                ORDER BY u.nombre
            `, [especialidad]);
            
            res.json(medicos);
        } catch (error) {
            console.error('Error al obtener médicos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Obtener horarios disponibles
    obtenerHorariosDisponibles: async (req, res) => {
        try {
            const { medicoId, fecha } = req.params;
            
            const [citasExistentes] = await db.execute(`
                SELECT TIME(fecha) as hora 
                FROM citas 
                WHERE id_medico = ? AND DATE(fecha) = ? AND estado != 'Cancelada'
            `, [medicoId, fecha]);
            
            const todosLosHorarios = [
                '08:00:00', '09:00:00', '10:00:00', '11:00:00', 
                '14:00:00', '15:00:00', '16:00:00', '17:00:00'
            ];
            
            const horariosOcupados = citasExistentes.map(cita => cita.hora);
            const horariosDisponibles = todosLosHorarios.filter(
                hora => !horariosOcupados.includes(hora)
            );
            
            res.json(horariosDisponibles);
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Crear nueva cita
    crearCita: async (req, res) => {
        try {
            const { id_paciente, id_medico, fecha, hora, motivo } = req.body;

            // Validaciones
            if (!id_paciente || !id_medico || !fecha || !hora || !motivo) {
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios" 
                });
            }

            const fechaHora = `${fecha} ${hora}`;

            // Verificar disponibilidad
            const [citaExistente] = await db.execute(`
                SELECT id FROM citas 
                WHERE id_medico = ? AND fecha = ? AND estado != 'Cancelada'
            `, [id_medico, fechaHora]);

            if (citaExistente.length > 0) {
                return res.status(400).json({ 
                    error: 'Ya existe una cita programada para esa fecha y hora' 
                });
            }

            // Crear la cita
            const [result] = await db.execute(`
                INSERT INTO citas (id_paciente, id_medico, fecha, motivo, estado)
                VALUES (?, ?, ?, ?, 'Pendiente')
            `, [id_paciente, id_medico, fechaHora, motivo]);

            // Obtener detalles de la cita creada
            const [citaCreada] = await db.execute(`
                SELECT c.*, 
                       up.nombre as paciente_nombre,
                       um.nombre as medico_nombre,
                       m.especialidad
                FROM citas c
                INNER JOIN usuarios up ON c.id_paciente = up.id
                INNER JOIN usuarios um ON c.id_medico = um.id
                INNER JOIN medicos m ON c.id_medico = m.id_usuario
                WHERE c.id = ?
            `, [result.insertId]);

            res.status(201).json({
                message: 'Cita creada exitosamente',
                cita: citaCreada[0]
            });

        } catch (error) {
            console.error('Error al crear cita:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Obtener citas de un paciente
    obtenerCitasPaciente: async (req, res) => {
        try {
            const { pacienteId } = req.params;
            
            const [citas] = await db.execute(`
                SELECT c.*, 
                       um.nombre as medico_nombre,
                       m.especialidad,
                       DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha_formateada,
                       TIME_FORMAT(c.fecha, '%H:%i') as hora_formateada
                FROM citas c
                INNER JOIN medicos m ON c.id_medico = m.id_usuario
                INNER JOIN usuarios um ON m.id_usuario = um.id
                WHERE c.id_paciente = ?
                ORDER BY c.fecha DESC
            `, [pacienteId]);
            
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas del paciente:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Listar todas las citas
    listarTodasCitas: async (req, res) => {
        try {
            const [citas] = await db.execute(`
                SELECT c.*, 
                       up.nombre as paciente_nombre,
                       um.nombre as medico_nombre,
                       m.especialidad,
                       DATE_FORMAT(c.fecha, '%Y-%m-%d %H:%i') as fecha_completa
                FROM citas c
                INNER JOIN usuarios up ON c.id_paciente = up.id
                LEFT JOIN medicos m ON c.id_medico = m.id_usuario
                LEFT JOIN usuarios um ON m.id_usuario = um.id
                ORDER BY c.fecha DESC
            `);
            
            res.json(citas);
        } catch (error) {
            console.error('Error al obtener citas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // Cancelar cita
    cancelarCita: async (req, res) => {
        try {
            const { citaId } = req.params;
            
            const [result] = await db.execute(`
                UPDATE citas 
                SET estado = 'Cancelada'
                WHERE id = ? AND estado != 'Cancelada'
            `, [citaId]);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cita no encontrada o ya cancelada' });
            }
            
            res.json({ message: 'Cita cancelada exitosamente' });
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = citasController;