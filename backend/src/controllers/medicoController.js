import Usuario from '../models/usuario.model.js';
import Medico from '../models/medico.model.js';
import Cita from '../models/cita.model.js';
import { Op } from 'sequelize';

class MedicoController {
    // Dashboard del médico
    static async getDashboard(req, res) {
        try {
            const medicoId = req.usuario.id;
            const hoy = new Date().toISOString().split('T')[0];
            
            // Calcular inicio y fin de semana
            const inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
            const finSemana = new Date(inicioSemana);
            finSemana.setDate(finSemana.getDate() + 6);

            const estadisticas = {
                citasHoy: await Cita.count({
                    where: {
                        medicoId,
                        fecha: hoy,
                        estado: { [Op.ne]: 'cancelada' }
                    }
                }),
                citasPendientes: await Cita.count({
                    where: {
                        medicoId,
                        fecha: { [Op.gte]: hoy },
                        estado: 'programada'
                    }
                }),
                citasEstaSemana: await Cita.count({
                    where: {
                        medicoId,
                        fecha: {
                            [Op.between]: [
                                inicioSemana.toISOString().split('T')[0],
                                finSemana.toISOString().split('T')[0]
                            ]
                        },
                        estado: { [Op.ne]: 'cancelada' }
                    }
                })
            };

            // Obtener información del médico
            const medico = await Usuario.findByPk(medicoId, {
                include: [{
                    model: Medico,
                    as: 'datosEspecialista',
                    attributes: ['especialidad'],
                    required: false
                }]
            });

            res.json({
                success: true,
                data: {
                    estadisticas,
                    medico: {
                        nombre: medico.nombre,
                        especialidad: medico.datosEspecialista?.especialidad || 'No especificada',
                        email: medico.email
                    }
                }
            });
        } catch (error) {
            console.error('Error en dashboard médico:', error);
            res.status(500).json({
                success: false,
                message: 'Error al cargar dashboard'
            });
        }
    }

    // Obtener agenda por fecha
    static async obtenerAgenda(req, res) {
        try {
            const medicoId = req.usuario.id;
            const { fecha } = req.query;

            if (!fecha) {
                return res.status(400).json({
                    success: false,
                    message: 'Fecha es requerida'
                });
            }

            const agenda = await Cita.findAll({
                where: {
                    medicoId,
                    fecha
                },
                include: [{
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'email']
                }]
            });

            res.json({
                success: true,
                data: agenda
            });
        } catch (error) {
            console.error('Error al obtener agenda:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener agenda'
            });
        }
    }

    // Métodos vacíos para evitar errores de rutas indefinidas
    static async actualizarEstadoCita(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const cita = await Cita.findByPk(id);
            if (!cita) return res.status(404).json({ success: false, message: 'Cita no encontrada' });
            cita.estado = estado;
            await cita.save();
            res.json({ success: true, data: cita });
        } catch (error) {
            console.error('Error al actualizar estado de cita:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar estado de cita' });
        }
    }
    static async reagendarCita(req, res) {
        res.status(501).json({ success: false, message: 'No implementado' });
    }
    static async obtenerHistorialDetallado(req, res) {
        try {
            const medicoId = req.usuario?.id || req.query.medicoId;
            const { fechaDesde, fechaHasta, paciente, estado } = req.query;

            const where = { medicoId };
            if (fechaDesde && fechaHasta) {
                where.fecha = { [Op.between]: [fechaDesde, fechaHasta] };
            }
            if (estado) {
                where.estado = estado;
            }
            // Si se busca por paciente, se puede filtrar por nombre (requiere join)

            const citas = await Cita.findAll({
                where,
                include: [{
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'email', 'telefono']
                }]
            });

            // Estadísticas simples
            const estadisticas = {
                total: citas.length,
                confirmadas: citas.filter(c => c.estado === 'confirmada').length,
                completadas: citas.filter(c => c.estado === 'completada').length,
                pendientes: citas.filter(c => c.estado === 'programada').length,
                canceladas: citas.filter(c => c.estado === 'cancelada').length
            };

            res.json({
                success: true,
                data: {
                    citas,
                    estadisticas
                }
            });
        } catch (error) {
            console.error('Error al obtener historial detallado:', error);
            res.status(500).json({ success: false, message: 'Error al obtener historial' });
        }
    }
    static async obtenerObservaciones(req, res) {
        try {
            const medicoId = req.usuario?.id || req.query.medicoId;
            const { tipo, paciente } = req.query;
            const where = { medicoId };
            if (tipo) where.tipo = tipo;
            if (paciente) where.pacienteId = paciente;
            const observaciones = await Observacion.findAll({
                where,
                include: [{
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'email', 'telefono']
                }]
            });
            // Estadísticas simples
            const estadisticas = {
                total: observaciones.length,
                tipos: observaciones.reduce((acc, obs) => {
                    acc[obs.tipo] = (acc[obs.tipo] || 0) + 1;
                    return acc;
                }, {})
            };
            res.json({ success: true, data: { observaciones, estadisticas } });
        } catch (error) {
            console.error('Error al obtener observaciones:', error);
            res.status(500).json({ success: false, message: 'Error al obtener observaciones' });
        }
    }

    static async crearObservacion(req, res) {
        try {
            const { medicoId, pacienteId, fecha, hora, tipo, contenido } = req.body;
            const nueva = await Observacion.create({ medicoId, pacienteId, fecha, hora, tipo, contenido });
            res.json({ success: true, data: nueva });
        } catch (error) {
            console.error('Error al crear observación:', error);
            res.status(500).json({ success: false, message: 'Error al crear observación' });
        }
    }

    static async actualizarObservacion(req, res) {
        try {
            const { id } = req.params;
            const { tipo, contenido, fecha, hora } = req.body;
            const obs = await Observacion.findByPk(id);
            if (!obs) return res.status(404).json({ success: false, message: 'No encontrada' });
            obs.tipo = tipo ?? obs.tipo;
            obs.contenido = contenido ?? obs.contenido;
            obs.fecha = fecha ?? obs.fecha;
            obs.hora = hora ?? obs.hora;
            await obs.save();
            res.json({ success: true, data: obs });
        } catch (error) {
            console.error('Error al actualizar observación:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar observación' });
        }
    }

    static async eliminarObservacion(req, res) {
        try {
            const { id } = req.params;
            const obs = await Observacion.findByPk(id);
            if (!obs) return res.status(404).json({ success: false, message: 'No encontrada' });
            await obs.destroy();
            res.json({ success: true });
        } catch (error) {
            console.error('Error al eliminar observación:', error);
            res.status(500).json({ success: false, message: 'Error al eliminar observación' });
        }
    }
    static async generarReporteDiario(req, res) {
        try {
            const medicoId = req.usuario?.id || req.query.medicoId;
            const { fecha } = req.body;
            const citas = await Cita.findAll({
                where: { medicoId, fecha },
            });
            const reporte = {
                totalCitas: citas.length,
                confirmadas: citas.filter(c => c.estado === 'confirmada').length,
                completadas: citas.filter(c => c.estado === 'completada').length,
                pendientes: citas.filter(c => c.estado === 'programada').length,
                canceladas: citas.filter(c => c.estado === 'cancelada').length
            };
            res.json({ success: true, data: reporte });
        } catch (error) {
            console.error('Error al generar reporte diario:', error);
            res.status(500).json({ success: false, message: 'Error al generar reporte' });
        }
    }
}

export default MedicoController;