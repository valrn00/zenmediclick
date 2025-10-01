class MedicoAPI {
  constructor() {
    this.baseURL = 'https://api.medico-system.com'; // Reemplaza con tu URL real
  }

  getHeaders() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async handleResponse(response) {
    const data = await response.json();
    return {
      success: response.ok,
      data: data.data || data,
      message: data.message || (response.ok ? 'Éxito' : 'Error en la solicitud'),
    };
  }

  async obtenerAgenda(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/agenda?${queryString}`, {
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }

  async actualizarEstadoCita(id, datos) {
    const response = await fetch(`${this.baseURL}/citas/${id}/estado`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(datos),
    });
    return await this.handleResponse(response);
  }

  async obtenerHistorialDetallado(filtros = {}) {
    const queryString = new URLSearchParams(filtros).toString();
    const response = await fetch(`${this.baseURL}/historial-detallado?${queryString}`, {
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }

  async obtenerObservaciones(filtros = {}) {
    const queryString = new URLSearchParams(filtros).toString();
    const response = await fetch(`${this.baseURL}/observaciones?${queryString}`, {
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }

  async crearObservacion(datos) {
    const response = await fetch(`${this.baseURL}/observaciones`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(datos),
    });
    return await this.handleResponse(response);
  }

  async actualizarObservacion(id, datos) {
    const response = await fetch(`${this.baseURL}/observaciones/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(datos),
    });
    return await this.handleResponse(response);
  }

  async eliminarObservacion(id) {
    const response = await fetch(`${this.baseURL}/observaciones/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }

  async generarReporteDiario(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/reporte-diario?${queryString}`, {
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }

  async buscarPacientes(query) {
    const response = await fetch(`${this.baseURL}/pacientes?search=${encodeURIComponent(query)}`, {
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }

  async crearCita(datos) {
    const response = await fetch(`${this.baseURL}/citas`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(datos),
    });
    return await this.handleResponse(response);
  }

  async getDashboard() {
    const response = await fetch(`${this.baseURL}/dashboard`, {
      headers: this.getHeaders(),
    });
    return await this.handleResponse(response);
  }
}

export default MedicoAPI;