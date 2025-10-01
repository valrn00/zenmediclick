const fs = require('fs').promises;
const path = require('path');

class PacientesModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/pacientes_simulados.json');
  }

  async cargarDatos() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      return { pacientes: [], citas: [], historial_citas: [], recordatorios: [] };
    }
  }

  async guardarDatos(datos) {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(datos, null, 2));
      return true;
    } catch (error) {
      console.error('Error guardando datos:', error);
      return false;
    }
  }

  // CRUD PACIENTES
  async obtenerTodosLosPacientes() {
    const datos = await this.cargarDatos();
    return datos.pacientes;
  }

  async obtenerPacientePorId(id) {
    const datos = await this.cargarDatos();
    return datos.pacientes.find(p => p.id === parseInt(id));
  }

  async obtenerPacientePorCedula(cedula) {
    const datos = await this.cargarDatos();
    return datos.pacientes.find(p => p.cedula === cedula);
  }

  async crearPaciente(pacienteData) {
    const datos = await this.cargarDatos();
    const nuevoId = datos.pacientes.length > 0 
      ? Math.max(...datos.pacientes.map(p => p.id)) + 1 
      : 1;

    const nuevoPaciente = {
      id: nuevoId,
      ...pacienteData,
      fecha_registro: new Date().toISOString(),
      estado: 'Activo'
    };

    datos.pacientes.push(nuevoPaciente);
    if (await this.guardarDatos(datos)) {
      return nuevoPaciente;
    }
    return null;
  }

  async actualizarPaciente(id, pacienteData) {
    const datos = await this.cargarDatos();
    const index = datos.pacientes.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;

    datos.pacientes[index] = {
      ...datos.pacientes[index],
      ...pacienteData,
      id: parseInt(id)
    };

    if (await this.guardarDatos(datos)) {
      return datos.pacientes[index];
    }
    return null;
  }

  async eliminarPaciente(id) {
    const datos = await this.cargarDatos();
    const index = datos.pacientes.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;

    datos.pacientes.splice(index, 1);
    return await this.guardarDatos(datos);
  }

  // GESTIÓN DE CITAS
  async obtenerCitasPaciente(pacienteId) {
    const datos = await this.cargarDatos();
    return datos.citas.filter(c => c.paciente_id === parseInt(pacienteId));
  }

  async agendarCita(citaData) {
    const datos = await this.cargarDatos();
    const nuevaId = datos.citas.length > 0 
      ? Math.max(...datos.citas.map(c => c.id)) + 1 
      : 1;

    const nuevaCita = {
      id: nuevaId,
      ...citaData,
      estado: 'Programada'
    };

    datos.citas.push(nuevaCita);
    if (await this.guardarDatos(datos)) {
      return nuevaCita;
    }
    return null;
  }

  async cancelarCita(citaId) {
    const datos = await this.cargarDatos();
    const index = datos.citas.findIndex(c => c.id === parseInt(citaId));
    if (index === -1) return false;

    datos.citas[index].estado = 'Cancelada';
    return await this.guardarDatos(datos);
  }

  // HISTORIAL MÉDICO
  async obtenerHistorialPaciente(pacienteId) {
    const datos = await this.cargarDatos();
    return datos.historial_citas.filter(h => h.paciente_id === parseInt(pacienteId));
  }

  async agregarConsulta(consultaData) {
    const datos = await this.cargarDatos();
    const nuevoId = datos.historial_citas.length > 0 
      ? Math.max(...datos.historial_citas.map(h => h.id)) + 1 
      : 1;

    const nuevaConsulta = {
      id: nuevoId,
      ...consultaData,
      fecha: new Date().toISOString().split('T')[0]
    };

    datos.historial_citas.push(nuevaConsulta);
    if (await this.guardarDatos(datos)) {
      return nuevaConsulta;
    }
    return null;
  }

  // RECORDATORIOS
  async obtenerRecordatoriosPaciente(pacienteId) {
    const datos = await this.cargarDatos();
    return datos.recordatorios.filter(r => r.paciente_id === parseInt(pacienteId));
  }

  async crearRecordatorio(recordatorioData) {
    const datos = await this.cargarDatos();
    const nuevoId = datos.recordatorios.length > 0 
      ? Math.max(...datos.recordatorios.map(r => r.id)) + 1 
      : 1;

    const nuevoRecordatorio = {
      id: nuevoId,
      ...recordatorioData,
      estado: 'Pendiente'
    };

    datos.recordatorios.push(nuevoRecordatorio);
    if (await this.guardarDatos(datos)) {
      return nuevoRecordatorio;
    }
    return null;
  }

  // BÚSQUEDAS Y FILTROS
  async buscarPacientes(termino) {
    const datos = await this.cargarDatos();
    const terminoLower = termino.toLowerCase();
    return datos.pacientes.filter(p => 
      p.nombre.toLowerCase().includes(terminoLower) ||
      p.apellido.toLowerCase().includes(terminoLower) ||
      p.cedula.includes(termino) ||
      p.email.toLowerCase().includes(terminoLower)
    );
  }

  async filtrarPacientesPorEstado(estado) {
    const datos = await this.cargarDatos();
    return datos.pacientes.filter(p => p.estado === estado);
  }

  async obtenerEstadisticas() {
    const datos = await this.cargarDatos();
    return {
      total_pacientes: datos.pacientes.length,
      pacientes_activos: datos.pacientes.filter(p => p.estado === 'Activo').length,
      pacientes_inactivos: datos.pacientes.filter(p => p.estado === 'Inactivo').length,
      citas_programadas: datos.citas.filter(c => c.estado === 'Programada').length,
      citas_completadas: datos.citas.filter(c => c.estado === 'Completada').length,
      pacientes_por_eps: this.agruparPorEPS(datos.pacientes),
      pacientes_por_genero: this.agruparPorGenero(datos.pacientes)
    };
  }

  agruparPorEPS(pacientes) {
    return pacientes.reduce((acc, paciente) => {
      acc[paciente.eps] = (acc[paciente.eps] || 0) + 1;
      return acc;
    }, {});
  }

  agruparPorGenero(pacientes) {
    return pacientes.reduce((acc, paciente) => {
      acc[paciente.genero] = (acc[paciente.genero] || 0) + 1;
      return acc;
    }, {});
  }
}

module.exports = PacientesModel;