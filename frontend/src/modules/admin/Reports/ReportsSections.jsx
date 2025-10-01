// frontend/src/modules/admin/components/Reports/ReportsSection.jsx

import React, { useState } from 'react';
import AdminAPI from '../../services/adminAPI';
import ReportItem from './ReportItem';
import './Reports.css';

const ReportsSection = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleGenerateReports = async () => {
    if (!startDate || !endDate) {
      alert('Por favor selecciona un rango de fechas válido');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('La fecha de inicio debe ser anterior a la fecha final');
      return;
    }

    try {
      setLoading(true);
      // Llamar a la API para generar reportes
      await AdminAPI.getReportes('dashboard-stats', { startDate, endDate });
      alert('Reportes generados exitosamente');
    } catch (error) {
      console.error('Error generando reportes:', error);
      alert('Error al generar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportType, format) => {
    try {
      const data = await AdminAPI.getReportes(reportType, { startDate, endDate });
      
      // Simular descarga (en producción usarías una librería como jsPDF o SheetJS)
      const filename = `${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;
      const content = JSON.stringify(data, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      
      alert(`Reporte descargado: ${filename}`);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      alert('Error al descargar reporte');
    }
  };

  return (
    <div className="admin-card card-reports">
      <div className="card-header">
        <h3 className="card-title">📊 Reportes del Sistema</h3>
        <span className="card-icon">📊</span>
      </div>

      <div className="form-section">
        <div className="form-group">
          <label>📅 Rango de fechas:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-success"
          onClick={handleGenerateReports}
          disabled={loading}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          {loading ? '⏳ Generando...' : '📈 Generar Reportes'}
        </button>

        <div className="reports-section">
          <ReportItem
            title="📅 Citas médicas por semana"
            description="Reporte detallado de citas programadas y completadas"
            onDownload={(format) => handleDownloadReport('citas', format)}
          />

          <ReportItem
            title="👥 Usuarios registrados"
            description="Estadísticas de registro y actividad de usuarios"
            onDownload={(format) => handleDownloadReport('usuarios', format)}
          />

          <ReportItem
            title="❌ Cancelaciones por médico"
            description="Análisis de cancelaciones por especialidad médica"
            onDownload={(format) => handleDownloadReport('medicos', format)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;