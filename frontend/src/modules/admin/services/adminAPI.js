// frontend/src/modules/admin/services/adminAPI.js

import api from '../../../shared/services/api';

class AdminAPI {
  // ========== DASHBOARD ==========
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo estadísticas');
    }
  }

  // ========== USUARIOS ==========
  async getUsuarios(filtros = {}) {
    try {
      const response = await api.get('/usuarios', { params: filtros });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo usuarios');
    }
  }

  async createUsuario(userData) {
    try {
      const response = await api.post('/usuarios', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creando usuario');
    }
  }

  async updateUsuario(id, userData) {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error actualizando usuario');
    }
  }

  async deleteUsuario(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error eliminando usuario');
    }
  }

  // ========== REPORTES ==========
  async getReportes(tipo, filtros = {}) {
    try {
      const response = await api.get(`/admin/reportes/${tipo}`, { params: filtros });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo reportes');
    }
  }

  async getReporteCitas(fechaInicio, fechaFin) {
    try {
      const response = await api.get('/admin/reportes/citas', {
        params: { fechaInicio, fechaFin }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo reporte de citas');
    }
  }

  async getReporteUsuarios() {
    try {
      const response = await api.get('/admin/reportes/usuarios');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo reporte de usuarios');
    }
  }

  async getReporteMedicos() {
    try {
      const response = await api.get('/admin/reportes/medicos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo reporte de médicos');
    }
  }

  // ========== CITAS ==========
  async getCitas(filtros = {}) {
    try {
      const response = await api.get('/admin/citas', { params: filtros });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo citas');
    }
  }

  async createCita(citaData) {
    try {
      const response = await api.post('/admin/citas', citaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creando cita');
    }
  }

  async updateCita(id, citaData) {
    try {
      const response = await api.put(`/admin/citas/${id}`, citaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error actualizando cita');
    }
  }

  async deleteCita(id) {
    try {
      const response = await api.delete(`/admin/citas/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error eliminando cita');
    }
  }

  // ========== HORARIOS (SCHEDULE) ==========
  async saveSchedule(doctorId, scheduleData) {
    try {
      const response = await api.post(`/admin/schedule/${doctorId}`, scheduleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error guardando horarios');
    }
  }

  async getSchedule(doctorId) {
    try {
      const response = await api.get(`/admin/schedule/${doctorId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error obteniendo horarios');
    }
  }
}

export default new AdminAPI();