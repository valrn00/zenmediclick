// routers/pacientes.js
import express from "express";
import PacientesModel from "../models/pacientes.js";

const router = express.Router();
const pacientesModel = new PacientesModel();

// RUTAS PRINCIPALES DE PACIENTES

// Obtener todos los pacientes o buscar
router.get("/", async (req, res) => {
    try {
        const { buscar, estado } = req.query;
        
        let pacientes;
        
        if (buscar) {
            pacientes = await pacientesModel.buscarPacientes(buscar);
        } else if (estado) {
            pacientes = await pacientesModel.filtrarPacientesPorEstado(estado);
        } else {
            pacientes = await pacientesModel.obtenerTodosLosPacientes();
        }

        return res.json({
            success: true,
            data: pacientes,
            count: pacientes.length
        });
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        return res.json({
            success: false,
            message: "Error al obtener pacientes"
        });
    }
});

// Obtener paciente por ID
router.get("/:id", async (req, res) => {
    try {
        const paciente = await pacientesModel.obtenerPacientePorId(req.params.id);
        
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        return res.json({
            success: true,
            data: paciente
        });
    } catch (error) {
        console.error("Error al obtener paciente:", error);
        return res.json({
            success: false,
            message: "Error al obtener paciente"
        });
    }
});

// Obtener paciente por cédula
router.get("/cedula/:cedula", async (req, res) => {
    try {
        const paciente = await pacientesModel.obtenerPacientePorCedula(req.params.cedula);
        
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        return res.json({
            success: true,
            data: paciente
        });
    } catch (error) {
        console.error("Error al obtener paciente:", error);
        return res.json({
            success: false,
            message: "Error al obtener paciente"
        });
    }
});

// Crear nuevo paciente
router.post("/crear-paciente", async (req, res) => {
    try {
        const {
            cedula, nombre, apellido, fecha_nacimiento, genero,
            telefono, email, direccion, ciudad, eps, tipo_sangre,
            estado_civil, ocupacion, contacto_emergencia, historial_medico
        } = req.body;

        // Validaciones básicas
        if (!cedula || !nombre || !apellido || !fecha_nacimiento) {
            return res.json({
                success: false,
                message: "Campos requeridos: cedula, nombre, apellido, fecha_nacimiento"
            });
        }

        // Verificar si ya existe un paciente con esa cédula
        const pacienteExistente = await pacientesModel.obtenerPacientePorCedula(cedula);
        if (pacienteExistente) {
            return res.json({
                success: false,
                message: "Ya existe un paciente con esa cédula"
            });
        }

        // Calcular edad
        const edad = new Date().getFullYear() - new Date(fecha_nacimiento).getFullYear();

        const nuevoPaciente = await pacientesModel.crearPaciente({
            cedula, nombre, apellido, fecha_nacimiento, edad, genero,
            telefono, email, direccion, ciudad, eps, tipo_sangre,
            estado_civil, ocupacion, contacto_emergencia, historial_medico
        });

        if (!nuevoPaciente) {
            return res.json({
                success: false,
                message: "Error al crear paciente"
            });
        }

        return res.json({
            success: true,
            message: "Paciente creado exitosamente",
            data: nuevoPaciente
        });
    } catch (error) {
        console.error("Error al crear paciente:", error);
        return res.json({
            success: false,
            message: "Error al crear paciente"
        });
    }
});

// Actualizar paciente
router.post("/actualizar-paciente", async (req, res) => {
    try {
        const { id, ...datosActualizar } = req.body;
        
        if (!id) {
            return res.json({
                success: false,
                message: "ID de paciente requerido"
            });
        }

        const pacienteActualizado = await pacientesModel.actualizarPaciente(id, datosActualizar);
        
        if (!pacienteActualizado) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        return res.json({
            success: true,
            message: "Paciente actualizado exitosamente",
            data: pacienteActualizado
        });
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        return res.json({
            success: false,
            message: "Error al actualizar paciente"
        });
    }
});

// Eliminar paciente
router.post("/eliminar-paciente", async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.json({
                success: false,
                message: "ID de paciente requerido"
            });
        }

        const eliminado = await pacientesModel.eliminarPaciente(id);
        
        if (!eliminado) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        return res.json({
            success: true,
            message: "Paciente eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar paciente:", error);
        return res.json({
            success: false,
            message: "Error al eliminar paciente"
        });
    }
});

// GESTIÓN DE CITAS

// Obtener citas de un paciente
router.get("/citas/:cedula", async (req, res) => {
    try {
        const paciente = await pacientesModel.obtenerPacientePorCedula(req.params.cedula);
        
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        const citas = await pacientesModel.obtenerCitasPaciente(paciente.id);
        
        return res.json({
            success: true,
            citas: citas.map(cita => ({
                id: cita.id,
                fecha: cita.fecha,
                hora: cita.hora,
                medico: cita.medico,
                especialidad: cita.especialidad,
                motivo: cita.motivo,
                estado: cita.estado,
                consultorio: cita.consultorio
            }))
        });
    } catch (error) {
        console.error("Error al obtener citas:", error);
        return res.json({
            success: false,
            message: "Error al obtener citas"
        });
    }
});

// Agendar cita para paciente
router.post("/agendar-cita-paciente", async (req, res) => {
    try {
        const { cedula_paciente, fecha, hora, medico, especialidad, motivo, consultorio } = req.body;

        // Validaciones
        if (!cedula_paciente || !fecha || !hora || !medico || !especialidad) {
            return res.json({
                success: false,
                message: "Campos requeridos: cedula_paciente, fecha, hora, medico, especialidad"
            });
        }

        const paciente = await pacientesModel.obtenerPacientePorCedula(cedula_paciente);
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        const nuevaCita = await pacientesModel.agendarCita({
            paciente_id: paciente.id,
            cedula_paciente,
            fecha,
            hora,
            medico,
            especialidad,
            motivo,
            consultorio
        });

        if (!nuevaCita) {
            return res.json({
                success: false,
                message: "Error al agendar cita"
            });
        }

        return res.json({
            success: true,
            message: "Cita agendada exitosamente",
            cita_id: nuevaCita.id
        });
    } catch (error) {
        console.error("Error agendando cita:", error);
        return res.json({
            success: false,
            message: "Error al agendar cita"
        });
    }
});

// Cancelar cita
router.post("/cancelar-cita-paciente", async (req, res) => {
    try {
        const { cita_id } = req.body;

        if (!cita_id) {
            return res.json({
                success: false,
                message: "ID de cita requerido"
            });
        }

        const cancelada = await pacientesModel.cancelarCita(cita_id);
        
        if (!cancelada) {
            return res.json({
                success: false,
                message: "Cita no encontrada"
            });
        }

        return res.json({
            success: true,
            message: "Cita cancelada exitosamente"
        });
    } catch (error) {
        console.error("Error cancelando cita:", error);
        return res.json({
            success: false,
            message: "Error al cancelar cita"
        });
    }
});

// HISTORIAL MÉDICO

// Obtener historial médico de un paciente
router.get("/historial/:cedula", async (req, res) => {
    try {
        const paciente = await pacientesModel.obtenerPacientePorCedula(req.params.cedula);
        
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        const historial = await pacientesModel.obtenerHistorialPaciente(paciente.id);
        
        return res.json({
            success: true,
            historial: historial.map(consulta => ({
                id: consulta.id,
                fecha: consulta.fecha,
                medico: consulta.medico,
                especialidad: consulta.especialidad,
                diagnostico: consulta.diagnostico,
                tratamiento: consulta.tratamiento,
                observaciones: consulta.observaciones
            }))
        });
    } catch (error) {
        console.error("Error obteniendo historial:", error);
        return res.json({
            success: false,
            message: "Error al obtener historial"
        });
    }
});

// Agregar consulta al historial
router.post("/agregar-consulta", async (req, res) => {
    try {
        const { cedula_paciente, medico, especialidad, diagnostico, tratamiento, observaciones } = req.body;

        if (!cedula_paciente || !medico || !especialidad || !diagnostico) {
            return res.json({
                success: false,
                message: "Campos requeridos: cedula_paciente, medico, especialidad, diagnostico"
            });
        }

        const paciente = await pacientesModel.obtenerPacientePorCedula(cedula_paciente);
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        const nuevaConsulta = await pacientesModel.agregarConsulta({
            paciente_id: paciente.id,
            medico,
            especialidad,
            diagnostico,
            tratamiento,
            observaciones
        });

        if (!nuevaConsulta) {
            return res.json({
                success: false,
                message: "Error al agregar consulta"
            });
        }

        return res.json({
            success: true,
            message: "Consulta agregada exitosamente",
            data: nuevaConsulta
        });
    } catch (error) {
        console.error("Error agregando consulta:", error);
        return res.json({
            success: false,
            message: "Error al agregar consulta"
        });
    }
});

// RECORDATORIOS

// Obtener recordatorios de un paciente
router.get("/recordatorios/:cedula", async (req, res) => {
    try {
        const paciente = await pacientesModel.obtenerPacientePorCedula(req.params.cedula);
        
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        const recordatorios = await pacientesModel.obtenerRecordatoriosPaciente(paciente.id);
        
        return res.json({
            success: true,
            recordatorios: recordatorios
        });
    } catch (error) {
        console.error("Error obteniendo recordatorios:", error);
        return res.json({
            success: false,
            message: "Error al obtener recordatorios"
        });
    }
});

// Crear recordatorio
router.post("/crear-recordatorio", async (req, res) => {
    try {
        const { cedula_paciente, mensaje, fecha, tipo } = req.body;

        if (!cedula_paciente || !mensaje || !fecha) {
            return res.json({
                success: false,
                message: "Campos requeridos: cedula_paciente, mensaje, fecha"
            });
        }

        const paciente = await pacientesModel.obtenerPacientePorCedula(cedula_paciente);
        if (!paciente) {
            return res.json({
                success: false,
                message: "Paciente no encontrado"
            });
        }

        const nuevoRecordatorio = await pacientesModel.crearRecordatorio({
            paciente_id: paciente.id,
            mensaje,
            fecha,
            tipo: tipo || 'General'
        });

        if (!nuevoRecordatorio) {
            return res.json({
                success: false,
                message: "Error al crear recordatorio"
            });
        }

        return res.json({
            success: true,
            message: "Recordatorio creado exitosamente",
            data: nuevoRecordatorio
        });
    } catch (error) {
        console.error("Error creando recordatorio:", error);
        return res.json({
            success: false,
            message: "Error al crear recordatorio"
        });
    }
});

// ESTADÍSTICAS Y REPORTES

// Obtener estadísticas generales
router.get("/estadisticas/general", async (req, res) => {
    try {
        const estadisticas = await pacientesModel.obtenerEstadisticas();
        
        return res.json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        console.error("Error obteniendo estadísticas:", error);
        return res.json({
            success: false,
            message: "Error al obtener estadísticas"
        });
    }
});

export default router;