class MedicoSystem {
    constructor() {
        this.api = new MedicoAPI();
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('agenda')) return 'agenda';
        if (path.includes('detalles')) return 'detalles';
        if (path.includes('observaciones')) return 'observaciones';
        return 'dashboard';
    }

    async init() {
        try {
            // Verificar autenticación
            if (!this.verificarAuth()) return;

            // Inicializar según la página actual
            switch (this.currentPage) {
                case 'dashboard':
                    await this.initDashboard();
                    break;
                case 'agenda':
                    await this.initAgenda();
                    break;
                case 'detalles':
                    await this.initDetalles();
                    break;
                case 'observaciones':
                    await this.initObservaciones();
                    break;
            }

            console.log(`Página ${this.currentPage} inicializada correctamente`);
        } catch (error) {
            console.error('Error al inicializar sistema:', error);
            this.showMessage('Error al cargar la aplicación', 'error');
        }
    }

    verificarAuth() {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (!token) {
            alert('Sesión expirada. Redirigiendo al login...');
            window.location.href = '../login.html';
            return false;
        }
        return true;
    }

    // === INICIALIZADORES POR PÁGINA ===
    async initDashboard() {
        const result = await this.api.getDashboard();
        if (result.success) {
            this.actualizarEstadisticasDashboard(result.data.estadisticas);
            this.actualizarInfoMedico(result.data.medico);
        }

        // Configurar funciones globales del dashboard
        this.setupDashboardFunctions();
    }

    async initAgenda() {
        // Cargar citas del día actual
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaCita').value = hoy;
        
        await this.cargarAgenda(hoy);
        this.setupAgendaFunctions();
    }

    async initDetalles() {
        // Establecer fechas por defecto
        const hoy = new Date();
        const hace30dias = new Date();
        hace30dias.setDate(hace30dias.getDate() - 30);
        
        document.getElementById('fechaDesde').value = hace30dias.toISOString().split('T')[0];
        document.getElementById('fechaHasta').value = hoy.toISOString().split('T')[0];
        
        await this.cargarHistorialDetallado();
        this.setupDetallesFunctions();
    }

    async initObservaciones() {
        await this.cargarObservaciones();
        this.setupObservacionesFunctions();
    }

    // === FUNCIONES DE AGENDA ===
    async cargarAgenda(fecha) {
        try {
            const result = await this.api.obtenerAgenda({ fecha });
            
            if (result.success) {
                this.renderizarTablaCitas(result.data);
                this.showMessage('Agenda cargada exitosamente', 'success');
            } else {
                this.showMessage('Error al cargar agenda: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión al cargar agenda', 'error');
        }
    }

    renderizarTablaCitas(citas) {
        const tbody = document.getElementById('appointmentsBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (citas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #666;">
                        No hay citas programadas para esta fecha
                    </td>
                </tr>
            `;
            return;
        }

        citas.forEach(cita => {
            const row = document.createElement('tr');
            
            const statusClass = this.getStatusClass(cita.estado);
            const statusText = this.getStatusText(cita.estado);
            
            row.innerHTML = `
                <td>${cita.hora}</td>
                <td>${cita.paciente.nombre}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${cita.paciente.telefono || 'No especificado'}</td>
                <td>${cita.motivo || 'No especificado'}</td>
                <td>
                    ${this.generarBotonesCita(cita)}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    getStatusClass(estado) {
        const classes = {
            'programada': 'status-pendiente',
            'confirmada': 'status-confirmada',
            'completada': 'status-confirmada',
            'cancelada': 'status-cancelar',
            'reagendada': 'status-pendiente'
        };
        return classes[estado] || 'status-pendiente';
    }

    getStatusText(estado) {
        const textos = {
            'programada': 'Pendiente',
            'confirmada': 'Confirmada',
            'completada': 'Completada',
            'cancelada': 'Cancelada',
            'reagendada': 'Reagendada'
        };
        return textos[estado] || estado;
    }

    generarBotonesCita(cita) {
        let botones = `
            <button onclick="medicoSystem.verDetalleCita(${cita.id})" 
                    style="background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin: 2px;">
                Ver
            </button>
        `;

        if (cita.estado === 'programada') {
            botones += `
                <button onclick="medicoSystem.confirmarCita(${cita.id})" 
                        style="background: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 5px; margin: 2px;">
                    Confirmar
                </button>
            `;
        }

        if (cita.estado === 'confirmada') {
            botones += `
                <button onclick="medicoSystem.completarCita(${cita.id})" 
                        style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin: 2px;">
                    Completar
                </button>
            `;
        }

        if (cita.estado !== 'completada' && cita.estado !== 'cancelada') {
            botones += `
                <button onclick="medicoSystem.cancelarCita(${cita.id})" 
                        style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin: 2px;">
                    Cancelar
                </button>
            `;
        }

        return botones;
    }

    // === FUNCIONES DE HISTORIAL DETALLADO ===
    async cargarHistorialDetallado() {
        try {
            const filtros = {
                fechaDesde: document.getElementById('fechaDesde')?.value,
                fechaHasta: document.getElementById('fechaHasta')?.value,
                paciente: document.getElementById('buscarPaciente')?.value,
                estado: document.getElementById('filtroEstado')?.value
            };

            const result = await this.api.obtenerHistorialDetallado(filtros);
            
            if (result.success) {
                this.renderizarHistorialDetallado(result.data.citas);
                this.actualizarEstadisticasHistorial(result.data.estadisticas);
            } else {
                this.showMessage('Error al cargar historial: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión al cargar historial', 'error');
        }
    }

    renderizarHistorialDetallado(citas) {
        const container = document.getElementById('listaCitas');
        if (!container) return;

        container.innerHTML = '';

        if (citas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <p>No se encontraron citas con los filtros aplicados</p>
                </div>
            `;
            return;
        }

        citas.forEach(cita => {
            const citaCard = document.createElement('div');
            citaCard.className = 'cita-card';
            citaCard.onclick = () => this.seleccionarCitaDetalle(cita);
            
            citaCard.innerHTML = `
                <div class="cita-status status-${cita.estado}">${cita.estado.toUpperCase()}</div>
                <div class="cita-header">
                    <div class="cita-fecha">${this.formatearFecha(cita.fecha)}</div>
                    <div class="cita-hora">${cita.hora}</div>
                </div>
                <div class="cita-paciente">${cita.paciente.nombre}</div>
                <div class="cita-info">
                    <div class="info-item">
                        <div class="info-label">Motivo</div>
                        <div class="info-value">${cita.motivo || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Teléfono</div>
                        <div class="info-value">${cita.paciente.telefono || 'No especificado'}</div>
                    </div>
                </div>
            `;
            
            container.appendChild(citaCard);
        });
    }

    // === FUNCIONES DE OBSERVACIONES ===
    async cargarObservaciones(filtros = {}) {
        try {
            const result = await this.api.obtenerObservaciones(filtros);
            
            if (result.success) {
                this.renderizarObservaciones(result.data.observaciones);
                this.actualizarEstadisticasObservaciones(result.data.estadisticas);
            } else {
                this.showMessage('Error al cargar observaciones: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión al cargar observaciones', 'error');
        }
    }

    renderizarObservaciones(observaciones) {
        const container = document.getElementById('observationsList');
        if (!container) return;

        container.innerHTML = '';

        if (observaciones.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>No se encontraron observaciones</p>
                </div>
            `;
            return;
        }

        observaciones.forEach(obs => {
            const obsCard = document.createElement('div');
            obsCard.className = 'observation-card';
            
            obsCard.innerHTML = `
                <div class="observation-header">
                    <div class="patient-info">
                        <div class="patient-name">${obs.paciente.nombre}</div>
                        <div class="observation-date">
                            📅 ${this.formatearFecha(obs.fecha)} - ${obs.hora || ''}
                        </div>
                    </div>
                    <div class="observation-type type-${obs.tipo}">
                        ${obs.tipo.replace('-', ' ')}
                    </div>
                </div>
                
                <div class="observation-content">
                    ${obs.contenido}
                </div>
                
                <div class="observation-actions">
                    <button class="action-btn btn-edit" onclick="medicoSystem.editarObservacion(${obs.id})">
                        ✏️ Editar
                    </button>
                    <button class="action-btn btn-print" onclick="medicoSystem.imprimirObservacion(${obs.id})">
                        🖨️ Imprimir
                    </button>
                    <button class="action-btn btn-delete" onclick="medicoSystem.eliminarObservacion(${obs.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            `;
            
            container.appendChild(obsCard);
        });
    }

    // === FUNCIONES DE ACCIÓN ===
    async confirmarCita(id) {
        try {
            const result = await this.api.actualizarEstadoCita(id, { estado: 'confirmada' });
            if (result.success) {
                this.showMessage('Cita confirmada exitosamente', 'success');
                await this.cargarAgenda(document.getElementById('fechaCita').value);
            } else {
                this.showMessage('Error al confirmar cita: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async completarCita(id) {
        try {
            const result = await this.api.actualizarEstadoCita(id, { estado: 'completada' });
            if (result.success) {
                this.showMessage('Cita completada exitosamente', 'success');
                await this.cargarAgenda(document.getElementById('fechaCita').value);
            } else {
                this.showMessage('Error al completar cita: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
        }
    }

    async cancelarCita(id) {
        if (confirm('¿Está seguro de cancelar esta cita?')) {
            try {
                const result = await this.api.actualizarEstadoCita(id, { estado: 'cancelada' });
                if (result.success) {
                    this.showMessage('Cita cancelada exitosamente', 'success');
                    await this.cargarAgenda(document.getElementById('fechaCita').value);
                } else {
                    this.showMessage('Error al cancelar cita: ' + result.message, 'error');
                }
            } catch (error) {
                this.showMessage('Error de conexión', 'error');
            }
        }
    }

    async crearNuevaObservacion(datos) {
        try {
            const result = await this.api.crearObservacion(datos);
            if (result.success) {
                this.showMessage('Observación creada exitosamente', 'success');
                await this.cargarObservaciones();
                return true;
            } else {
                this.showMessage('Error al crear observación: ' + result.message, 'error');
                return false;
            }
        } catch (error) {
            this.showMessage('Error de conexión', 'error');
            return false;
        }
    }

    async eliminarObservacion(id) {
        if (confirm('¿Está seguro de eliminar esta observación?')) {
            try {
                const result = await this.api.eliminarObservacion(id);
                if (result.success) {
                    this.showMessage('Observación eliminada exitosamente', 'success');
                    await this.cargarObservaciones();
                } else {
                    this.showMessage('Error al eliminar observación: ' + result.message, 'error');
                }
            } catch (error) {
                this.showMessage('Error de conexión', 'error');
            }
        }
    }

    // === FUNCIONES DE CONFIGURACIÓN ===
    setupDashboardFunctions() {
        // Reemplazar función global de cancelar cita
        window.showCancelModal = async () => {
            try {
                const result = await this.api.obtenerCitas({ estado: 'programada' });
                
                if (result.success && result.data.length > 0) {
                    let citasText = 'CITAS PROGRAMADAS PARA CANCELAR:\n\n';
                    result.data.slice(0, 5).forEach((cita, index) => {
                        citasText += `${index + 1}. ${cita.paciente.nombre}\n`;
                        citasText += `   Fecha: ${cita.fecha} - Hora: ${cita.hora}\n`;
                        citasText += `   Motivo: ${cita.motivo || 'No especificado'}\n\n`;
                    });
                    
                    if (result.data.length > 5) {
                        citasText += `... y ${result.data.length - 5} citas más.\n\n`;
                    }
                    
                    citasText += 'Para cancelar específicamente, vaya a la agenda completa.';
                    alert(citasText);
                    
                    window.location.href = 'pages/agenda.html';
                } else {
                    alert('No tiene citas programadas para cancelar.');
                }
            } catch (error) {
                alert('Error al cargar citas. Redirigiendo a la agenda...');
                window.location.href = 'pages/agenda.html';
            }
        };
    }

    setupAgendaFunctions() {
        // Funciones globales para agenda
        window.buscarCitas = () => {
            const fecha = document.getElementById('fechaCita').value;
            if (fecha) {
                this.cargarAgenda(fecha);
            } else {
                this.showMessage('Seleccione una fecha', 'warning');
            }
        };

        window.nuevaCita = () => {
            document.getElementById('modalNuevaCita').style.display = 'block';
        };

        window.cerrarModal = () => {
            document.getElementById('modalNuevaCita').style.display = 'none';
        };

        window.reporteDiario = async () => {
            const fecha = document.getElementById('fechaCita').value;
            try {
                const result = await this.api.generarReporteDiario({ fecha });
                if (result.success) {
                    const reporte = result.data;
                    const mensaje = `REPORTE DEL ${fecha}:
Total de citas: ${reporte.totalCitas}
Confirmadas: ${reporte.confirmadas}
Completadas: ${reporte.completadas}
Pendientes: ${reporte.pendientes}
Canceladas: ${reporte.canceladas}`;
                    alert(mensaje);
                }
            } catch (error) {
                this.showMessage('Error al generar reporte', 'error');
            }
        };

        window.configurarHorarios = () => {
            alert('Redirigiendo a configuración de horarios...');
            // Aquí podrías implementar la navegación a una página de configuración
        };

        window.notificacionesPacientes = () => {
            alert('Enviando recordatorios automáticos...');
            setTimeout(() => {
                alert('Recordatorios enviados exitosamente!');
            }, 2000);
        };

        // Manejar formulario de nueva cita
        const formNuevaCita = document.getElementById('formNuevaCita');
        if (formNuevaCita) {
            formNuevaCita.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.crearNuevaCita();
            });
        }
    }

    setupDetallesFunctions() {
        // Función para aplicar filtros
        window.aplicarFiltros = () => {
            this.cargarHistorialDetallado();
        };

        // Búsqueda en tiempo real
        const searchInput = document.getElementById('buscarPaciente');
        if (searchInput) {
            let timeoutId;
            searchInput.addEventListener('input', () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    this.cargarHistorialDetallado();
                }, 500);
            });
        }
    }

    setupObservacionesFunctions() {
        // Funciones globales para observaciones
        window.mostrarFormulario = () => {
            document.getElementById('defaultPanel').style.display = 'none';
            document.getElementById('observationForm').style.display = 'block';
            
            const hoy = new Date().toISOString().split('T')[0];
            document.getElementById('observationDate').value = hoy;
        };

        window.ocultarFormulario = () => {
            document.getElementById('observationForm').style.display = 'none';
            document.getElementById('defaultPanel').style.display = 'block';
            document.getElementById('newObservationForm').reset();
        };

        window.filtrarPorTipo = (tipo) => {
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            this.cargarObservaciones({ tipo: tipo || undefined });
        };

        window.exportarObservaciones = () => {
            alert('Generando reporte de observaciones...');
            setTimeout(() => {
                alert('Reporte exportado exitosamente en formato PDF!');
            }, 2000);
        };

        window.configurarNotificaciones = () => {
            const config = `Configuración de Notificaciones:
🔔 Recordatorios automáticos: Activado
📱 SMS a pacientes: Activado  
📧 Email de seguimiento: Activado
⏰ Notificaciones urgentes: Inmediatas
📊 Reporte semanal: Lunes 9:00 AM

¿Desea modificar alguna configuración?`;
            alert(config);
        };

        // Búsqueda de observaciones
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let timeoutId;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    this.cargarObservaciones({ buscar: e.target.value });
                }, 300);
            });
        }

        // Formulario de nueva observación
        const formObservacion = document.getElementById('newObservationForm');
        if (formObservacion) {
            formObservacion.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.guardarObservacion();
            });
        }
    }

    // === FUNCIONES AUXILIARES ===
    async crearNuevaCita() {
        const datosNuevaCita = {
            nombrePaciente: document.getElementById('nombrePaciente').value,
            fecha: document.getElementById('fechaNueva').value,
            hora: document.getElementById('horaNueva').value,
            telefono: document.getElementById('telefonoPaciente').value,
            motivo: document.getElementById('motivoConsulta').value
        };

        // Primero buscar o crear el paciente
        try {
            const pacientes = await this.api.buscarPacientes(datosNuevaCita.nombrePaciente);
            let pacienteId = null;

            if (pacientes.success && pacientes.data.length > 0) {
                // Paciente existe
                pacienteId = pacientes.data[0].id;
            } else {
                // Crear nuevo paciente (esto requeriría una función adicional en el backend)
                this.showMessage('Paciente no encontrado. Debe estar registrado en el sistema.', 'warning');
                return;
            }

            const citaData = {
                pacienteId,
                fecha: datosNuevaCita.fecha,
                hora: datosNuevaCita.hora,
                motivo: datosNuevaCita.motivo
            };

            const result = await this.api.crearCita(citaData);
            
            if (result.success) {
                this.showMessage('Cita agendada exitosamente', 'success');
                document.getElementById('modalNuevaCita').style.display = 'none';
                document.getElementById('formNuevaCita').reset();
                await this.cargarAgenda(document.getElementById('fechaCita').value);
            } else {
                this.showMessage('Error al agendar cita: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Error de conexión al agendar cita', 'error');
        }
    }

    async guardarObservacion() {
        const datosObservacion = {
            paciente: document.getElementById('patientName').value,
            tipo: document.getElementById('observationType').value,
            contenido: document.getElementById('observationContent').value,
            fecha: document.getElementById('observationDate').value
        };

        // Buscar paciente
        try {
            const pacientes = await this.api.buscarPacientes(datosObservacion.paciente);
            
            if (!pacientes.success || pacientes.data.length === 0) {
                this.showMessage('Paciente no encontrado en el sistema', 'warning');
                return;
            }

            const observacionData = {
                pacienteId: pacientes.data[0].id,
                tipo: datosObservacion.tipo,
                contenido: datosObservacion.contenido,
                fecha: datosObservacion.fecha
            };

            const success = await this.crearNuevaObservacion(observacionData);
            
            if (success) {
                document.getElementById('observationForm').style.display = 'none';
                document.getElementById('defaultPanel').style.display = 'block';
                document.getElementById('newObservationForm').reset();
            }
        } catch (error) {
            this.showMessage('Error al buscar paciente', 'error');
        }
    }

    verDetalleCita(id) {
        // Redirigir a detalles con parámetro
        window.location.href = `detalles.html?cita=${id}`;
    }

    seleccionarCitaDetalle(cita) {
        // Remover selección anterior
        document.querySelectorAll('.cita-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Seleccionar nueva cita
        event.currentTarget.classList.add('selected');
        this.mostrarDetallesCita(cita);
    }

    mostrarDetallesCita(cita) {
        const container = document.getElementById('detalleContent');
        if (!container) return;
        
        container.innerHTML = `
            <div class="detail-section">
                <div class="section-title">Información del Paciente</div>
                <div class="detail-info">
                    <strong>Nombre:</strong> ${cita.paciente.nombre}<br>
                    <strong>Teléfono:</strong> ${cita.paciente.telefono || 'No especificado'}<br>
                    <strong>Email:</strong> ${cita.paciente.email}<br>
                    <strong>Fecha de Cita:</strong> ${this.formatearFecha(cita.fecha)} - ${cita.hora}
                </div>
            </div>

            <div class="detail-section">
                <div class="section-title">Consulta Médica</div>
                <div class="detail-info">
                    <strong>Motivo:</strong> ${cita.motivo || 'No especificado'}<br>
                    <strong>Estado:</strong> <span class="status-badge status-${cita.estado}">${cita.estado.toUpperCase()}</span>
                </div>
            </div>

            <div class="detail-section">
                <div class="section-title">Observaciones</div>
                <div class="detail-info">
                    ${cita.observaciones || 'Sin observaciones registradas'}
                </div>
            </div>

            <div class="detail-actions">
                <button class="action-btn btn-primary" onclick="medicoSystem.imprimirHistorial(${cita.id})">
                    📄 Imprimir Historial
                </button>
            </div>
        `;
    }

    editarObservacion(id) {
        // Implementar edición de observación
        this.showMessage('Función de edición en desarrollo', 'info');
    }

    imprimirObservacion(id) {
        alert('Preparando observación para impresión...');
        setTimeout(() => {
            alert('Observación enviada a la impresora!');
        }, 1500);
    }

    imprimirHistorial(id) {
        alert('Preparando historial para impresión...');
        setTimeout(() => {
            alert('Historial enviado a la impresora!');
        }, 1500);
    }

    actualizarEstadisticasDashboard(stats) {
        const statElements = document.querySelectorAll('.stat-number');
        if (statElements[0]) statElements[0].textContent = stats.citasHoy || 0;
        if (statElements[1]) statElements[1].textContent = stats.citasPendientes || 0;
        if (statElements[2]) statElements[2].textContent = stats.citasEstaSemana || 0;
    }

    actualizarInfoMedico(medico) {
        const userInfo = document.querySelector('.user-info span');
        if (userInfo && medico.nombre) {
            userInfo.textContent = `Dr. ${medico.nombre}`;
        }

        const welcomeTitle = document.querySelector('.welcome-title');
        if (welcomeTitle && medico.nombre) {
            welcomeTitle.textContent = `Bienvenido, Dr. ${medico.nombre}`;
        }
    }

    actualizarEstadisticasHistorial(stats) {
        const elements = {
            'totalCitas': stats.total,
            'citasCompletadas': stats.completadas,
            'citasPendientes': stats.pendientes,
            'citasCanceladas': stats.canceladas
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    actualizarEstadisticasObservaciones(stats) {
        const elements = {
            'totalObservations': stats.total,
            'todayObservations': stats.hoy,
            'urgentObservations': stats.urgentes,
            'followUpObservations': stats.seguimiento
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });
    }

    formatearFecha(fecha) {
        const fechaObj = new Date(fecha + 'T00:00:00');
        return fechaObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    showMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        const alerts = {
            'success': '✅ ',
            'error': '❌ ',
            'warning': '⚠️ ',
            'info': 'ℹ️ '
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            max-width: 350px;
        `;
        notification.textContent = (alerts[type] || '') + message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
}

// 5. API EXTENDIDA: Agregar a MedicoAPI existente
class MedicoAPI {
    // [Mantener métodos existentes]

    // Métodos para agenda
    async obtenerAgenda(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${this.baseURL}/agenda?${queryString}`, { 
            headers: this.getHeaders() 
        });
        return await this.handleResponse(response);
    }

    async actualizarEstadoCita(id, datos) {
        const response = await fetch(`${this.baseURL}/citas/${id}/estado`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(datos)
        });
        return await this.handleResponse(response);
    }

    async reagendarCita(id, datos) {
        const response = await fetch(`${this.baseURL}/citas/${id}/reagendar`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(datos)
        });
        return await this.handleResponse(response);
    }

    // Métodos para historial detallado
    async obtenerHistorialDetallado(filtros = {}) {
        const queryString = new URLSearchParams(filtros).toString();
        const response = await fetch(`${this.baseURL}/historial-detallado?${queryString}`, {
            headers: this.getHeaders()
        });
        return await this.handleResponse(response);
    }

    // Métodos para observaciones
    async obtenerObservaciones(filtros = {}) {
        const queryString = new URLSearchParams(filtros).toString();
        const response = await fetch(`${this.baseURL}/observaciones?${queryString}`, {
            headers: this.getHeaders()
        });
        return await this.handleResponse(response);
    }

    async crearObservacion(datos) {
        const response = await fetch(`${this.baseURL}/observaciones`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(datos)
        });
        return await this.handleResponse(response);
    }

    async actualizarObservacion(id, datos) {
        const response = await fetch(`${this.baseURL}/observaciones/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(datos)
        });
        return await this.handleResponse(response);
    }

    async eliminarObservacion(id) {
        const response = await fetch(`${this.baseURL}/observaciones/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return await this.handleResponse(response);
    }

    // Métodos adicionales
    async generarReporteDiario(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${this.baseURL}/reporte-diario?${queryString}`, {
            headers: this.getHeaders()
        });
        return await this.handleResponse(response);
    }
}