// frontend/src/modules/admin/components/Reports/ReportItem.jsx

import React from 'react';

const ReportItem = ({ title, description, onDownload }) => {
  return (
    <div className="report-item">
      <div className="report-info">
        <div className="report-title">{title}</div>
        <div className="report-description">{description}</div>
      </div>
      <div className="report-actions">
        <button
          className="btn btn-info btn-small"
          onClick={() => onDownload('pdf')}
        >
          📄 PDF
        </button>
        <button
          className="btn btn-success btn-small"
          onClick={() => onDownload('excel')}
        >
          📊 EXCEL
        </button>
      </div>
    </div>
  );
};

export default ReportItem;